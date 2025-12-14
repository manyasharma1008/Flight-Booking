import { useState } from 'react';
import { Header } from './components/Header';
import { FlightSearch } from './components/FlightSearch';
import { BookingHistory } from './components/BookingHistory';

function App() {
  const [currentPage, setCurrentPage] = useState<'search' | 'history'>('search');

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      {currentPage === 'search' ? <FlightSearch /> : <BookingHistory />}
    </div>
  );
}

export default App;
