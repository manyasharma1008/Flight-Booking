import { useState, useEffect } from 'react';
import { Search, Loader } from 'lucide-react';
import { FlightCard } from './FlightCard';
import { BookingModal } from './BookingModal';
import { flightService, type Flight } from '../services/flightService';

export function FlightSearch() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async (query?: string) => {
    setLoading(true);
    try {
      const data = await flightService.getFlights(query);
      setFlights(data);
    } catch (error) {
      console.error('Error loading flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadFlights(searchQuery);
  };

  const handleBookingSuccess = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Search Flights</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, airline..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="animate-spin text-blue-600" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {flights.map((flight) => (
            <FlightCard
              key={flight.id}
              flight={flight}
              onBook={setSelectedFlight}
            />
          ))}
        </div>
      )}

      {!loading && flights.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No flights found</p>
        </div>
      )}

      {selectedFlight && (
        <BookingModal
          flight={selectedFlight}
          onClose={() => setSelectedFlight(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
