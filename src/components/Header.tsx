import { Wallet, Plane } from 'lucide-react';
import { useEffect, useState } from 'react';
import { flightService } from '../services/flightService';

interface HeaderProps {
  onNavigate: (page: 'search' | 'history') => void;
  currentPage: 'search' | 'history';
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    loadBalance();
  }, []);

  const loadBalance = async () => {
    try {
      const wallet = await flightService.getWalletBalance();
      setBalance(wallet.balance);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Plane size={32} />
            <h1 className="text-2xl font-bold">FlightBooker</h1>
          </div>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('search')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentPage === 'search'
                  ? 'bg-white text-blue-800 font-semibold'
                  : 'hover:bg-blue-700'
              }`}
            >
              Search Flights
            </button>
            <button
              onClick={() => onNavigate('history')}
              className={`px-4 py-2 rounded-lg transition-all ${
                currentPage === 'history'
                  ? 'bg-white text-blue-800 font-semibold'
                  : 'hover:bg-blue-700'
              }`}
            >
              My Bookings
            </button>
            <div className="flex items-center gap-2 bg-blue-700 px-4 py-2 rounded-lg">
              <Wallet size={20} />
              <span className="font-semibold">₹{balance.toFixed(2)}</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
