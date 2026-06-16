import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../store/AuthContext";
import { MapPin, Clock, Circle, ArrowLeft, CheckCircle, Users, User, Search, Plus, Mail } from "lucide-react";

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

  // Opponent Selection State
  const [opponentType, setOpponentType] = useState<'open' | 'account' | 'guest'>('open');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedOpponent, setSelectedOpponent] = useState<{id: string, name: string} | null>(null);
  const [guestData, setGuestData] = useState({ name: '', email: '' });

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

  const handleSearchUsers = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/users?search=${query}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
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

    if (opponentType === 'guest' && (!guestData.name || !guestData.email)) {
      alert('Please provide guest name and email for verification.');
      return;
    }
    if (opponentType === 'account' && !selectedOpponent) {
      alert('Please select an opponent from the platform.');
      return;
    }

    setBookingStatus('loading');
    try {
      const endTime = new Date(start.getTime() + duration * 60 * 60 * 1000);

      await api.post('/bookings', {
        tableId: selectedTable.id,
        startTime: start,
        endTime: endTime,
        player2Id: opponentType === 'account' ? selectedOpponent?.id : null,
        player2Name: opponentType === 'account' ? selectedOpponent?.name : (opponentType === 'guest' ? guestData.name : null),
        player2Email: opponentType === 'guest' ? guestData.email : null,
      });

      setBookingStatus('success');
      setTimeout(() => {
        setBookingStatus('idle');
        setSelectedTable(null);
        fetchHall();
        setOpponentType('open');
        setSelectedOpponent(null);
        setGuestData({ name: '', email: '' });
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
    return <div className="text-center py-20 font-black italic animate-pulse text-accent">LOADING ARENA DETAILS...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest"
      >
        <ArrowLeft size={16} /> Back to Discovery
      </button>

      {/* Hall Hero Header */}
      <div className="bg-secondary/50 rounded-[3rem] p-12 border border-white/10 flex flex-col md:flex-row justify-between items-start gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <MapPin size={240} />
        </div>
        <div className="relative">
          <h2 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
            {hall.name}
          </h2>
          <div className="flex flex-wrap gap-4 mt-6">
            <span className="flex items-center gap-2 bg-primary px-4 py-2 rounded-xl text-xs font-bold border border-white/5">
              <MapPin size={16} className="text-accent" /> {hall.address}, {hall.city}
            </span>
            <span className="flex items-center gap-2 bg-primary px-4 py-2 rounded-xl text-xs font-bold border border-white/5">
              <Clock size={16} className="text-accent" /> {hall.openingTime} - {hall.closingTime}
            </span>
          </div>
        </div>
        <div className="text-right relative">
          <p className="text-gray-500 uppercase font-black text-[10px] tracking-[0.3em] mb-2">
            Arena Status
          </p>
          <div className="text-5xl font-black text-white italic">
            {hall.tables?.filter((t) => t.status === "available").length} /{" "}
            {hall.tables?.length}
          </div>
          <p className="text-accent text-xs font-black uppercase tracking-widest mt-2">
            Tables Ready for Play
          </p>
        </div>
      </div>

      {/* Live Matches Section */}
      {matches.length > 0 && (
        <div className="bg-accent/5 p-10 rounded-[3rem] border border-accent/20">
          <h3 className="text-2xl font-black italic mb-8 text-accent uppercase tracking-tighter flex items-center gap-4">
            <Circle
              size={14}
              className="fill-accent text-accent animate-pulse"
            />{" "}
            Open Challenges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches
              .filter((m) => !m.player2Id)
              .map((match) => (
                <div
                  key={match.id}
                  className="bg-secondary rounded-[2.5rem] p-8 border border-white/5 flex flex-col justify-between group hover:border-accent/40 transition-all shadow-xl"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Table #{match.table?.number}
                      </span>
                      <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-lg text-[10px] font-black uppercase italic">
                        <Users size={12} /> Live Call
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-primary rounded-2xl border border-white/10 flex items-center justify-center font-black text-white text-2xl italic group-hover:scale-110 transition-transform">
                        {match.player1?.name?.[0].toUpperCase() || "P"}
                      </div>
                      <div>
                        <p className="text-lg font-black italic uppercase text-white">
                          {match.player1?.name || match.player1Name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          Awaiting Challenger
                        </p>
                      </div>
                    </div>
                  </div>
                  {user?.role === "player" && (
                    <button
                      onClick={() => handleJoinMatch(match.id)}
                      className="w-full bg-accent text-primary py-4 rounded-2xl text-sm font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent/20"
                    >
                      Accept Challenge
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Table Selection */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {hall.tables?.map((table) => (
            <div
              key={table.id}
              onClick={() =>
                table.status === "available" && setSelectedTable(table)
              }
              className={`
                relative p-10 rounded-[3rem] border-2 transition-all cursor-pointer group
                ${
                  table.status !== "available"
                    ? "opacity-30 cursor-not-allowed border-gray-800 bg-gray-900/50"
                    : selectedTable?.id === table.id
                      ? "border-accent bg-accent/5 shadow-[0_0_50px_rgba(0,255,136,0.1)] scale-[1.02]"
                      : "border-white/5 bg-secondary/30 hover:border-accent/30"
                }
              `}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-1">
                    Arena Table
                  </span>
                  <h4 className="text-5xl font-black italic text-white group-hover:text-accent transition-colors">
                    #{table.number}
                  </h4>
                </div>
                <div
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase italic tracking-widest ${
                    table.status === "available"
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                  }`}
                >
                  {table.status}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {table.type}
                </p>
                <div className="flex items-baseline gap-1">
                   <span className="text-2xl font-black text-accent">${table.pricePerHour}</span>
                   <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">/ Hour</span>
                </div>
              </div>

              {table.status === "available" && (
                <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <div className="w-10 h-10 bg-accent rounded-2xl flex items-center justify-center text-primary shadow-xl shadow-accent/20">
                    <CheckCircle size={20} />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Booking Sidebar */}
        <div className="bg-secondary/40 rounded-[3rem] p-10 border border-white/10 h-fit sticky top-28 shadow-2xl">
          <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-8">Reservation Info</h3>

          {selectedTable ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-primary p-6 rounded-[2rem] border border-white/5">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">
                    Table Unit
                  </p>
                  <p className="text-3xl font-black italic text-white">#{selectedTable.number}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">
                    Match Rate
                  </p>
                  <p className="text-accent font-black text-xl italic">
                    ${selectedTable.pricePerHour}/hr
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block ml-1">Event Date</label>
                    <input 
                      type="date" 
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-primary border border-white/10 rounded-2xl px-4 py-4 text-sm text-white font-bold focus:border-accent outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block ml-1">Break Time</label>
                    <input 
                      type="time" 
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-primary border border-white/10 rounded-2xl px-4 py-4 text-sm text-white font-bold focus:border-accent outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block ml-1">Session Duration</label>
                  <select 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-primary border border-white/10 rounded-2xl px-4 py-4 text-sm text-white font-bold focus:border-accent outline-none transition-colors appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                      <option key={h} value={h}>{h} {h === 1 ? 'Hour' : 'Hours'} Session</option>
                    ))}
                  </select>
                </div>

                {/* Opponent Selection UI */}
                <div className="pt-6 border-t border-white/5 space-y-6">
                   <div>
                      <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-4 block ml-1">Opponent Preference</label>
                      <div className="grid grid-cols-3 gap-2">
                         {[
                           { id: 'open', label: 'Open Call', icon: <Users size={14}/> },
                           { id: 'account', label: 'Platform', icon: <User size={14}/> },
                           { id: 'guest', label: 'Verified Guest', icon: <Mail size={14}/> }
                         ].map(opt => (
                           <button
                             key={opt.id}
                             onClick={() => setOpponentType(opt.id as any)}
                             className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${opponentType === opt.id ? 'bg-accent/10 border-accent text-accent' : 'bg-primary border-white/5 text-gray-500 hover:text-white hover:border-white/10'}`}
                           >
                             {opt.icon}
                             <span className="text-[8px] font-black uppercase tracking-tighter">{opt.label}</span>
                           </button>
                         ))}
                      </div>
                   </div>

                   {opponentType === 'account' && (
                     <div className="space-y-4 animate-in slide-in-from-top-2">
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                          <input 
                            type="text" 
                            placeholder="Search player name..."
                            value={searchQuery}
                            onChange={(e) => handleSearchUsers(e.target.value)}
                            className="w-full bg-primary border border-white/10 pl-12 pr-4 py-3 rounded-xl text-xs text-white font-bold outline-none focus:border-accent"
                          />
                        </div>
                        {selectedOpponent && (
                           <div className="bg-accent/10 p-3 rounded-xl border border-accent/20 flex justify-between items-center">
                              <span className="text-xs font-black text-accent uppercase">{selectedOpponent.name}</span>
                              <button onClick={() => setSelectedOpponent(null)} className="text-accent hover:text-white"><X size={14}/></button>
                           </div>
                        )}
                        {searchQuery && searchResults.length > 0 && !selectedOpponent && (
                          <div className="bg-primary rounded-xl border border-white/5 overflow-hidden divide-y divide-white/5">
                             {searchResults.map(p => (
                               <button 
                                 key={p.id}
                                 onClick={() => {
                                   setSelectedOpponent({ id: p.id, name: p.name });
                                   setSearchQuery('');
                                 }}
                                 className="w-full text-left p-3 hover:bg-accent/5 transition-colors text-xs font-bold"
                               >
                                 {p.name}
                               </button>
                             ))}
                          </div>
                        )}
                     </div>
                   )}

                   {opponentType === 'guest' && (
                     <div className="space-y-3 animate-in slide-in-from-top-2">
                        <input 
                          type="text" 
                          placeholder="Guest Full Name"
                          value={guestData.name}
                          onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                          className="w-full bg-primary border border-white/10 px-4 py-3 rounded-xl text-xs text-white font-bold outline-none focus:border-accent"
                        />
                        <input 
                          type="email" 
                          placeholder="Verification Email"
                          value={guestData.email}
                          onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                          className="w-full bg-primary border border-white/10 px-4 py-3 rounded-xl text-xs text-white font-bold outline-none focus:border-accent"
                        />
                        <p className="text-[9px] text-gray-600 font-bold uppercase text-center">Guest will receive a verification link</p>
                     </div>
                   )}

                   {opponentType === 'open' && (
                     <div className="bg-accent/5 p-4 rounded-2xl border border-accent/10 text-center animate-in fade-in">
                        <p className="text-[10px] text-accent font-black uppercase tracking-widest">Broadcast Open Challenge</p>
                        <p className="text-[9px] text-gray-500 mt-1">Other players in the arena can join your match.</p>
                     </div>
                   )}
                </div>

                <div className="pt-6 border-t border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Session Subtotal</p>
                    <p className="text-white font-black text-2xl italic tabular-nums">${selectedTable.pricePerHour * duration}</p>
                  </div>
                  {hall.promotionType !== 'none' && (
                    <div className="flex justify-between items-center text-accent animate-pulse">
                      <p className="text-[10px] font-black uppercase tracking-widest">Member Reward: {hall.promotionType === 'free' ? 'FREE MATCH' : `${hall.promotionValue}% OFF`}</p>
                      <p className="text-sm font-black italic">
                        -{hall.promotionType === 'free' ? `$${selectedTable.pricePerHour * duration}` : `$${(selectedTable.pricePerHour * duration * hall.promotionValue) / 100}`}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <p className="text-xs text-white font-black uppercase tracking-[0.3em]">Final Price</p>
                    <p className="text-accent font-black text-4xl italic tabular-nums">${calculateTotalPrice()}</p>
                  </div>
                </div>
              </div>

              {bookingStatus === "success" ? (
                <div className="bg-emerald-500/10 text-emerald-500 p-6 rounded-[2rem] flex items-center gap-4 font-black uppercase tracking-widest text-xs border border-emerald-500/20 shadow-lg shadow-emerald-500/10 animate-in zoom-in-95">
                  <CheckCircle size={24} /> Arena Secured!
                </div>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={bookingStatus === "loading"}
                  className="w-full bg-accent text-primary py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm italic hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20 disabled:opacity-50"
                >
                  {bookingStatus === "loading"
                    ? "Securing Arena..."
                    : "Confirm Match Session"}
                </button>
              )}

              <p className="text-[9px] text-gray-600 text-center uppercase font-black tracking-[0.4em] leading-relaxed">
                Payment processed at the Pool Hall reception upon arrival
              </p>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-600 space-y-6">
              <div className="w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-white/5 shadow-inner">
                <Circle size={32} className="text-gray-800" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest leading-relaxed">
                Choose an available table<br/>to start your journey
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default HallDetails;
