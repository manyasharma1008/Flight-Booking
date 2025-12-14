import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { flightId, passengerName, userId = 'default_user' } = await req.json();

    const { data: flight, error: flightError } = await supabase
      .from('flights')
      .select('*')
      .eq('id', flightId)
      .maybeSingle();

    if (flightError || !flight) {
      return new Response(
        JSON.stringify({ error: 'Flight not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    let { data: priceTrack } = await supabase
      .from('price_tracking')
      .select('*')
      .eq('flight_id', flightId)
      .maybeSingle();

    let currentPrice = flight.base_price;
    let surgeApplied = false;

    if (priceTrack) {
      const firstAttempt = new Date(priceTrack.first_attempt_at);
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

      if (firstAttempt < tenMinutesAgo) {
        await supabase
          .from('price_tracking')
          .update({
            attempt_count: 1,
            first_attempt_at: now.toISOString(),
            current_price: flight.base_price,
            updated_at: now.toISOString(),
          })
          .eq('flight_id', flightId);
        currentPrice = flight.base_price;
      } else if (firstAttempt >= fiveMinutesAgo) {
        const newAttemptCount = priceTrack.attempt_count + 1;
        if (newAttemptCount >= 3) {
          currentPrice = flight.base_price * 1.1;
          surgeApplied = true;
        }
        await supabase
          .from('price_tracking')
          .update({
            attempt_count: newAttemptCount,
            current_price: currentPrice,
            updated_at: now.toISOString(),
          })
          .eq('flight_id', flightId);
      } else {
        await supabase
          .from('price_tracking')
          .update({
            attempt_count: priceTrack.attempt_count + 1,
            current_price: priceTrack.current_price,
            updated_at: now.toISOString(),
          })
          .eq('flight_id', flightId);
        currentPrice = priceTrack.current_price;
      }
    } else {
      await supabase
        .from('price_tracking')
        .insert({
          flight_id: flightId,
          attempt_count: 1,
          first_attempt_at: now.toISOString(),
          current_price: flight.base_price,
        });
    }

    const { data: wallet, error: walletError } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (walletError || !wallet) {
      return new Response(
        JSON.stringify({ error: 'Wallet not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (wallet.balance < currentPrice) {
      return new Response(
        JSON.stringify({ error: 'Insufficient wallet balance' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newBalance = wallet.balance - currentPrice;
    await supabase
      .from('wallet')
      .update({ balance: newBalance, updated_at: now.toISOString() })
      .eq('user_id', userId);

    const pnr = 'PNR' + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase();

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        pnr,
        flight_id: flightId,
        passenger_name: passengerName,
        price_paid: currentPrice,
        booking_date: now.toISOString(),
      })
      .select()
      .single();

    if (bookingError) {
      return new Response(
        JSON.stringify({ error: 'Booking failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        booking: {
          ...booking,
          flight,
          surgeApplied,
        },
        newBalance,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});