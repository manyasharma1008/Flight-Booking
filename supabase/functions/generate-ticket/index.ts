import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import { jsPDF } from 'npm:jspdf@2.5.1';

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

    const url = new URL(req.url);
    const bookingId = url.searchParams.get('bookingId');

    if (!bookingId) {
      return new Response(
        JSON.stringify({ error: 'Booking ID required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, flights(*)')
      .eq('id', bookingId)
      .maybeSingle();

    if (bookingError || !booking) {
      return new Response(
        JSON.stringify({ error: 'Booking not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const doc = new jsPDF();

    doc.setFontSize(24);
    doc.text('FLIGHT TICKET', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text('_'.repeat(60), 20, 25);

    doc.setFontSize(14);
    doc.text('Booking Details', 20, 40);

    doc.setFontSize(11);
    const details = [
      `PNR: ${booking.pnr}`,
      `Passenger Name: ${booking.passenger_name}`,
      ``,
      `Flight Details`,
      `Airline: ${booking.flights.airline}`,
      `Flight Number: ${booking.flights.flight_number}`,
      ``,
      `Route: ${booking.flights.departure_city} → ${booking.flights.arrival_city}`,
      `Departure: ${booking.flights.departure_time}`,
      `Arrival: ${booking.flights.arrival_time}`,
      ``,
      `Payment Details`,
      `Price Paid: ₹${Number(booking.price_paid).toFixed(2)}`,
      `Booking Date: ${new Date(booking.booking_date).toLocaleString('en-IN')}`,
    ];

    let yPos = 55;
    details.forEach((line) => {
      doc.text(line, 20, yPos);
      yPos += 8;
    });

    doc.setFontSize(10);
    doc.text('_'.repeat(60), 20, yPos + 10);
    doc.text('Thank you for booking with us!', 105, yPos + 20, { align: 'center' });
    doc.text('Have a safe journey!', 105, yPos + 28, { align: 'center' });

    const pdfBuffer = doc.output('arraybuffer');

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="ticket_${booking.pnr}.pdf"`,
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});