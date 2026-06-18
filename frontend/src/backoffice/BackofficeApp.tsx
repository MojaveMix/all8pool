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
} from "lucide-react";

const BackofficeApp = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get("hallId");
  const { t } = useTranslation();

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

  return (
    <div className="min-h-screen bg-primary flex text-white font-sans selection:bg-accent selection:text-primary">
      {/* Sidebar */}

      <aside className="w-72 bg-secondary border-r border-gray-800 flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/backoffice")}
          >
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,255,136,0.2)]">
              <div className="w-5 h-5 bg-primary rounded-full shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]" />
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
        </Routes>
      </main>
    </div>
  );
};

export default BackofficeApp;
