import { Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import HallManagement from './HallManagement';
import TableManagement from './TableManagement';
import DashboardOverview from './DashboardOverview';
import BookingsPage from './BookingsPage';
import LiveMatchesPage from './LiveMatchesPage';
import TournamentsPage from './TournamentsPage';
import FinancePage from './FinancePage';
import CustomersPage from './CustomersPage';
import AnalyticsPage from './AnalyticsPage';
import SettingsPage from './SettingsPage';
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
  BarChart3
} from 'lucide-react';

const BackofficeApp = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get('hallId');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: `/backoffice/dashboard?hallId=${hallId}` },
    { label: 'Tables', icon: TableIcon, path: `/backoffice/tables?hallId=${hallId}` },
    { label: 'Bookings', icon: Calendar, path: `/backoffice/bookings?hallId=${hallId}` },
    { label: 'Live Matches', icon: Activity, path: `/backoffice/matches?hallId=${hallId}` },
    { label: 'Tournaments', icon: Trophy, path: `/backoffice/tournaments?hallId=${hallId}` },
    { label: 'Finance', icon: DollarSign, path: `/backoffice/finance?hallId=${hallId}` },
    { label: 'Customers', icon: UsersIcon, path: `/backoffice/customers?hallId=${hallId}` },
    { label: 'Analytics', icon: BarChart3, path: `/backoffice/analytics?hallId=${hallId}` },
    { label: 'Settings', icon: Settings, path: `/backoffice/settings?hallId=${hallId}` },
  ];

  return (
    <div className="min-h-screen bg-primary flex text-white font-sans selection:bg-accent selection:text-primary">
      {/* Sidebar */}
      <aside className="w-72 bg-secondary border-r border-gray-800 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/backoffice')}>
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.2)]">
              <div className="w-5 h-5 bg-primary rounded-full shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tighter italic leading-none">ALL 8</h1>
              <p className="text-[10px] text-accent uppercase font-black mt-1 tracking-widest">Partner Pro</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <p className="px-4 text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Management</p>
          {navItems.map((item) => (
            <Link 
              key={item.label}
              to={hallId ? item.path : '/backoffice'} 
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
                window.location.pathname.includes(item.label.toLowerCase().replace(' ', '-')) 
                ? 'bg-accent text-primary shadow-[0_10px_20px_rgba(0,255,136,0.1)]' 
                : 'hover:bg-primary text-gray-400 hover:text-white'
              }`}
            >
              <item.icon size={20} className={window.location.pathname.includes(item.label.toLowerCase().replace(' ', '-')) ? '' : 'group-hover:text-accent'} />
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              <ChevronRight size={14} className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity ${
                window.location.pathname.includes(item.label.toLowerCase().replace(' ', '-')) ? 'hidden' : ''
              }`} />
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800 bg-secondary/50 backdrop-blur-xl">
          <div className="flex items-center gap-3 p-3 bg-primary rounded-2xl border border-gray-800/50 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-success rounded-xl flex items-center justify-center text-primary font-black shadow-lg">
              {user?.name?.[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate">{user?.name}</p>
              <p className="text-[10px] text-accent font-bold truncate uppercase tracking-tighter">Verified Owner</p>
            </div>
            <Link to={`/backoffice/settings?hallId=${hallId}`}>
              <Settings size={16} className="text-gray-600 cursor-pointer hover:text-white transition-colors" />
            </Link>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-danger/10 text-danger font-bold text-sm hover:bg-danger hover:text-white transition-all border border-danger/20"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-auto bg-[radial-gradient(circle_at_top_right,_#1a1a1a,_#121212)]">
        {!hallId && window.location.pathname !== '/backoffice' && (
          <div className="bg-warning/10 border border-warning/20 text-warning p-4 rounded-2xl mb-8 font-bold text-sm flex items-center gap-3">
            <Activity size={18} />
            Please select a pool hall from the dashboard to view detailed management options.
          </div>
        )}
        
        <Routes>
          <Route path="/" element={<HallManagement />} />
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/tables" element={<TableManagement />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/matches" element={<LiveMatchesPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default BackofficeApp;
