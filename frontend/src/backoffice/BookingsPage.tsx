import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import {
  Calendar as CalendarIcon,
  X,
  Table as TableIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Search,
  Play,
  Mail,
} from "lucide-react";
import {
  format,
  addDays,
  startOfWeek,
  addWeeks,
  subWeeks,
  isSameDay,
} from "date-fns";

interface Booking {
  id: string;
  player1Name: string;
  player1Email: string | null;
  player2Id: string | null;
  player2Name: string | null;
  player2Email: string | null;
  table: { number: number; id: string };
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalPrice: string;
  user: { id: string, name: string; email: string } | null;
  player2: { id: string, name: string; email: string } | null;
}

const BookingsPage = () => {
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get("hallId");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"list" | "calendar">("list");
  const [bookings, setBookings] = useState<Booking[]>([]);
  // const [loading, setLoading] = useState(true);
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [showPlayerModal, setShowPlayerModal] = useState<{
    bookingId: string;
    playerIndex: 1 | 2;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [guestData, setGuestData] = useState({ name: "", email: "" });
  const [tables, setTables] = useState<any[]>([]);
  const [newBookingData, setNewBookingData] = useState({
    tableId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "12:00",
    duration: 1,
    player1Id: null as string | null,
    player1Name: "",
    player1Email: "",
    player2Id: null as string | null,
    player2Name: "",
    player2Email: "",
  });

  useEffect(() => {
    if (hallId) {
      fetchBookings();
      fetchTables();
    }
  }, [hallId, currentDate]);

  const fetchBookings = async () => {
    try {
      // setLoading(true);
      const res = await api.get(`/bookings/hall?hallId=${hallId}`);
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      // setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await api.get(`/pool-halls/my`);
      const hall = res.data.find((h: any) => h.id === hallId);
      if (hall) setTables(hall.tables || []);
    } catch (err) {
      console.error(err);
    }
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

  const assignPlayer = async (userId: string | null, name: string, email?: string) => {
    if (!showPlayerModal) return;
    try {
      await api.patch(`/bookings/${showPlayerModal.bookingId}/assign-player`, {
        playerIndex: showPlayerModal.playerIndex,
        userId,
        name,
        email
      });
      setShowPlayerModal(null);
      setSearchQuery("");
      setSearchResults([]);
      setGuestData({ name: "", email: "" });
      fetchBookings();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to assign player");
    }
  };

  const startMatch = async (booking: Booking) => {
    try {
      // 1. Create the match
      await api.post("/matches", {
        tableId: booking.table.id,
        poolHallId: hallId,
        player1Id: booking.user?.id || null,
        player1Name: booking.player1Name,
        player1Email: booking.player1Email || booking.user?.email,
        player2Id: booking.player2?.id || booking.player2Id,
        player2Name: booking.player2Name,
        player2Email: booking.player2Email || booking.player2?.email,
        bookingId: booking.id,
      });

      // 2. Update booking status to completed
      await api.patch(`/bookings/${booking.id}/status`, {
        status: "completed",
      });

      fetchBookings();
      alert("Match started successfully! Table is now occupied.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to start match");
    }
  };

  const createBooking = async () => {
    try {
      const startTime = new Date(
        `${newBookingData.date}T${newBookingData.time}`,
      );
      const endTime = new Date(
        startTime.getTime() + newBookingData.duration * 60 * 60 * 1000,
      );

      await api.post("/bookings", {
        tableId: newBookingData.tableId,
        startTime,
        endTime,
        player1Id: newBookingData.player1Id,
        player1Name: newBookingData.player1Name,
        player1Email: newBookingData.player1Email,
        player2Id: newBookingData.player2Id,
        player2Name: newBookingData.player2Name,
        player2Email: newBookingData.player2Email,
      });

      setShowNewBookingModal(false);
      fetchBookings();
      alert("Booking created successfully!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create booking");
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfWeek(currentDate), i),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            <CalendarIcon className="text-accent" size={32} />
            RESERVATION HUB
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">
            Manage player bookings and schedules
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowNewBookingModal(true)}
            className="bg-accent text-primary px-6 py-3 rounded-2xl font-black uppercase tracking-tighter shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Plus size={20} /> New Booking
          </button>
          <div className="flex bg-secondary p-1 rounded-2xl border border-gray-800">
            <button
              onClick={() => setView("list")}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === "list" ? "bg-accent text-primary shadow-lg" : "text-gray-500 hover:text-white"}`}
            >
              List View
            </button>
            <button
              onClick={() => setView("calendar")}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${view === "calendar" ? "bg-accent text-primary shadow-lg" : "text-gray-500 hover:text-white"}`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-secondary rounded-[2.5rem] border border-gray-800 overflow-hidden">
        {/* ... Calendar Header ... */}
        <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-secondary/50">
          <div className="flex items-center gap-6">
            <h3 className="text-xl font-black italic text-white uppercase tracking-tight">
              {format(currentDate, "MMMM yyyy")}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
                className="p-2 hover:bg-primary rounded-xl transition-colors border border-gray-800"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 hover:bg-primary rounded-xl text-[10px] font-black uppercase border border-gray-800"
              >
                Today
              </button>
              <button
                onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
                className="p-2 hover:bg-primary rounded-xl transition-colors border border-gray-800"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-primary border border-gray-800 px-4 py-2 rounded-xl text-xs font-bold hover:text-accent transition-colors">
            <Filter size={16} /> Advanced Filters
          </button>
        </div>

        {view === "calendar" ? (
          <div className="grid grid-cols-7 divide-x divide-gray-800 border-b border-gray-800">
            {weekDays.map((day) => (
              <div
                key={day.toString()}
                className={`p-6 min-h-[400px] ${isSameDay(day, new Date()) ? "bg-accent/5" : ""}`}
              >
                <div className="text-center mb-6">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {format(day, "EEE")}
                  </p>
                  <p
                    className={`text-2xl font-black mt-1 ${isSameDay(day, new Date()) ? "text-accent" : "text-white"}`}
                  >
                    {format(day, "d")}
                  </p>
                </div>
                <div className="space-y-3">
                  {bookings
                    .filter((b) => isSameDay(new Date(b.startTime), day))
                    .map((booking) => (
                      <div
                        key={booking.id}
                        className="p-3 bg-primary rounded-xl border border-gray-800 text-[10px] font-bold group hover:border-accent transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-gray-400">
                            {format(new Date(booking.startTime), "HH:mm")}
                          </span>
                          <div
                            className={`w-2 h-2 rounded-full ${booking.status === "confirmed" ? "bg-success" : "bg-warning animate-pulse"}`}
                          />
                        </div>
                        <p className="text-white truncate">
                          {booking.player1Name}{" "}
                          {booking.player2Name
                            ? `vs ${booking.player2Name}`
                            : ""}
                        </p>
                        <p className="text-accent mt-1 tracking-tighter italic">
                          Table #{booking.table.number}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary/30 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-10 py-5">Players</th>
                  <th className="px-10 py-5">Schedule</th>
                  <th className="px-10 py-5">Table</th>
                  <th className="px-10 py-5">Total Price</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-primary/40 transition-colors group"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                              {booking.player1Name}
                            </span>
                            <button
                              onClick={() =>
                                setShowPlayerModal({
                                  bookingId: booking.id,
                                  playerIndex: 1,
                                })
                              }
                              className="p-1 hover:text-accent text-gray-600 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            {booking.player2Name ? (
                              <span className="text-xs text-gray-400">
                                vs {booking.player2Name}
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-600 italic">
                                No opponent
                              </span>
                            )}
                            <button
                              onClick={() =>
                                setShowPlayerModal({
                                  bookingId: booking.id,
                                  playerIndex: 2,
                                })
                              }
                              className="p-1 hover:text-accent text-gray-600 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">
                          {format(new Date(booking.startTime), "MMM d, yyyy")}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {format(new Date(booking.startTime), "HH:mm")} -{" "}
                          {format(new Date(booking.endTime), "HH:mm")}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6 font-black italic text-accent tracking-tighter text-lg">
                      #{booking.table.number}
                    </td>
                    <td className="px-10 py-6 text-sm text-gray-400 font-bold">
                      ${booking.totalPrice}
                    </td>
                    <td className="px-10 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                          booking.status === "confirmed"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-warning/10 text-warning border-warning/20 animate-pulse"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startMatch(booking)}
                          className="p-3 bg-accent/10 text-accent rounded-xl hover:bg-accent hover:text-primary transition-all"
                          title="Start Match"
                        >
                          <Play size={18} />
                        </button>
                        <button
                          className="p-3 bg-danger/10 text-danger rounded-xl hover:bg-danger hover:text-primary transition-all"
                          title="Cancel"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPlayerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-secondary w-full max-w-md p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black italic text-accent mb-8 tracking-tight uppercase">
              Assign Player {showPlayerModal.playerIndex}
            </h3>

            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                  Search Account
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full bg-primary border border-gray-800 pl-12 pr-4 py-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                    value={searchQuery}
                    onChange={(e) => handleSearchUsers(e.target.value)}
                  />
                </div>
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => assignPlayer(user.id, user.name)}
                      className="w-full flex items-center justify-between p-4 bg-primary rounded-xl border border-gray-800 hover:border-accent transition-colors"
                    >
                      <div className="text-left">
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-[10px] text-gray-500">
                          {user.email}
                        </p>
                      </div>
                      <Plus size={16} className="text-accent" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-800"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                  <span className="bg-secondary px-4 text-gray-500">
                    OR VERIFIED GUEST
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Guest Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                    value={guestData.name}
                    onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Guest Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email for verification"
                    className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                    value={guestData.email}
                    onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowPlayerModal(null)}
                  className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={!guestData.name || !guestData.email}
                  onClick={() => assignPlayer(null, guestData.name, guestData.email)}
                  className="flex-1 bg-accent text-primary font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  SET GUEST
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showNewBookingModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-secondary w-full max-w-lg p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-black italic text-accent mb-8 tracking-tight uppercase">
              New Reservation
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Select Table
                  </label>
                  <select
                    className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                    value={newBookingData.tableId}
                    onChange={(e) =>
                      setNewBookingData({
                        ...newBookingData,
                        tableId: e.target.value,
                      })
                    }
                  >
                    <option value="">Choose Table...</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        Table #{t.number} ({t.type})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Duration
                  </label>
                  <select
                    className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                    value={newBookingData.duration}
                    onChange={(e) =>
                      setNewBookingData({
                        ...newBookingData,
                        duration: Number(e.target.value),
                      })
                    }
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                      <option key={h} value={h}>
                        {h} {h === 1 ? "Hour" : "Hours"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                    value={newBookingData.date}
                    onChange={(e) =>
                      setNewBookingData({
                        ...newBookingData,
                        date: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                    value={newBookingData.time}
                    onChange={(e) =>
                      setNewBookingData({
                        ...newBookingData,
                        time: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="p-6 bg-primary/50 rounded-3xl border border-gray-800 space-y-6">
                {/* Player 1 Search */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Search Player 1
                    </label>
                    <div className="relative">
                      <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search player..."
                        className="w-full bg-primary border border-gray-800 pl-12 pr-4 py-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                        onChange={(e) => handleSearchUsers(e.target.value)}
                      />
                    </div>
                    {searchQuery && searchResults.length > 0 && (
                      <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                        {searchResults.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => {
                              setNewBookingData({
                                ...newBookingData,
                                player1Id: user.id,
                                player1Name: user.name,
                                player1Email: user.email,
                              });
                              setSearchQuery("");
                              setSearchResults([]);
                            }}
                            className="w-full flex items-center justify-between p-3 bg-secondary rounded-xl border border-gray-800 hover:border-accent transition-colors"
                          >
                            <span className="text-sm font-bold">
                              {user.name}
                            </span>
                            <Plus size={14} className="text-accent" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Or enter Guest Name"
                      className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                      value={
                        newBookingData.player1Id
                          ? ""
                          : newBookingData.player1Name
                      }
                      onChange={(e) =>
                        setNewBookingData({
                          ...newBookingData,
                          player1Name: e.target.value,
                          player1Id: null,
                        })
                      }
                    />
                    {!newBookingData.player1Id && (
                       <input
                         type="email"
                         placeholder="Guest Email"
                         className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                         value={newBookingData.player1Email}
                         onChange={(e) => setNewBookingData({ ...newBookingData, player1Email: e.target.value })}
                       />
                    )}
                    {newBookingData.player1Name && (
                      <div className="bg-accent/10 text-accent px-4 py-2 rounded-xl text-[10px] font-black uppercase italic w-fit">
                        {newBookingData.player1Id
                          ? "Selected Account"
                          : "Guest Mode"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-800"></span>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                    <span className="bg-primary/50 px-4 text-gray-500">VS</span>
                  </div>
                </div>

                {/* Player 2 Search */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Search Player 2 (Optional)
                    </label>
                    <div className="relative">
                      <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Search opponent..."
                        className="w-full bg-primary border border-gray-800 pl-12 pr-4 py-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                        onChange={(e) => handleSearchUsers(e.target.value)}
                      />
                    </div>
                    {searchQuery && searchResults.length > 0 && (
                      <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                        {searchResults.map((user) => (
                          <button
                            key={user.id}
                            onClick={() => {
                              setNewBookingData({
                                ...newBookingData,
                                player2Id: user.id,
                                player2Name: user.name,
                                player2Email: user.email,
                              });
                              setSearchQuery("");
                              setSearchResults([]);
                            }}
                            className="w-full flex items-center justify-between p-3 bg-secondary rounded-xl border border-gray-800 hover:border-accent transition-colors"
                          >
                            <span className="text-sm font-bold">
                              {user.name}
                            </span>
                            <Plus size={14} className="text-accent" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Or enter Opponent Name"
                      className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                      value={
                        newBookingData.player2Id
                          ? ""
                          : newBookingData.player2Name
                      }
                      onChange={(e) =>
                        setNewBookingData({
                          ...newBookingData,
                          player2Name: e.target.value,
                          player2Id: null,
                        })
                      }
                    />
                    {!newBookingData.player2Id && (
                       <input
                         type="email"
                         placeholder="Opponent Email"
                         className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent font-bold"
                         value={newBookingData.player2Email}
                         onChange={(e) => setNewBookingData({ ...newBookingData, player2Email: e.target.value })}
                       />
                    )}
                    {newBookingData.player2Name && (
                      <div className="bg-accent/10 text-accent px-4 py-2 rounded-xl text-[10px] font-black uppercase italic w-fit">
                        {newBookingData.player2Id
                          ? "Selected Account"
                          : "Guest Mode"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowNewBookingModal(false)}
                  className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createBooking}
                  disabled={
                    !newBookingData.tableId || !newBookingData.player1Name
                  }
                  className="flex-1 bg-accent text-primary font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                >
                  CONFIRM
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
