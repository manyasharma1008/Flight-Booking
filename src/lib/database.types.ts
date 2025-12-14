export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      flights: {
        Row: {
          id: string
          flight_number: string
          airline: string
          departure_city: string
          arrival_city: string
          base_price: number
          departure_time: string
          arrival_time: string
          created_at: string
        }
        Insert: {
          id?: string
          flight_number: string
          airline: string
          departure_city: string
          arrival_city: string
          base_price: number
          departure_time: string
          arrival_time: string
          created_at?: string
        }
        Update: {
          id?: string
          flight_number?: string
          airline?: string
          departure_city?: string
          arrival_city?: string
          base_price?: number
          departure_time?: string
          arrival_time?: string
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          pnr: string
          flight_id: string
          passenger_name: string
          price_paid: number
          booking_date: string
          created_at: string
        }
        Insert: {
          id?: string
          pnr: string
          flight_id: string
          passenger_name: string
          price_paid: number
          booking_date?: string
          created_at?: string
        }
        Update: {
          id?: string
          pnr?: string
          flight_id?: string
          passenger_name?: string
          price_paid?: number
          booking_date?: string
          created_at?: string
        }
      }
      wallet: {
        Row: {
          id: string
          user_id: string
          balance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          created_at?: string
          updated_at?: string
        }
      }
      price_tracking: {
        Row: {
          id: string
          flight_id: string
          attempt_count: number
          first_attempt_at: string
          current_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          flight_id: string
          attempt_count?: number
          first_attempt_at?: string
          current_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          flight_id?: string
          attempt_count?: number
          first_attempt_at?: string
          current_price?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
