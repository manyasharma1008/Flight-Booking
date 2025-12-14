import { useState } from 'react';
import { X, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import type { Flight } from '../services/flightService';
import { flightService } from '../services/flightService';

interface BookingModalProps {
  flight: Flight;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({ flight, onClose, onSuccess }: BookingModalProps) {
  const [passengerName, setPassengerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await flightService.bookFlight(flight.id, passengerName);
      setBookingDetails(result.booking);
      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success && bookingDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
          <div className="text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Successful!</h2>
            <p className="text-gray-600 mb-4">Your ticket has been booked successfully</p>

            {bookingDetails.surgeApplied && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                <TrendingUp className="text-orange-600 flex-shrink-0 mt-1" size={20} />
                <p className="text-sm text-orange-800 text-left">
                  Surge pricing applied due to high demand on this flight
                </p>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">PNR</p>
                  <p className="font-semibold text-gray-800">{bookingDetails.pnr}</p>
                </div>
                <div>
                  <p className="text-gray-500">Amount Paid</p>
                  <p className="font-semibold text-gray-800">₹{Number(bookingDetails.price_paid).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Book Flight</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="font-semibold text-gray-700">{flight.airline}</p>
            <p className="text-sm text-gray-500">{flight.flight_number}</p>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {flight.departure_city} → {flight.arrival_city}
          </p>
          <p className="text-2xl font-bold text-blue-600">₹{flight.base_price}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Passenger Name
            </label>
            <input
              type="text"
              value={passengerName}
              onChange={(e) => setPassengerName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter full name"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
