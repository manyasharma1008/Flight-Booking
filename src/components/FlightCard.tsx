import { Plane, Clock, MapPin } from 'lucide-react';
import type { Flight } from '../services/flightService';

interface FlightCardProps {
  flight: Flight;
  onBook: (flight: Flight) => void;
}

export function FlightCard({ flight, onBook }: FlightCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <Plane className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{flight.airline}</h3>
            <p className="text-sm text-gray-500">{flight.flight_number}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-blue-600">₹{flight.base_price}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-gray-400" />
            <p className="text-lg font-semibold text-gray-700">{flight.departure_city}</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <p className="text-sm text-gray-500">{flight.departure_time}</p>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="border-t-2 border-dashed border-gray-300 w-full mt-4 relative">
            <Plane
              size={20}
              className="text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2"
            />
          </div>
        </div>

        <div className="flex-1 text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <p className="text-lg font-semibold text-gray-700">{flight.arrival_city}</p>
            <MapPin size={16} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-2 justify-end">
            <p className="text-sm text-gray-500">{flight.arrival_time}</p>
            <Clock size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      <button
        onClick={() => onBook(flight)}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
      >
        Book Now
      </button>
    </div>
  );
}
