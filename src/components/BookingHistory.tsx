import { useState, useEffect } from 'react';
import { Download, Ticket, Loader, Calendar, CreditCard } from 'lucide-react';
import { flightService, type Booking } from '../services/flightService';

export function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await flightService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async (bookingId: string, pnr: string) => {
    setDownloadingId(bookingId);
    try {
      const blob = await flightService.downloadTicket(bookingId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ticket_${pnr}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading ticket:', error);
      alert('Failed to download ticket');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader className="animate-spin text-blue-600" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <Ticket className="mx-auto text-gray-300 mb-4" size={64} />
          <p className="text-gray-500 text-lg">No bookings yet</p>
          <p className="text-gray-400 text-sm mt-2">Start by searching and booking a flight</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Ticket className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {booking.flights?.airline}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {booking.flights?.flight_number}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Passenger</p>
                      <p className="font-semibold text-gray-800">{booking.passenger_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Route</p>
                      <p className="font-semibold text-gray-800">
                        {booking.flights?.departure_city} → {booking.flights?.arrival_city}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">PNR</p>
                      <p className="font-semibold text-blue-600">{booking.pnr}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>{new Date(booking.booking_date).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <CreditCard size={16} />
                      <span className="font-semibold">₹{Number(booking.price_paid).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownloadTicket(booking.id, booking.pnr)}
                  disabled={downloadingId === booking.id}
                  className="ml-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {downloadingId === booking.id ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      <span>Download Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
