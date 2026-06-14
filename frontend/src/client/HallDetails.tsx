import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { MapPin, Clock, Circle, ArrowLeft, CheckCircle } from 'lucide-react';

interface Table {
  id: string;
  number: number;
  type: string;
  status: 'available' | 'occupied' | 'soon_available';
  pricePerHour: number;
}

interface Hall {
  id: string;
  name: string;
  address: string;
  city: string;
  openingTime: string;
  closingTime: string;
  tables: Table[];
}

const HallDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState<Hall | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  useEffect(() => {
    fetchHall();
  }, [id]);

  const fetchHall = async () => {
    try {
      const res = await api.get('/pool-halls');
      const found = res.data.find((h: any) => h.id === id);
      setHall(found);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async () => {
    if (!selectedTable) return;
    setBookingStatus('loading');
    try {
      // Mock booking for 1 hour from now
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
      
      await api.post('/bookings', {
        tableId: selectedTable.id,
        startTime,
        endTime
      });
      
      setBookingStatus('success');
      setTimeout(() => {
        setBookingStatus('idle');
        setSelectedTable(null);
        fetchHall();
      }, 3000);
    } catch (err) {
      alert('Booking failed. The table might have been taken.');
      setBookingStatus('idle');
    }
  };

  if (!hall) return <div className="text-center py-20">Loading Hall Details...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} /> Back to Discovery
      </button>

      <div className="bg-secondary rounded-3xl p-8 border border-gray-800 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter text-accent">{hall.name}</h2>
          <div className="flex flex-wrap gap-4 mt-4 text-gray-400">
            <span className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full text-sm">
              <MapPin size={16} /> {hall.address}, {hall.city}
            </span>
            <span className="flex items-center gap-2 bg-primary px-3 py-1 rounded-full text-sm">
              <Clock size={16} /> {hall.openingTime} - {hall.closingTime}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-500 uppercase font-bold text-[10px] tracking-widest mb-1">Live Capacity</p>
          <div className="text-3xl font-black text-white">
            {hall.tables.filter(t => t.status === 'available').length} / {hall.tables.length}
          </div>
          <p className="text-success text-xs font-bold uppercase">Tables Ready</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Selection */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {hall.tables.map((table) => (
            <div 
              key={table.id}
              onClick={() => table.status === 'available' && setSelectedTable(table)}
              className={`
                relative p-8 rounded-[2rem] border transition-all cursor-pointer group
                ${table.status !== 'available' ? 'opacity-40 cursor-not-allowed border-gray-800 bg-gray-900/50' : 
                  selectedTable?.id === table.id ? 'border-accent bg-accent/5 shadow-[0_0_40px_rgba(0,255,136,0.1)]' : 
                  'border-gray-800 bg-secondary hover:border-accent/40'}
              `}
            >
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Table</span>
                    <h4 className="text-4xl font-black italic text-white group-hover:text-accent transition-colors">#{table.number}</h4>
                 </div>
                 <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                   table.status === 'available' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
                 }`}>
                   {table.status}
                 </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{table.type}</p>
                <p className="text-sm font-black text-accent">${table.pricePerHour}<span className="text-[10px] text-gray-600">/hr</span></p>
              </div>
              
              {table.status === 'available' && (
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-primary shadow-lg">
                     <CheckCircle size={16} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Booking Sidebar */}
        <div className="bg-secondary rounded-3xl p-8 border border-gray-800 h-fit sticky top-28">
          <h3 className="text-xl font-bold mb-6">Reservation Details</h3>
          
          {selectedTable ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-primary p-4 rounded-xl border border-gray-800">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Selected Table</p>
                  <p className="text-xl font-black">#{selectedTable.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Rate</p>
                  <p className="text-accent font-bold">${selectedTable.pricePerHour}/hr</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-400">Time Slot: <span className="text-white font-medium">1 Hour (Now)</span></p>
                <p className="text-sm text-gray-400">Total Price: <span className="text-accent font-bold text-lg">${selectedTable.pricePerHour}</span></p>
              </div>

              {bookingStatus === 'success' ? (
                <div className="bg-success/10 text-success p-4 rounded-xl flex items-center gap-3 font-bold border border-success/20">
                  <CheckCircle size={20} /> Booking Confirmed!
                </div>
              ) : (
                <button 
                  onClick={handleBooking}
                  disabled={bookingStatus === 'loading'}
                  className="w-full bg-accent text-primary py-4 rounded-xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {bookingStatus === 'loading' ? 'Processing...' : 'Confirm Booking'}
                </button>
              )}
              
              <p className="text-[10px] text-gray-500 text-center uppercase font-bold tracking-widest">
                Payment handled at the pool hall
              </p>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
                <Circle size={24} className="text-gray-700" />
              </div>
              <p className="text-sm font-medium">Select an available table to start your booking.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HallDetails;
