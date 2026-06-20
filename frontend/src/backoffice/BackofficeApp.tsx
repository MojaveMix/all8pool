import {
  Routes,
  Route,
  Link,
  useNavigate,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import HallManagement from "./HallManagement";
import TableManagement from "./TableManagement";
import DashboardOverview from "./DashboardOverview";
import BookingsPage from "./BookingsPage";
import LiveMatchesPage from "./LiveMatchesPage";
import TournamentsPage from "./TournamentsPage";
import FinancePage from "./FinancePage";
import CustomersPage from "./CustomersPage";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./SettingsPage";
import SystemAdminPage from "./SystemAdminPage";
import NotFound from "../shared/NotFound";
import LoadingSpinner from "../shared/LoadingSpinner";
import {
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Table as TableIcon,
  Calendar,
  Trophy,
  DollarSign,
  Activity,
  Settings,
  Users as UsersIcon,
  BarChart3,
  Bell,
  Check,
} from "lucide-react";

const BackofficeApp = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get("hallId");
  const { t } = useTranslation();
  
  const [hallsLoading, setHallsLoading] = useState(true);
  const [errorType, setErrorType] = useState<'404' | '403' | null>(null);

  useEffect(() => {
    const verifyHall = async () => {
      if (!user) return;
      if (!hallId) {
        setHallsLoading(false);
        setErrorType(null);
        return;
      }
      try {
        setHallsLoading(true);
        const res = await api.get('/pool-halls/my');
        
        const found = res.data.find((h: any) => h.id === hallId);
        if (!found) {
          try {
            // Check if hall exists globally or is not found/unauthorized
            await api.get(`/pool-halls/${hallId}`);
            setErrorType('403');
          } catch (err: any) {
            setErrorType('404');
          }
        } else {
          setErrorType(null);
        }
      } catch (err) {
        console.error('Failed to verify hall permissions', err);
        setErrorType('404');
      } finally {
        setHallsLoading(false);
      }
    };
    verifyHall();
  }, [user, hallId]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      label: t("backoffice_nav.dashboard"),
      icon: LayoutDashboard,
      path: hallId ? `/backoffice/dashboard?hallId=${hallId}` : "/backoffice",
    },
    {
      label: t("backoffice_nav.tables"),
      icon: TableIcon,
      path: hallId ? `/backoffice/tables?hallId=${hallId}` : "/backoffice",
    },
    {
      label: t("backoffice_nav.bookings"),
      icon: Calendar,
      path: hallId ? `/backoffice/bookings?hallId=${hallId}` : "/backoffice",
    },
    {
      label: t("backoffice_nav.matches"),
      icon: Activity,
      path: hallId ? `/backoffice/matches?hallId=${hallId}` : "/backoffice",
    },
    {
      label: t("backoffice_nav.tournaments"),
      icon: Trophy,
      path: hallId ? `/backoffice/tournaments?hallId=${hallId}` : "/backoffice",
    },
    {
      label: t("backoffice_nav.finance"),
      icon: DollarSign,
      path: hallId ? `/backoffice/finance?hallId=${hallId}` : "/backoffice",
    },
    {
      label: t("backoffice_nav.customers"),
      icon: UsersIcon,
      path: hallId ? `/backoffice/customers?hallId=${hallId}` : "/backoffice",
    },
    {
      label: t("backoffice_nav.analytics"),
      icon: BarChart3,
      path: hallId ? `/backoffice/analytics?hallId=${hallId}` : "/backoffice",
    },
    {
      label: t("backoffice_nav.settings"),
      icon: Settings,
      path: hallId ? `/backoffice/settings?hallId=${hallId}` : "/backoffice",
    },
  ];

  if (user?.role === "admin") {
    navItems.push({
      label: t("backoffice_nav.system_admin"),
      icon: UsersIcon,
      path: "/backoffice/admin",
    });
  }

  const isActive = (path: string) => {
    if (path === "/backoffice" && window.location.pathname === "/backoffice")
      return true;
    const itemPath = path.split("?")[0].replace("/backoffice/", "");
    return window.location.pathname.includes(itemPath) && itemPath !== "";
  };

  if (hallsLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Render Access Denied for unauthorized halls (403)
  if (errorType === '403') {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-center px-4">
        <div className="bg-secondary rounded-[2.5rem] border border-gray-800 p-12 max-w-md w-full space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-danger/10 border border-danger/20 rounded-full flex items-center justify-center text-danger text-2xl mx-auto font-mono">
            ⚠️
          </div>
          <h3 className="text-2xl font-black italic text-white tracking-tight uppercase">ACCESS DENIED</h3>
          <p className="text-gray-400 font-bold text-sm leading-relaxed uppercase tracking-wider">
            You do not have permission to manage this pool hall. Access is restricted to authorized owners only.
          </p>
          <button 
            onClick={() => navigate('/backoffice')}
            className="w-full py-4 bg-accent text-primary rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform"
          >
            Return to Partner Lobby
          </button>
        </div>
      </div>
    );
  }

  // Render Not Found for invalid hallIds (404)
  if (errorType === '404') {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-center px-4">
        <div className="bg-secondary rounded-[2.5rem] border border-gray-800 p-12 max-w-md w-full space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-warning/10 border border-warning/20 rounded-full flex items-center justify-center text-warning text-2xl mx-auto font-mono">
            ❓
          </div>
          <h3 className="text-2xl font-black italic text-accent tracking-tight uppercase">HALL NOT FOUND</h3>
          <p className="text-gray-400 font-bold text-sm leading-relaxed uppercase tracking-wider">
            The requested pool hall does not exist. Please check the URL or selection.
          </p>
          <button 
            onClick={() => navigate('/backoffice')}
            className="w-full py-4 bg-accent text-primary rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-transform"
          >
            Return to Partner Lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary flex text-white font-sans selection:bg-accent selection:text-primary">
      {/* Sidebar */}

      <aside className="w-72 bg-secondary border-r border-gray-800 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/backoffice")}
          >
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-0.5 border border-accent/30 shadow-[0_0_20px_rgba(0,255,136,0.25)] overflow-hidden">
              <img
                src="/img/logo.png"
                alt="All 8 Pool Logo"
                className="w-full h-full object-cover scale-110"
              />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter italic leading-none">
                ALL 8
              </h1>
              <p className="text-[10px] text-accent uppercase font-black mt-1 tracking-widest">
                Partner Pro
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">
            {t("backoffice_nav.management")}
          </p>
          <Link
            to="/backoffice"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
              window.location.pathname === "/backoffice"
                ? "bg-accent text-primary shadow-[0_10px_20px_rgba(0,255,136,0.1)]"
                : "hover:bg-primary text-gray-400 hover:text-white"
            }`}
          >
            <LayoutDashboard
              size={20}
              className={
                window.location.pathname === "/backoffice"
                  ? ""
                  : "group-hover:text-accent"
              }
            />
            <span className="font-bold text-sm tracking-tight">{t("backoffice_nav.halls_list")}</span>
          </Link>

          {navItems.map((item) => {
            const requiresHall = item.path.includes("hallId");
            return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
                isActive(item.path)
                  ? "bg-accent text-primary shadow-[0_10px_20px_rgba(0,255,136,0.1)]"
                  : "hover:bg-primary text-gray-400 hover:text-white"
              } ${!hallId && requiresHall ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
            >
              <item.icon
                size={20}
                className={isActive(item.path) ? "" : "group-hover:text-accent"}
              />
              <span className="font-bold text-sm tracking-tight">
                {item.label}
              </span>
              <ChevronRight
                size={14}
                className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${
                  isActive(item.path) ? "hidden" : ""
                }`}
              />
            </Link>
          )})}
        </nav>

        <div className="p-6 border-t border-gray-800 bg-secondary/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 p-3 bg-primary rounded-2xl border border-gray-800/50 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-success rounded-xl flex items-center justify-center text-primary font-black shadow-lg">
              {user?.name?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate">{user?.name}</p>
              <p className="text-[10px] text-accent font-bold truncate uppercase tracking-tighter">
                {user?.role === "admin" ? t("backoffice_nav.system_admin") : t("backoffice_nav.verified_owner")}
              </p>
            </div>
            <Link
              to={
                hallId ? `/backoffice/settings?hallId=${hallId}` : "/backoffice"
              }
            >
              <Settings
                size={16}
                className={`text-gray-600 cursor-pointer hover:text-white transition-colors ${!hallId ? "opacity-50 pointer-events-none" : ""}`}
              />
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-danger/10 text-danger font-bold text-sm hover:bg-danger hover:text-white transition-all border border-danger/20"
          >
            <LogOut size={18} />
            {t("backoffice_nav.logout")}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-auto bg-[radial-gradient(circle_at_top_right,_#1a1a1a,_#121212)]">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-6 shrink-0">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white uppercase italic font-mono bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">Partner Portal</h2>
            <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Lobby Control & System Operations</p>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <OwnerNotificationBell />
          </div>
        </div>

        {!hallId && window.location.pathname !== "/backoffice" && window.location.pathname !== "/backoffice/admin" && (
          <div className="bg-warning/10 border border-warning/20 text-warning p-4 rounded-2xl mb-8 font-bold text-sm flex items-center gap-3">
            <Activity size={18} />
            {t("backoffice_nav.select_hall")}
          </div>
        )}

        <Routes>
          <Route path="/" element={<HallManagement />} />
          <Route path="/admin" element={user?.role === "admin" ? <SystemAdminPage /> : <Navigate to="/backoffice" />} />
          <Route
            path="/dashboard"
            element={
              hallId ? <DashboardOverview /> : <Navigate to="/backoffice" />
            }
          />
          <Route
            path="/tables"
            element={
              hallId ? <TableManagement /> : <Navigate to="/backoffice" />
            }
          />
          <Route
            path="/bookings"
            element={hallId ? <BookingsPage /> : <Navigate to="/backoffice" />}
          />
          <Route
            path="/matches"
            element={
              hallId ? <LiveMatchesPage /> : <Navigate to="/backoffice" />
            }
          />
          <Route
            path="/tournaments"
            element={
              hallId ? <TournamentsPage /> : <Navigate to="/backoffice" />
            }
          />
          <Route
            path="/finance"
            element={hallId ? <FinancePage /> : <Navigate to="/backoffice" />}
          />
          <Route
            path="/customers"
            element={hallId ? <CustomersPage /> : <Navigate to="/backoffice" />}
          />
          <Route
            path="/analytics"
            element={hallId ? <AnalyticsPage /> : <Navigate to="/backoffice" />}
          />
          <Route
            path="/settings"
            element={hallId ? <SettingsPage /> : <Navigate to="/backoffice" />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const OwnerNotificationBell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [ownerHalls, setOwnerHalls] = useState<any[]>([]);
  const [pendingTournaments, setPendingTournaments] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // For organizing matches
  const [selectedTables, setSelectedTables] = useState<Record<string, string>>({});

  const fetchData = async () => {
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) return;
    try {
      // Get owner's halls (with tables embedded)
      const hallsRes = await api.get('/pool-halls/my');
      setOwnerHalls(hallsRes.data);
      const myHallIds = hallsRes.data.map((h: any) => h.id);

      // Get all challenge matches
      const matchesRes = await api.get('/matches?status=challenge');
      
      // Filter for accepted challenges at the owner's halls that are not organized yet
      const pendingOrganize = matchesRes.data.filter(
        (m: any) => m.challengeStatus === 'accepted' && m.status === 'challenge' && myHallIds.includes(m.poolHallId)
      );
      
      setChallenges(pendingOrganize);

      // Fetch pending tournament player requests
      let allPendingTourneyRequests: any[] = [];
      for (const hallId of myHallIds) {
        try {
          const tourneyRes = await api.get(`/tournaments?poolHallId=${hallId}`);
          tourneyRes.data.forEach((t: any) => {
            const pending = t.players?.filter((p: any) => p.status === 'pending') || [];
            pending.forEach((p: any) => {
              allPendingTourneyRequests.push({
                id: p.id,
                tournamentId: t.id,
                tournamentName: t.name,
                playerName: p.player?.name,
                playerEmail: p.player?.email,
                hallId
              });
            });
          });
        } catch (err) {
          console.error(`Failed to fetch tournaments for hall ${hallId}`, err);
        }
      }
      setPendingTournaments(allPendingTourneyRequests);

      // Pre-select first available table for each challenge
      const initialTables: Record<string, string> = {};
      pendingOrganize.forEach((m: any) => {
        const hall = hallsRes.data.find((h: any) => h.id === m.poolHallId);
        const availTable = hall?.tables?.find((t: any) => t.status === 'available');
        if (availTable) {
          initialTables[m.id] = availTable.id;
        }
      });
      setSelectedTables(prev => ({ ...initialTables, ...prev }));
    } catch (err) {
      console.error('Error fetching owner notifications:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, [user]);

  const handleOrganize = async (matchId: string) => {
    const tableId = selectedTables[matchId];
    if (!tableId) {
      alert('Please assign an available table first.');
      return;
    }
    setLoading(true);
    try {
      await api.patch(`/matches/${matchId}/organize`, { tableId });
      alert('Match successfully organized and confirmed!');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to organize match');
    } finally {
      setLoading(false);
    }
  };

  const notificationCount = challenges.length + pendingTournaments.length;

  if (!user || (user.role !== 'owner' && user.role !== 'admin')) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-accent hover:bg-white/5 rounded-full transition-all duration-300 flex items-center justify-center shrink-0"
      >
        <Bell size={18} />
        {notificationCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-primary text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_#00ff88]">
            {notificationCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-45" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-3 w-[320px] sm:w-[340px] bg-secondary border border-gray-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] z-50 p-5 space-y-4 text-left backdrop-blur-xl"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent font-mono">Gauntlet Coordinator</span>
                  <p className="text-[9px] text-gray-500 font-mono mt-0.5">Alerts & requests</p>
                </div>
                <span className="bg-accent/10 border border-accent/20 text-accent text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                  {notificationCount} Pending
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-3.5 pr-1">
                {challenges.length > 0 &&
                  challenges.map((c) => {
                    const hall = ownerHalls.find(h => h.id === c.poolHallId);
                    const availableTables = hall?.tables?.filter((t: any) => t.status === 'available') || [];
                    
                    return (
                      <div key={c.id} className="bg-primary/50 border border-gray-800 hover:border-accent/20 p-4 rounded-2xl space-y-3 transition-all">
                        <div className="flex items-center justify-between gap-1.5 border-b border-white/5 pb-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-black text-white uppercase text-xs truncate max-w-[85px]">{c.player1?.name}</span>
                            <span className="text-[8px] text-accent font-mono bg-accent/5 border border-accent/15 px-1 rounded">
                              {parseFloat((c.player1?.rating ?? 0).toString()).toFixed(1)}
                            </span>
                          </div>
                          
                          <span className="text-[9px] text-gray-600 font-mono font-black italic">VS</span>
                          
                          <div className="flex items-center gap-1.5 min-w-0 justify-end">
                            <span className="text-[8px] text-accent font-mono bg-accent/5 border border-accent/15 px-1 rounded">
                              {parseFloat((c.player2?.rating ?? 0).toString()).toFixed(1)}
                            </span>
                            <span className="font-black text-white uppercase text-xs truncate max-w-[85px]">{c.player2?.name}</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-[10px] text-gray-400 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="text-accent text-[11px]">📍</span>
                            <span className="truncate text-white font-bold">{c.poolHall?.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-accent text-[11px]">📅</span>
                            <span>{new Date(c.scheduledStartTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} @ {new Date(c.scheduledStartTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-yellow-500 font-black border-t border-white/5 pt-1.5">
                            <span className="text-[11px]">💰</span>
                            <span>{c.stake} Virtual Pts Stake</span>
                          </div>
                        </div>

                        {/* Assign Table Select */}
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono text-gray-500 uppercase tracking-widest font-black block">Assign Battle Table</label>
                          {availableTables.length > 0 ? (
                            <div className="relative">
                              <select
                                value={selectedTables[c.id] || ''}
                                onChange={(e) => setSelectedTables(prev => ({ ...prev, [c.id]: e.target.value }))}
                                className="w-full bg-primary border border-gray-800 focus:border-accent rounded-xl p-2.5 text-[10px] font-mono text-white outline-none appearance-none cursor-pointer"
                              >
                                <option value="">-- SELECT AVAILABLE TABLE --</option>
                                {availableTables.map((t: any) => (
                                  <option key={t.id} value={t.id}>Table #{t.number} — {t.type} (${t.pricePerHour}/hr)</option>
                                ))}
                              </select>
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 text-[8px]">▼</div>
                            </div>
                          ) : (
                            <div className="text-[9px] text-danger font-mono uppercase bg-danger/10 px-2 py-2 rounded-xl border border-danger/15 text-center font-bold">
                              No Available Tables
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleOrganize(c.id)}
                          disabled={loading || !selectedTables[c.id]}
                          className="w-full py-2.5 bg-gradient-to-r from-accent to-emerald-600 text-primary rounded-xl text-[10px] font-mono font-black uppercase tracking-widest hover:from-emerald-400 transition-all shadow-[0_0_15px_rgba(0,255,136,0.1)] hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center justify-center gap-1 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          Authorize Match <Check size={10} />
                        </button>
                      </div>
                    );
                  })}
                {/* Tournament Registration Section */}
                {pendingTournaments.length > 0 && (
                  <div className="border-t border-gray-800 pt-3 mt-3 space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-accent font-mono block">Tournament Requests</span>
                    {pendingTournaments.map((req) => (
                      <div key={req.id} className="bg-primary/50 border border-gray-800 p-3 rounded-2xl space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-black text-white uppercase text-[10px] truncate max-w-[150px]">{req.playerName}</span>
                          <span className="text-[8px] text-accent bg-accent/5 px-1.5 py-0.5 rounded border border-accent/10 font-mono uppercase font-bold">JOIN REQ</span>
                        </div>
                        <p className="text-[9px] text-gray-400 font-mono">wants to join <strong className="text-white italic">{req.tournamentName}</strong></p>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/backoffice/tournaments?hallId=${req.hallId}&tournamentId=${req.tournamentId}`);
                          }}
                          className="w-full py-2 bg-gray-800 text-white rounded-xl text-[9px] font-mono font-black uppercase tracking-widest hover:bg-gray-700 transition-all border border-gray-700"
                        >
                          Manage Tournaments
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {challenges.length === 0 && pendingTournaments.length === 0 && (
                  <div className="text-center py-10 text-gray-600 font-mono text-xs uppercase tracking-wider">
                    No new notifications
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BackofficeApp;
