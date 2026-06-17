import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../store/AuthContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Circle,
  ArrowLeft,
  CheckCircle,
  Users,
  User,
  Search,
  Mail,
  X as XIcon,
  Maximize2,
  Gamepad2,
} from "lucide-react";

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
  promotionType: "none" | "percentage" | "free";
  promotionValue: number;
}

const HallDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [hall, setHall] = useState<Hall | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [bookingStatus, setBookingStatus] = useState<
    "idle" | "loading" | "success"
  >("idle");
  const [matches, setMatches] = useState<any[]>([]);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const { user } = useAuth();

  // Opponent Selection State
  const [opponentType, setOpponentType] = useState<
    "open" | "account" | "guest"
  >("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedOpponent, setSelectedOpponent] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [guestData, setGuestData] = useState({ name: "", email: "" });

  useEffect(() => {
    fetchHall();
    fetchMatches();
    if (user) {
      fetchMyBookings();
    }
  }, [id, user]);

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

  const fetchMyBookings = async () => {
    try {
      const res = await api.get('/bookings/my');
      const filtered = res.data.filter((b: any) => b.table?.poolHallId === id || b.table?.PoolHallId === id || b.table?.poolHall?.id === id);
      setMyBookings(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const [bookingDate, setBookingDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [bookingTime, setBookingTime] = useState("12:00");
  const [duration, setDuration] = useState(1); // Hours

  const calculateTotalPrice = () => {
    if (!selectedTable || !hall) return 0;
    const basePrice = selectedTable.pricePerHour * duration;
    if (hall.promotionType === "free") return 0;
    if (hall.promotionType === "percentage") {
      return basePrice * (1 - hall.promotionValue / 100);
    }
    return basePrice;
  };

  const handleSearchUsers = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/users?search=${encodeURIComponent(query)}`);
      const filtered = res.data.filter((u: any) => u.id !== user?.id);
      setSearchResults(filtered);
    } catch (err) {
      console.error("Search failed:", err);
      setSearchResults([]);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedTable) return;

    const start = new Date(`${bookingDate}T${bookingTime}`);
    if (isNaN(start.getTime())) {
      alert(t("common.error"));
      return;
    }
    if (start < new Date()) {
      alert(t("hall.past_date_error") || "Cannot book in the past");
      return;
    }

    if (opponentType === "guest" && (!guestData.name || !guestData.email)) {
      alert(t("hall.guest_info_error") || "Please provide guest details");
      return;
    }
    if (opponentType === "account" && !selectedOpponent) {
      alert(t("hall.select_opponent_error") || "Please select an opponent");
      return;
    }

    setBookingStatus("loading");
    try {
      const endTime = new Date(start.getTime() + duration * 60 * 60 * 1000);

      await api.post("/bookings", {
        tableId: selectedTable.id,
        startTime: start,
        endTime: endTime,
        player2Id: opponentType === "account" ? selectedOpponent?.id : null,
        player2Name:
          opponentType === "account"
            ? selectedOpponent?.name
            : opponentType === "guest"
              ? guestData.name
              : null,
        player2Email: opponentType === "guest" ? guestData.email : null,
      });

      setBookingStatus("success");
      setTimeout(() => {
        setBookingStatus("idle");
        setSelectedTable(null);
        fetchHall();
        setOpponentType("open");
        setSelectedOpponent(null);
        setGuestData({ name: "", email: "" });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 3000);
    } catch (err: any) {
      alert(err.response?.data?.message || t("common.error"));
      setBookingStatus("idle");
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
    return (
      <div className="text-center py-20 font-black italic animate-pulse text-accent uppercase tracking-widest">
        {t("common.loading")}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-12 animate-in fade-in duration-700 pb-20">
      <button
        onClick={() => navigate("/arena")}
        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase font-black text-[10px] tracking-widest"
      >
        <ArrowLeft size={16} /> {t("hall.back_discovery")}
      </button>

      {/* Hall Hero Header */}
      <div className="bg-secondary/50 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-white/10 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <MapPin size={240} />
        </div>
        <div className="relative z-10 w-full md:w-auto">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white uppercase leading-tight md:leading-none">
            {hall.name}
          </h2>
          <div className="flex flex-wrap gap-3 md:gap-4 mt-6">
            <span className="flex items-center gap-2 bg-primary px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold border border-white/5">
              <MapPin size={14} className="text-accent" /> {hall.address},{" "}
              {hall.city}
            </span>
            <span className="flex items-center gap-2 bg-primary px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold border border-white/5">
              <Clock size={14} className="text-accent" /> {hall.openingTime} -{" "}
              {hall.closingTime}
            </span>
          </div>
        </div>
        <div className="text-left md:text-right relative z-10 w-full md:w-auto flex md:flex-col justify-between items-end md:justify-start">
          <div className="md:mb-2">
            <p className="text-gray-500 uppercase font-black text-[8px] md:text-[10px] tracking-[0.3em] mb-1">
              {t("hall.arena_status")}
            </p>
            <div className="text-3xl md:text-5xl font-black text-white italic leading-none">
              {hall.tables?.filter((t) => t.status === "available").length} /{" "}
              {hall.tables?.length}
            </div>
          </div>
          <p className="text-accent text-[10px] md:text-xs font-black uppercase tracking-widest">
            {t("arena.tables_ready")}
          </p>
        </div>
      </div>

      {/* My Reservations Section */}
      {user && myBookings.length > 0 && (
        <div className="bg-primary/50 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-accent/20">
          <h3 className="text-xl md:text-2xl font-black italic mb-6 md:mb-8 text-white uppercase tracking-tighter flex items-center gap-4">
            <CheckCircle
              size={20}
              className="text-accent"
            />{" "}
            {t("hall.my_reservations")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {myBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-secondary rounded-[2rem] p-6 md:p-8 border border-white/5 flex flex-col justify-between group transition-all shadow-xl"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {t("hall.table_unit")} #{booking.table?.number}
                    </span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase italic ${booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/10 text-white'}`}>
                      {booking.status}
                    </div>
                  </div>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-gray-500" />
                      <p className="text-sm md:text-base font-bold text-white">
                        {new Date(booking.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Circle size={16} className="text-gray-500" />
                      <p className="text-xs md:text-sm font-bold text-gray-400">
                        {booking.duration || Math.round((new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / 3600000)} Hour(s)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Matches Section */}
      {matches.length > 0 && (
        <div className="bg-accent/5 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-accent/20">
          <h3 className="text-xl md:text-2xl font-black italic mb-6 md:mb-8 text-accent uppercase tracking-tighter flex items-center gap-4">
            <Circle
              size={12}
              className="fill-accent text-accent animate-pulse"
            />{" "}
            {t("hall.open_challenges")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {matches
              .filter((m) => !m.player2Id)
              .map((match) => (
                <div
                  key={match.id}
                  className="bg-secondary rounded-[2rem] p-6 md:p-8 border border-white/5 flex flex-col justify-between group hover:border-accent/40 transition-all shadow-xl"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {t("hall.table_unit")} #{match.table?.number}
                      </span>
                      <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1 rounded-lg text-[10px] font-black uppercase italic">
                        <Users size={12} /> {t("hall.live_call")}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                      <div className="w-12 h-12 md:w-14 md:h-14 bg-primary rounded-2xl border border-white/10 flex items-center justify-center font-black text-white text-xl md:text-2xl italic group-hover:scale-110 transition-transform">
                        {match.player1?.name?.[0].toUpperCase() || "P"}
                      </div>
                      <div>
                        <p className="text-base md:text-lg font-black italic uppercase text-white truncate max-w-[150px]">
                          {match.player1?.name || match.player1Name}
                        </p>
                        <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          {t("hall.awaiting_challenger")}
                        </p>
                      </div>
                    </div>
                  </div>
                  {user?.role === "player" && (
                    <button
                      onClick={() => handleJoinMatch(match.id)}
                      className="w-full bg-accent text-primary py-3 md:py-4 rounded-2xl text-xs md:text-sm font-black uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent/20"
                    >
                      {t("arena.accept_challenge")}
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 md:gap-12">
        {/* Tactical Arena Selection */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
             <h3 className="text-2xl font-black italic text-white uppercase tracking-tight flex items-center gap-3">
               <Gamepad2 className="text-accent" /> {t("hall.tactical_view") || "Tactical Arena View"}
             </h3>
             <div className="flex gap-4">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-accent rounded-full" />
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Available</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-red-500 rounded-full" />
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Occupied</span>
                </div>
             </div>
          </div>
          
          <div className="bg-primary/50 rounded-[3rem] border border-white/5 p-8 md:p-12 relative overflow-hidden min-h-[600px] flex items-center justify-center">
            {/* Perspective Grid Background */}
            <div className="absolute inset-0 opacity-[0.03]" 
                 style={{ backgroundImage: 'radial-gradient(#00ff88 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12 md:gap-16 relative z-10 w-full perspective-[1000px]">
              {hall.tables?.map((table, index) => (
                <TacticalTable
                  key={table.id}
                  table={table}
                  index={index}
                  isSelected={selectedTable?.id === table.id}
                  onClick={() => table.status === 'available' && setSelectedTable(table)}
                  t={t}
                  hall={hall}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className={`
          bg-secondary/90 backdrop-blur-md md:bg-secondary/40 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 border border-white/10 h-fit sticky top-24 shadow-2xl transition-all duration-500
          ${selectedTable ? 'opacity-100 translate-y-0 border-accent/20 ring-1 ring-accent/10' : 'opacity-80 lg:opacity-100'}
        `}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl md:text-2xl font-black italic text-white uppercase tracking-tight">
              {t("hall.reservation_info")}
            </h3>
            {selectedTable && (
              <button 
                onClick={() => setSelectedTable(null)}
                className="lg:hidden text-gray-500 hover:text-white transition-colors"
              >
                <XIcon size={20} />
              </button>
            )}
          </div>

          {selectedTable ? (
            <div className="space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center bg-primary p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <p className="text-[8px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">
                    {t("hall.table_unit")}
                  </p>
                  <p className="text-2xl md:text-3xl font-black italic text-white">
                    #{selectedTable.number}
                  </p>
                </div>
                <div className="text-right relative">
                  <p className="text-[8px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">
                    {t("hall.match_rate")}
                  </p>
                  <p className="text-accent font-black text-lg md:text-xl italic">
                    ${selectedTable.pricePerHour}/hr
                  </p>
                </div>
              </div>

              <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div>
                    <label className="text-[8px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block ml-1">
                      {t("hall.event_date")}
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-primary border border-white/10 rounded-xl md:rounded-2xl px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-white font-bold focus:border-accent outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block ml-1">
                      {t("hall.break_time")}
                    </label>
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full bg-primary border border-white/10 rounded-xl md:rounded-2xl px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-white font-bold focus:border-accent outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[8px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2 block ml-1">
                    {t("hall.session_duration")}
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-primary border border-white/10 rounded-xl md:rounded-2xl px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-white font-bold focus:border-accent outline-none transition-colors appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                      <option key={h} value={h}>
                        {h} {h === 1 ? "Hour" : "Hours"} Session
                      </option>
                    ))}
                  </select>
                </div>

                {/* Opponent Selection UI */}
                <div className="pt-4 md:pt-6 border-t border-white/5 space-y-4 md:space-y-6 text-left">
                  <div>
                    <label className="text-[8px] md:text-[10px] text-gray-500 uppercase font-black tracking-widest mb-3 md:mb-4 block ml-1">
                      {t("hall.opponent_pref")}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          id: "open",
                          label: t("hall.opponent_types.open"),
                          icon: <Users size={14} />,
                        },
                        {
                          id: "account",
                          label: t("hall.opponent_types.platform"),
                          icon: <User size={14} />,
                        },
                        {
                          id: "guest",
                          label: t("hall.opponent_types.guest"),
                          icon: <Mail size={14} />,
                        },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setOpponentType(opt.id as any)}
                          className={`flex flex-col items-center gap-2 p-2 md:p-3 rounded-xl md:rounded-2xl border transition-all ${opponentType === opt.id ? "bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(0,255,136,0.1)]" : "bg-primary border-white/5 text-gray-500 hover:text-white hover:border-white/10"}`}
                        >
                          {opt.icon}
                          <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tighter text-center">
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {opponentType === "account" && (
                    <div className="space-y-3 md:space-y-4 animate-in slide-in-from-top-2">
                      <div className="relative">
                        <Search
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder={t("hall.search_player")}
                          value={searchQuery}
                          onChange={(e) => handleSearchUsers(e.target.value)}
                          className="w-full bg-primary border border-white/10 pl-12 pr-4 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs text-white font-bold outline-none focus:border-accent"
                        />
                      </div>
                      
                      {searchQuery.trim().length >= 2 && searchResults.length > 0 && !selectedOpponent && (
                        <div className="bg-primary rounded-xl border border-white/10 max-h-40 overflow-y-auto divide-y divide-white/5 shadow-2xl relative z-20">
                          {searchResults.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setSelectedOpponent({
                                  id: p.id,
                                  name: p.name,
                                });
                                setSearchQuery("");
                              }}
                              className="w-full text-left p-3 hover:bg-accent/10 transition-colors text-[10px] md:text-xs font-bold text-white flex justify-between items-center"
                            >
                              <span>{p.name}</span>
                              <span className="text-[8px] text-gray-500 uppercase">{p.email?.split('@')[0]}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {searchQuery.trim().length >= 2 && searchResults.length === 0 && !selectedOpponent && (
                        <div className="p-3 text-center bg-primary rounded-xl border border-white/5">
                           <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">No players found</p>
                        </div>
                      )}

                      {selectedOpponent && (
                        <div className="bg-accent/10 p-3 rounded-xl border border-accent/20 flex justify-between items-center animate-in zoom-in-95">
                          <span className="text-[10px] md:text-xs font-black text-accent uppercase">
                            {selectedOpponent.name}
                          </span>
                          <button
                            onClick={() => setSelectedOpponent(null)}
                            className="text-accent hover:text-white p-1"
                          >
                            <XIcon size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {opponentType === "guest" && (
                    <div className="space-y-3 animate-in slide-in-from-top-2">
                      <input
                        type="text"
                        placeholder={t("hall.guest_name")}
                        value={guestData.name}
                        onChange={(e) =>
                          setGuestData({ ...guestData, name: e.target.value })
                        }
                        className="w-full bg-primary border border-white/10 px-4 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs text-white font-bold outline-none focus:border-accent"
                      />
                      <input
                        type="email"
                        placeholder={t("hall.guest_email")}
                        value={guestData.email}
                        onChange={(e) =>
                          setGuestData({ ...guestData, email: e.target.value })
                        }
                        className="w-full bg-primary border border-white/10 px-4 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs text-white font-bold outline-none focus:border-accent"
                      />
                      <p className="text-[8px] md:text-[9px] text-gray-600 font-bold uppercase text-center">
                        {t("hall.guest_note")}
                      </p>
                    </div>
                  )}

                  {opponentType === "open" && (
                    <div className="bg-accent/5 p-4 rounded-xl md:rounded-2xl border border-accent/10 text-center animate-in fade-in">
                      <p className="text-[9px] md:text-[10px] text-accent font-black uppercase tracking-widest">
                        {t("hall.broadcast_note")}
                      </p>
                      <p className="text-[8px] md:text-[9px] text-gray-500 mt-1">
                        {t("hall.broadcast_desc")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 md:pt-6 border-t border-white/10 space-y-3 text-left">
                  <div className="flex justify-between items-center">
                    <p className="text-[8px] md:text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                      {t("hall.subtotal")}
                    </p>
                    <p className="text-white font-black text-xl md:text-2xl italic tabular-nums leading-none">
                      {selectedTable.pricePerHour * duration} <span className="text-xs uppercase">{hall.currency || 'USD'}</span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-3 md:pt-4 border-t border-white/5">
                    <p className="text-[10px] md:text-xs text-white font-black uppercase tracking-[0.3em]">
                      {t("hall.final_price")}
                    </p>
                    <p className="text-accent font-black text-3xl md:text-4xl italic tabular-nums leading-none">
                      {calculateTotalPrice()} <span className="text-xl uppercase">{hall.currency || 'USD'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {bookingStatus === "success" ? (
                <div className="bg-emerald-500/10 text-emerald-500 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center gap-3 md:gap-4 font-black uppercase tracking-widest text-[10px] md:text-xs border border-emerald-500/20 shadow-lg shadow-emerald-500/10 animate-in zoom-in-95">
                  <CheckCircle size={20} className="md:size-6" /> {t("hall.secured")}
                </div>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={bookingStatus === "loading"}
                  className="w-full bg-accent text-primary py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase tracking-widest text-xs md:text-sm italic hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20 disabled:opacity-50"
                >
                  {bookingStatus === "loading"
                    ? t("hall.securing")
                    : t("hall.confirm_btn")}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20 text-gray-600 space-y-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto border-2 border-white/5 shadow-inner">
                <Circle size={28} className="text-gray-800 md:size-32" />
              </div>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-relaxed">
                Choose an available table
                <br />
                to start your journey
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Tactical UI Components ---

const TacticalTable = ({ table, index, isSelected, onClick, t, hall }: any) => {
  const isAvailable = table.status === 'available';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`relative group cursor-pointer ${!isAvailable ? 'cursor-not-allowed' : ''}`}
    >
      <div className="flex flex-col items-center">
        {/* The "Table" Body */}
        <div className={`
          w-full aspect-[16/9] rounded-xl border-4 transition-all duration-500 relative
          ${!isAvailable ? 'bg-gray-900 border-gray-800' : 
            isSelected ? 'bg-accent/10 border-accent shadow-[0_0_40px_rgba(0,255,136,0.3)] -translate-y-2' : 
            'bg-secondary/40 border-white/10 hover:border-accent/40 hover:bg-accent/5 hover:-translate-y-1'
          }
        `}>
          {/* Inner "Cloth" Area */}
          <div className={`absolute inset-2 rounded-lg border border-white/5 flex items-center justify-center overflow-hidden`}>
             <div className="absolute inset-0 bg-grid-white/[0.02]" />
             
             {/* Dynamic Status Elements */}
             <AnimatePresence>
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    exit={{ scale: 0 }}
                    className="absolute inset-0 bg-accent/10 flex items-center justify-center"
                  >
                    <Maximize2 size={24} className="text-accent animate-pulse" />
                  </motion.div>
                )}
                
                {!isAvailable && (
                   <div className="absolute inset-0 bg-red-500/5 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                   </div>
                )}
             </AnimatePresence>

             <span className={`text-3xl font-black italic tracking-tighter transition-colors ${isSelected ? 'text-accent' : 'text-gray-700 group-hover:text-gray-400'}`}>
               #{table.number}
             </span>
          </div>

          {/* Table "Pockets" decorative */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full border border-white/10" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-white/10" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary rounded-full border border-white/10" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border border-white/10" />
        </div>

        {/* Info Label Below */}
        <div className="mt-4 text-center">
           <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isSelected ? 'text-accent' : 'text-gray-500'}`}>
              {table.type}
           </p>
           <p className={`text-xs font-bold mt-0.5 ${isAvailable ? 'text-white' : 'text-red-500/50'}`}>
              {isAvailable ? `${table.pricePerHour} ${hall.currency || 'USD'}/hr` : 'IN PLAY'}
           </p>
        </div>
      </div>

      {/* Hover Selection Ring */}
      {isAvailable && (
        <div className={`
          absolute -inset-4 rounded-[2rem] border-2 border-accent/0 group-hover:border-accent/10 transition-all duration-700
          ${isSelected ? 'border-accent/20 scale-110' : 'scale-100'}
        `} />
      )}
    </motion.div>
  );
};

export default HallDetails;
