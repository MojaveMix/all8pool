import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import HallDiscovery from "./HallDiscovery";
import HallDetails from "./HallDetails";
import RankingPage from "./RankingPage";
import ProfilePage from "./ProfilePage";
import RewardsPage from "./RewardsPage";
import PlayerMatchesPage from "./PlayerMatchesPage";
import PlayerTournamentsPage from "./PlayerTournamentsPage";
import { User as UserIcon, LogIn, LogOut, Menu, X, Trophy } from "lucide-react";
import { useState } from "react";

const ClientApp = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 text-white font-sans relative">
      {/* Subtle background pattern - no inline SVG issues */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:40px_40px]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                <div className="w-4 h-4 bg-white rounded-full shadow-inner" />
              </div>
              <h1 className="text-2xl font-black italic tracking-tighter bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:to-white transition-all duration-500">
                ALL 8 POOL
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/">Discover</NavLink>
              <NavLink to="/matches">Matches</NavLink>
              <NavLink to="/tournaments">Tournaments</NavLink>
              <NavLink to="/ranking">Ranking</NavLink>
              <NavLink to="/rewards">Rewards</NavLink>
            </div>

            {/* Desktop User Area */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <UserMenu user={user} logout={logout} navigate={navigate} />
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 text-black font-bold px-6 py-2 rounded-full hover:scale-105 transition-transform shadow-lg shadow-emerald-500/30"
                >
                  <LogIn size={18} /> Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-sm"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/80 backdrop-blur-xl border-t border-white/10 py-4 px-4 flex flex-col gap-3">
            <MobileNavLink to="/" onClick={() => setMobileMenuOpen(false)}>
              Discover
            </MobileNavLink>
            <MobileNavLink
              to="/matches"
              onClick={() => setMobileMenuOpen(false)}
            >
              Matches
            </MobileNavLink>
            <MobileNavLink
              to="/tournaments"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tournaments
            </MobileNavLink>
            <MobileNavLink
              to="/ranking"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ranking
            </MobileNavLink>
            <MobileNavLink
              to="/rewards"
              onClick={() => setMobileMenuOpen(false)}
            >
              Rewards
            </MobileNavLink>
            {user ? (
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <UserIcon size={20} className="text-emerald-400" />
                  <span className="font-semibold">{user.name}</span>
                </div>
                {(user.role === "owner" || user.role === "admin") && (
                  <Link
                    to="/backoffice"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center text-sm font-bold text-emerald-400 border border-emerald-400/30 py-2 rounded-lg mb-2"
                  >
                    Backoffice
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
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-emerald-500 text-black font-bold py-2 rounded-full"
              >
                <LogIn size={18} /> Login
              </Link>
            )}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Routes>
          <Route path="/" element={<HallDiscovery />} />
          <Route path="/hall/:id" element={<HallDetails />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route
            path="/tournaments"
            element={<PlayerTournamentsPage />}
          />
          <Route
            path="/matches"
            element={<PlayerMatchesPage />}
          />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-12 mt-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-emerald-400 transition">
              About
            </a>
            <a href="#" className="hover:text-emerald-400 transition">
              Contact
            </a>
            <a href="#" className="hover:text-emerald-400 transition">
              Terms
            </a>
            <a href="#" className="hover:text-emerald-400 transition">
              Privacy
            </a>
          </div>
          <p className="text-gray-500 text-sm font-medium tracking-widest uppercase">
            © 2026 ALL 8 POOL — THE ULTIMATE CUE SPORTS PLATFORM
          </p>
        </div>
      </footer>
    </div>
  );
};

// Helper components
const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    to={to}
    className="text-sm font-bold uppercase tracking-widest hover:text-emerald-400 transition-colors relative group"
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
    className="block text-center py-2 text-gray-200 hover:text-emerald-400 transition-colors"
  >
    {children}
  </Link>
);

const UserMenu = ({
  user,
  logout,
  navigate,
}: {
  user: any;
  logout: () => void;
  navigate: (path: string) => void;
}) => (
  <div className="flex items-center gap-4">
    {(user.role === "owner" || user.role === "admin") && (
      <Link
        to="/backoffice"
        className="text-xs font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors border border-emerald-400/30 px-3 py-1.5 rounded-lg bg-emerald-400/10 backdrop-blur-sm"
      >
        Backoffice
      </Link>
    )}
    <Link
      to="/profile"
      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 hover:border-emerald-400/50 transition-all"
    >
      <UserIcon size={18} className="text-emerald-400" />
      <span className="text-sm font-bold">{user.name}</span>
    </Link>
    <button
      onClick={() => {
        logout();
        navigate("/login");
      }}
      className="p-2 text-gray-300 hover:text-red-400 transition-colors"
    >
      <LogOut size={20} />
    </button>
  </div>
);

export default ClientApp;
