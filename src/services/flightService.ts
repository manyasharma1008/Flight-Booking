import { supabase } from '../lib/supabase';

export interface Flight {
  id: string;
  flight_number: string;
  airline: string;
  departure_city: string;
  arrival_city: string;
  base_price: number;
  departure_time: string;
  arrival_time: string;
}

export interface Booking {
  id: string;
  pnr: string;
  flight_id: string;
  passenger_name: string;
  price_paid: number;
  booking_date: string;
  flights?: Flight;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
}

export const flightService = {
  async getFlights(searchQuery?: string) {
    let query = supabase.from('flights').select('*').limit(10);

    if (searchQuery) {
      query = query.or(
        `departure_city.ilike.%${searchQuery}%,arrival_city.ilike.%${searchQuery}%,airline.ilike.%${searchQuery}%`
      );
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Flight[];
  },

  async getWalletBalance(userId: string = 'default_user') {
    const { data, error } = await supabase
      .from('wallet')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data as Wallet;
  },

  async bookFlight(flightId: string, passengerName: string) {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-booking`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          flightId,
          passengerName,
          userId: 'default_user',
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Booking failed');
    }

    return result;
  },

  async getBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, flights(*)')
      .order('booking_date', { ascending: false });

    if (error) throw error;
    return data as Booking[];
  },

  async downloadTicket(bookingId: string) {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-ticket?bookingId=${bookingId}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to generate ticket');
    }

    const blob = await response.blob();
    return blob;
  },
};
