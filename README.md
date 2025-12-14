# FlightBooker - Full Stack Flight Booking System

A complete flight booking system with dynamic pricing, wallet management, and PDF ticket generation.

## Features

- **Flight Search Module**: Database-driven flight search with 20 seeded flights
- **Dynamic Pricing Engine**: Surge pricing based on booking attempts
  - 10% price increase after 3 booking attempts within 5 minutes
  - Automatic price reset after 10 minutes
- **Wallet System**: Virtual wallet with ₹50,000 default balance
- **PDF Ticket Generation**: Downloadable tickets with complete booking details
- **Booking History**: Complete history with ticket re-download functionality
- **Responsive Design**: Beautiful UI built with TailwindCSS

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite (Build tool)
- TailwindCSS (Styling)
- Lucide React (Icons)

### Backend
- Supabase (Database & Edge Functions)
- PostgreSQL (Database)
- Supabase Edge Functions (Serverless API)

### Libraries
- @supabase/supabase-js (Client library)
- jsPDF (PDF generation)

## Database Schema

### Tables
- `flights` - Flight information
- `bookings` - Booking records
- `wallet` - User wallet balance
- `price_tracking` - Surge pricing logic

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- Supabase account (already configured)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd project
```

2. Install dependencies
```bash
npm install
```

3. Environment variables are already configured in `.env`

4. Database is already seeded with 20 flights

5. Start development server
```bash
npm run dev
```

6. Build for production
```bash
npm run build
```

## How It Works

### Flight Search
- Search through 20 pre-seeded flights
- Filter by city or airline
- View flight details including departure/arrival cities and times

### Dynamic Pricing
- System tracks booking attempts for each flight
- After 3 attempts within 5 minutes, price increases by 10%
- Price automatically resets to base price after 10 minutes

### Booking Process
1. Select a flight and click "Book Now"
2. Enter passenger name
3. System validates wallet balance
4. Deducts amount from wallet
5. Generates unique PNR
6. Creates booking record

### PDF Ticket
- Generated on-demand for any booking
- Includes: PNR, passenger name, flight details, route, price, booking date
- Downloadable from booking history

### Booking History
- View all past bookings
- Complete flight and payment details
- Re-download tickets anytime

## API Endpoints

### Edge Functions

#### `/functions/v1/process-booking` (POST)
Processes flight bookings with surge pricing logic
- Checks booking attempts
- Applies surge pricing if needed
- Validates wallet balance
- Creates booking record

#### `/functions/v1/generate-ticket` (GET)
Generates PDF tickets for bookings
- Query param: `bookingId`
- Returns PDF file

## Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Navigation and wallet display
│   ├── FlightCard.tsx          # Individual flight card
│   ├── FlightSearch.tsx        # Flight search and listing
│   ├── BookingModal.tsx        # Booking form modal
│   └── BookingHistory.tsx      # Booking history page
├── lib/
│   ├── supabase.ts            # Supabase client
│   └── database.types.ts      # TypeScript types
├── services/
│   └── flightService.ts       # API service layer
├── App.tsx                    # Main app component
└── main.tsx                   # Entry point

supabase/
└── functions/
    ├── process-booking/       # Booking edge function
    └── generate-ticket/       # PDF generation function
```

## Key Features Implementation

### Surge Pricing Logic
- Tracked in `price_tracking` table
- Monitors attempts within 5-minute windows
- Automatically resets after 10 minutes
- Real-time price calculation

### Wallet Management
- Single wallet for demo purposes
- Real-time balance updates
- Insufficient balance validation
- Transaction tracking through bookings

### Security
- Row Level Security (RLS) enabled on all tables
- Public access policies for demo
- Environment variables for sensitive data
- Secure edge function deployment

## Testing

1. Search for flights using city names or airline
2. Book a flight multiple times to see surge pricing
3. Check wallet balance updates
4. Download tickets from booking history
5. Wait 10 minutes to see price reset

## Production Ready Features

- TypeScript for type safety
- Error handling throughout
- Loading states
- Responsive design
- Clean code architecture
- Proper state management
- API service layer
- Database migrations
- Environment configuration

## Bonus Features Implemented

- Search by departure/arrival cities
- Surge pricing indicators
- Responsive UI with TailwindCSS
- Clean Git commit history
- Professional error handling
- Loading states
- Modal interactions
- Real-time wallet updates

## License

MIT
