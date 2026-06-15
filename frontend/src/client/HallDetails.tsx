import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../store/AuthContext";
import { MapPin, Clock, Circle, ArrowLeft, CheckCircle } from "lucide-react";

interface Table {
  id: string;
  number: number;
  type: string;
  status: string;
  pricePerHour: number;
}

interface Hall {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  openingTime: string;
  closingTime: string;
  tables: Table[];
  promotionType: 'none' | 'percentage' | 'free';
  promotionValue: number;
}

const HallDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hall, setHall] = useState<Hall | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const [matches, setMatches] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchHall();
    fetchMatches();
  }, [id]);

  const fetchHall = async () => {
    try {
      const res = await api.get("/pool-halls");
      const found = res.data.find((h: any) => h.id === id);
      setHall(found);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMatches = async () => {
    try {
      const res = await api.get(`/matches?hallId=${id}&status=live`);
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('12:00');
  const [duration, setDuration] = useState(1); // Hours

  const calculateTotalPrice = () => {
    if (!selectedTable || !hall) return 0;
    const basePrice = selectedTable.pricePerHour * duration;
    if (hall.promotionType === 'free') return 0;
    if (hall.promotionType === 'percentage') {
      return basePrice * (1 - hall.promotionValue / 100);
    }
    return basePrice;
  };

  const handleBooking = async () => {
    if (!selectedTable) return;

    // Simple validation
    const start = new Date(`${bookingDate}T${bookingTime}`);
    if (isNaN(start.getTime())) {
      alert('Invalid date or time.');
      return;
    }
    if (start < new Date()) {
      alert('Cannot book in the past.');
      return;
    }

    setBookingStatus('loading');
    try {
      const endTime = new Date(start.getTime() + duration * 60 * 60 * 1000);

      await api.post('/bookings', {
        tableId: selectedTable.id,
        startTime: start,
        endTime: endTime
      });

      setBookingStatus('success');
      setTimeout(() => {
        setBookingStatus('idle');
        setSelectedTable(null);
        fetchHall();
      }, 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Booking failed. The table might have been taken.');
      setBookingStatus('idle');
    }
  };

    const handleJoinMatch = async (matchId: string) => {
    if (user?.role !== "player") {
      alert("Only players can join matches.");
      return;
    }
    try {
      await api.post(`/matches/${matchId}/join`);
      alert("You have joined the match!");
      fetchMatches();
    } catch (err) {
      alert("Failed to join match.");
    }
  };

  if (!hall)
    return <div className="text-center py-20">Loading Hall Details...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} /> Back to Discovery
      </button>

      <div className="bg-secondary rounded-3xl p-8 border border-gray-800 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter text-accent">
            {hall.name}
          </h2>
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
          <p className="text-gray-500 uppercase font-bold text-[10px] tracking-widest mb-1">
            Live Capacity
          </p>
          <div className="text-3xl font-black text-white">
            {hall.tables?.filter((t) => t.status === "available").length} /{" "}
            {hall.tables?.length}
          </div>
          <p className="text-success text-xs font-bold uppercase">
            Tables Ready
          </p>
        </div>
      </div>

      {/* Live Matches Section ... */}

      {/* Live Matches Section */}
      {matches.length > 0 && (
        <div className="bg-primary/30 p-8 rounded-3xl border border-accent/20">
          <h3 className="text-xl font-black italic mb-6 text-accent uppercase tracking-widest flex items-center gap-3">
            <Circle
              size={12}
              className="fill-accent text-accent animate-pulse"
            />{" "}
            Live Matches Looking for Opponents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches
              .filter((m) => !m.player2Id)
              .map((match) => (
                <div
                  key={match.id}
                  className="bg-secondary p-6 rounded-2xl border border-gray-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Table #{match.table?.number}
                      </span>
                      <span className="bg-accent/10 text-accent px-2 py-0.5 rounded text-[10px] font-black uppercase">
                        Open for Join
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center font-black text-white italic">
                        {match.player1?.name?.[0].toUpperCase() || "P"}
                      </div>
                      <div>
                        <p className="text-sm font-black">
                          {match.player1?.name || match.player1Name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          Waiting for Opponent...
                        </p>
                      </div>
                    </div>
                  </div>
                  {user?.role === "player" && (
                    <button
                      onClick={() => handleJoinMatch(match.id)}
                      className="w-full bg-accent text-primary py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-white transition-all"
                    >
                      Join Match
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Selection */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-6">
          {hall.tables?.map((table) => (
            <div
              key={table.id}
              onClick={() =>
                table.status === "available" && setSelectedTable(table)
              }
              className={`
                relative p-8 rounded-[2rem] border transition-all cursor-pointer group
                ${
                  table.status !== "available"
                    ? "opacity-40 cursor-not-allowed border-gray-800 bg-gray-900/50"
                    : selectedTable?.id === table.id
                      ? "border-accent bg-accent/5 shadow-[0_0_40px_rgba(0,255,136,0.1)]"
                      : "border-gray-800 bg-secondary hover:border-accent/40"
                }
              `}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">
                    Table
                  </span>
                  <h4 className="text-4xl font-black italic text-white group-hover:text-accent transition-colors">
                    #{table.number}
                  </h4>
                </div>
                <div
                  className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                    table.status === "available"
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {table.status}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {table.type}
                </p>
                <p className="text-sm font-black text-accent">
                  ${table.pricePerHour}
                  <span className="text-[10px] text-gray-600">/hr</span>
                </p>
              </div>

              {table.status === "available" && (
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
                  <p className="text-[10px] text-gray-500 uppercase font-bold">
                    Selected Table
                  </p>
                  <p className="text-xl font-black">#{selectedTable.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">
                    Rate
                  </p>
                  <p className="text-accent font-bold">
                    ${selectedTable.pricePerHour}/hr
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Date</label>
                  <input 
                    type="date" 
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-primary border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Start Time</label>
                  <input 
                    type="time" 
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-primary border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:border-accent outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Duration (Hours)</label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-primary border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:border-accent outline-none"
                  >
                    {[1, 2, 3, 4, 5].map(h => (
                      <option key={h} value={h}>{h} {h === 1 ? 'Hour' : 'Hours'}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-4 border-t border-gray-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-400 font-bold uppercase tracking-tighter">Subtotal</p>
                    <p className="text-white font-black text-xl">${selectedTable.pricePerHour * duration}</p>
                  </div>
                  {hall.promotionType !== 'none' && (
                    <div className="flex justify-between items-center text-accent animate-pulse">
                      <p className="text-[10px] font-black uppercase tracking-widest">Promotion: {hall.promotionType === 'free' ? 'FREE MATCH' : `${hall.promotionValue}% OFF`}</p>
                      <p className="text-sm font-black italic">
                        -{hall.promotionType === 'free' ? `$${selectedTable.pricePerHour * duration}` : `$${(selectedTable.pricePerHour * duration * hall.promotionValue) / 100}`}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-800/50">
                    <p className="text-sm text-white font-black uppercase tracking-tighter">Total Price</p>
                    <p className="text-accent font-black text-3xl">${calculateTotalPrice()}</p>
                  </div>
                </div>
              </div>

              {bookingStatus === "success" ? (
                <div className="bg-success/10 text-success p-4 rounded-xl flex items-center gap-3 font-bold border border-success/20">
                  <CheckCircle size={20} /> Booking Confirmed!
                </div>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={bookingStatus === "loading"}
                  className="w-full bg-accent text-primary py-4 rounded-xl font-black uppercase tracking-tighter hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  {bookingStatus === "loading"
                    ? "Processing..."
                    : "Confirm Booking"}
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
              <p className="text-sm font-medium">
                Select an available table to start your booking.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HallDetails;
