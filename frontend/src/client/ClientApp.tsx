import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import HallDiscovery from './HallDiscovery';
import HallDetails from './HallDetails';
import { Home, User as UserIcon, Trophy, LogIn, LogOut, Menu } from 'lucide-react';

const ClientApp = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary text-white font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-primary/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_#00ff88]" />
              </div>
              <h1 className="text-2xl font-black italic tracking-tighter group-hover:text-accent transition-colors">ALL 8 POOL</h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">Discover</Link>
              <Link to="/matches" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors text-gray-500">Matches</Link>
              <Link to="/tournaments" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors text-gray-500">Tournaments</Link>
              <Link to="/ranking" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors text-gray-500">Ranking</Link>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full border border-gray-800 hover:border-accent transition-all">
                    <UserIcon size={18} className="text-accent" />
                    <span className="text-sm font-bold">{user.name}</span>
                  </Link>
                  <button onClick={() => { logout(); navigate('/login'); }} className="p-2 text-gray-500 hover:text-danger transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 bg-accent text-primary px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">
                  <LogIn size={18} /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Routes>
          <Route path="/" element={<HallDiscovery />} />
          <Route path="/hall/:id" element={<HallDetails />} />
          <Route path="/profile" element={<div>Player Profile Coming Soon</div>} />
          <Route path="/tournaments" element={<div>Tournaments Coming Soon</div>} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-4">
          <p className="text-gray-600 text-sm font-medium tracking-widest uppercase">© 2026 ALL 8 POOL — THE ULTIMATE CUE SPORTS PLATFORM</p>
        </div>
      </footer>
    </div>
  );
};

export default ClientApp;
