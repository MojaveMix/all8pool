import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { 
  Circle, 
  Users, 
  Calendar, 
  DollarSign, 
  Trophy, 
  Clock, 
  TrendingUp,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import LoadingSpinner from '../shared/LoadingSpinner';

const DashboardOverview = () => {
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get('hallId');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hallId) fetchDashboardData();
  }, [hallId]);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get(`/dashboard/stats?hallId=${hallId}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) return <LoadingSpinner message="Loading Dashboard..." />;

  const { summary, liveTables, peakHours } = data;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <SummaryCard 
          icon={<Circle className="text-success" size={20} />} 
          title="Active Tables Now" 
          value={summary.activeTables} 
          trend="+2 since last hour"
        />
        <SummaryCard 
          icon={<Calendar className="text-accent" size={20} />} 
          title="Today's Bookings" 
          value={summary.todayBookings} 
          trend="85% capacity"
        />
        <SummaryCard 
          icon={<DollarSign className="text-warning" size={20} />} 
          title="Today's Revenue" 
          value={`$${summary.todayRevenue}`} 
          trend="+12% vs yesterday"
        />
        <SummaryCard 
          icon={<Trophy className="text-danger" size={20} />} 
          title="Active Matches" 
          value={summary.activeMatches} 
          trend="3 Ranked matches"
        />
        <SummaryCard 
          icon={<Clock className="text-gray-400" size={20} />} 
          title="Next Booking Countdown" 
          value={summary.nextBooking ? "24m 12s" : "No bookings"} 
          trend="Table #4"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Tables Panel */}
        <div className="lg:col-span-2 bg-secondary rounded-3xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full animate-ping" />
              Live Tables Status
            </h3>
            <button className="text-sm text-gray-500 hover:text-white transition-colors">View All</button>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {liveTables.map((table: any) => (
              <TableStatusCard key={table.id} table={table} />
            ))}
          </div>
        </div>

        {/* Analytics Preview */}
        <div className="bg-secondary rounded-3xl border border-gray-800 p-6 space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="text-accent" size={20} />
              Peak Hours
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={peakHours}>
                  <defs>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="hour" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151', borderRadius: '12px' }}
                    itemStyle={{ color: '#00ff88' }}
                  />
                  <Area type="monotone" dataKey="bookings" stroke="#00ff88" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Most Used Tables</h4>
            <div className="space-y-3">
              {[1, 4, 2].map(num => (
                <div key={num} className="flex items-center justify-between p-3 bg-primary rounded-xl border border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center font-bold">#{num}</div>
                    <span className="text-sm font-medium">Table {num}</span>
                  </div>
                  <span className="text-accent font-bold">84%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Bookings Section */}
      <div className="bg-secondary rounded-3xl border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold">Upcoming Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-gray-800">
                <th className="px-6 py-4 font-bold">Player</th>
                <th className="px-6 py-4 font-bold">Time Slot</th>
                <th className="px-6 py-4 font-bold">Table</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {/* Mock bookings for UI preview */}
              <BookingRow player="Alex Morgan" time="14:00 - 15:30" table="#3" status="confirmed" />
              <BookingRow player="John Doe" time="16:00 - 17:00" table="#1" status="pending" />
              <BookingRow player="Sarah Connor" time="18:30 - 20:00" table="#5" status="confirmed" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, title, value, trend }: any) => (
  <div className="bg-secondary p-6 rounded-3xl border border-gray-800 hover:border-accent/30 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-primary rounded-xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <MoreVertical size={16} className="text-gray-600" />
    </div>
    <p className="text-gray-500 text-sm font-medium">{title}</p>
    <h4 className="text-3xl font-black mt-1">{value}</h4>
    <p className="text-[10px] text-accent font-bold mt-2 uppercase tracking-wider">{trend}</p>
  </div>
);

const TableStatusCard = ({ table }: any) => {
  const isOccupied = table.status === 'occupied';
  const match = table.matches?.[0];

  return (
    <div className={`p-4 rounded-2xl border transition-all ${isOccupied ? 'bg-danger/5 border-danger/20' : 'bg-primary border-gray-800'}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Table</span>
          <h5 className="text-2xl font-black italic">#{table.number}</h5>
        </div>
        <div className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
          table.status === 'available' ? 'bg-success/10 text-success' : 
          table.status === 'occupied' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'
        }`}>
          {table.status.replace('_', ' ')}
        </div>
      </div>

      {isOccupied ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Users size={14} className="text-danger" />
            <span className="font-bold">{match?.player1?.name || 'Player 1'}</span>
            <span className="text-gray-600">vs</span>
            <span className="font-bold">{match?.player2?.name || 'Player 2'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={12} />
            <span>Finishes in 12 min</span>
          </div>
          <div className="w-full bg-gray-800 h-1 rounded-full mt-2 overflow-hidden">
            <div className="bg-danger h-full w-2/3 animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="py-4 text-center text-gray-600 text-sm font-medium italic">
          READY FOR PLAY
        </div>
      )}
    </div>
  );
};

const BookingRow = ({ player, time, table, status }: any) => (
  <tr className="hover:bg-primary/50 transition-colors group">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center font-bold text-xs">
          {player[0]}
        </div>
        <span className="font-bold">{player}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-400 font-medium">{time}</td>
    <td className="px-6 py-4 font-black italic text-accent">{table}</td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
        status === 'confirmed' ? 'bg-success/10 text-success border border-success/20' : 
        'bg-warning/10 text-warning border border-warning/20'
      }`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
        <ChevronRight size={18} className="text-gray-500" />
      </button>
    </td>
  </tr>
);

export default DashboardOverview;
