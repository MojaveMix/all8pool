import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useTranslation } from "react-i18next";
import LandingPage from "./LandingPage";
import HallDiscovery from "./HallDiscovery";
import HallDetails from "./HallDetails";
import RankingPage from "./RankingPage";
import ProfilePage from "./ProfilePage";
import RewardsPage from "./RewardsPage";
import PlayerMatchesPage from "./PlayerMatchesPage";
import PlayerTournamentsPage from "./PlayerTournamentsPage";
import PlayersPage from "./PlayersPage";
import {
  AboutPage,
  ContactPage,
  TermsPage,
  PrivacyPage,
} from "./info/InfoPages";
import GlobalChallengeWidget from "./GlobalChallengeWidget";
import { LogIn, LogOut, Menu, X, Bell, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";

const ClientApp = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white font-sans relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo - responsive image and text */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 group shrink-0"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-inner" />
              </div>
              <h1 className="text-lg sm:text-2xl font-black italic tracking-tighter bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:to-white transition-all duration-500 hidden xs:block">
                ALL 8 POOL
              </h1>
            </Link>

            {/* Desktop Menu - responsive links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <NavLink to="/arena">{t("nav.discover")}</NavLink>
              <NavLink to="/matches">{t("nav.matches")}</NavLink>
              <NavLink to="/players">Players</NavLink>
              <NavLink to="/tournaments">{t("nav.tournaments")}</NavLink>
              <NavLink to="/ranking">{t("nav.ranking")}</NavLink>
              <NavLink to="/rewards">{t("nav.rewards")}</NavLink>
            </div>

            {/* Desktop User Area */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {user ? (
                <UserMenu
                  user={user}
                  logout={logout}
                  navigate={navigate}
                  t={t}
                />
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-bold px-4 py-1.5 sm:px-6 sm:py-2 rounded-full hover:scale-105 transition-transform shadow-lg shadow-emerald-500/30 text-sm sm:text-base"
                >
                  <LogIn size={18} /> {t("nav.login")}
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-3">
              <NotificationBell />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10 py-4 px-4 flex flex-col gap-3">
            <MobileNavLink to="/arena" onClick={() => setMobileMenuOpen(false)}>
              {t("nav.discover")}
            </MobileNavLink>
            <MobileNavLink
              to="/matches"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.matches")}
            </MobileNavLink>
            <MobileNavLink
              to="/players"
              onClick={() => setMobileMenuOpen(false)}
            >
              Players
            </MobileNavLink>
            <MobileNavLink
              to="/tournaments"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.tournaments")}
            </MobileNavLink>
            <MobileNavLink
              to="/ranking"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.ranking")}
            </MobileNavLink>
            <MobileNavLink
              to="/rewards"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.rewards")}
            </MobileNavLink>
            {user ? (
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-emerald-400/30"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center font-black italic text-xs text-primary uppercase select-none">
                      {user.name ? user.name[0] : 'P'}
                    </div>
                  )}
                  <span className="font-semibold">{user.name}</span>
                </div>
                {(user.role === "owner" || user.role === "admin") && (
                  <Link
                    to="/backoffice"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center text-sm font-bold text-emerald-400 border border-emerald-400/30 py-2 rounded-lg mb-2"
                  >
                    {t("nav.backoffice")}
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/20 text-red-300 py-2 rounded-lg"
                >
                  <LogOut size={18} /> {t("nav.logout")}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-emerald-500 text-black font-bold py-2 rounded-full"
              >
                <LogIn size={18} /> {t("nav.login")}
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/arena" element={<HallDiscovery />} />
          <Route path="/hall/:id" element={<HallDetails />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/players" element={<PlayersPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/tournaments" element={<PlayerTournamentsPage />} />
          <Route path="/matches" element={<PlayerMatchesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
      </main>

      {/* Global Widget for Players */}
      {user?.role === 'player' && <GlobalChallengeWidget />}

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 mt-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-gray-400 text-xs sm:text-sm">
            <Link to="/about" className="hover:text-emerald-400 transition">
              About
            </Link>
            <Link to="/contact" className="hover:text-emerald-400 transition">
              Contact
            </Link>
            <Link to="/terms" className="hover:text-emerald-400 transition">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-emerald-400 transition">
              Privacy
            </Link>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm font-medium tracking-widest uppercase">
            © 2026 ALL 8 POOL — THE ULTIMATE CUE SPORTS PLATFORM
          </p>
        </div>
      </footer>
    </div>
  );
};

// Helper components (updated with responsive classes)
const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="text-xs sm:text-sm font-bold uppercase tracking-widest hover:text-emerald-400 transition-colors relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 group-hover:w-full transition-all duration-300" />
  </Link>
);

const MobileNavLink = ({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-center py-2 text-sm text-gray-200 hover:text-emerald-400 transition-colors"
  >
    {children}
  </Link>
);

const NotificationBell = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchChallenges = async () => {
    if (!user || user.role !== 'player') return;
    try {
      const res = await api.get('/matches?status=challenge');
      const incoming = res.data.filter(
        (m: any) => m.player2Id === user.id && m.challengeStatus === 'pending'
      );
      setChallenges(incoming);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchChallenges();
    const interval = setInterval(fetchChallenges, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleRespond = async (matchId: string, action: 'accept' | 'reject') => {
    setLoading(true);
    try {
      await api.patch(`/matches/${matchId}/respond`, { action });
      alert(`Challenge ${action === 'accept' ? 'accepted!' : 'declined!'}`);
      fetchChallenges();
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to respond`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'player') return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-accent hover:bg-white/5 rounded-full transition-all duration-300 flex items-center justify-center shrink-0"
      >
        <Bell size={20} />
        {challenges.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-accent text-primary text-[9px] font-black rounded-full flex items-center justify-center shadow-[0_0_8px_#00ff88]">
            {challenges.length}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close click */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-80 bg-secondary/95 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl z-50 p-4 space-y-3 overflow-hidden text-left"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-accent font-mono">Incoming Duels</span>
                <span className="text-[10px] text-gray-500 font-mono font-bold">{challenges.length} Pending</span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {challenges.length > 0 ? (
                  challenges.map((c) => (
                    <div key={c.id} className="bg-primary/40 border border-white/5 p-3 rounded-xl space-y-2 text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded border border-white/10 flex items-center justify-center text-[10px] uppercase font-mono text-accent shrink-0 overflow-hidden">
                          {c.player1.avatar ? (
                            <img src={c.player1.avatar} className="w-full h-full object-cover" />
                          ) : (
                            c.player1.name[0]
                          )}
                        </div>
                        <span className="font-black text-white uppercase tracking-wide truncate">{c.player1.name}</span>
                      </div>

                      <div className="text-[10px] text-gray-500 font-mono space-y-1">
                        <div>📍 {c.poolHall?.name}</div>
                        <div>📅 {new Date(c.scheduledStartTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} @ {new Date(c.scheduledStartTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="text-yellow-500 font-black">💰 {c.stake} Pts Wagered</div>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleRespond(c.id, 'reject')}
                          disabled={loading}
                          className="flex-1 py-1.5 border border-danger/30 text-danger rounded-lg text-[9px] font-mono font-black uppercase tracking-wider hover:bg-danger hover:text-white transition-all duration-200 disabled:opacity-50"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleRespond(c.id, 'accept')}
                          disabled={loading}
                          className="flex-1 py-1.5 bg-accent text-primary rounded-lg text-[9px] font-mono font-black uppercase tracking-wider hover:bg-emerald-400 shadow-[0_0_10px_rgba(0,255,136,0.15)] transition-all duration-200 flex items-center justify-center gap-0.5 disabled:opacity-50"
                        >
                          Accept <Check size={10} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-gray-500 font-mono text-xs uppercase">
                    No duels requested
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

const UserMenu = ({
  user,
  logout,
  navigate,
  t,
}: {
  user: any;
  logout: () => void;
  navigate: (path: string) => void;
  t: any;
}) => (
  <div className="flex items-center gap-3 lg:gap-4">
    {(user.role === "owner" || user.role === "admin") && (
      <Link
        to="/backoffice"
        className="text-xs lg:text-sm font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors border border-emerald-400/30 px-2 py-1 lg:px-3 lg:py-1.5 rounded-lg bg-emerald-400/10 backdrop-blur-sm"
      >
        {t("nav.backoffice")}
      </Link>
    )}
    <NotificationBell />
    <Link
      to="/profile"
      className="flex items-center gap-1.5 lg:gap-2 bg-white/10 backdrop-blur-sm pl-1.5 pr-3 py-1.5 lg:pl-2 lg:pr-4 lg:py-2 rounded-full border border-white/20 hover:border-emerald-400/50 transition-all shrink-0"
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt=""
          className="w-6 h-6 rounded-full object-cover border border-emerald-400/30"
        />
      ) : (
        <div className="w-6 h-6 bg-gradient-to-br from-accent to-emerald-600 rounded-full flex items-center justify-center font-black italic text-[10px] text-primary uppercase select-none shrink-0">
          {user.name ? user.name[0] : 'P'}
        </div>
      )}
      <span className="text-xs lg:text-sm font-bold truncate max-w-[100px]">{user.name}</span>
    </Link>
    <button
      onClick={() => {
        logout();
        navigate("/login");
      }}
      className="p-1.5 lg:p-2 text-gray-300 hover:text-red-400 transition-colors"
    >
      <LogOut size={20} />
    </button>
  </div>
);

export default ClientApp;
