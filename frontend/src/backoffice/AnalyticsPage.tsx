import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Download,
  ArrowUpRight,
  Filter
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
  Area,
  Cell
} from 'recharts';
import LoadingSpinner from '../shared/LoadingSpinner';

const AnalyticsPage = () => {
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get('hallId');
  const [loading, setLoading] = useState(true);

  // Mock data for professional UI
  const revenueTrend = [
    { name: 'Mon', value: 1200 },
    { name: 'Tue', value: 1500 },
    { name: 'Wed', value: 1300 },
    { name: 'Thu', value: 1800 },
    { name: 'Fri', value: 2400 },
    { name: 'Sat', value: 3200 },
    { name: 'Sun', value: 2800 },
  ];

  const busyHours = [
    { hour: '10:00', load: 15 },
    { hour: '12:00', load: 45 },
    { hour: '14:00', load: 30 },
    { hour: '16:00', load: 60 },
    { hour: '18:00', load: 95 },
    { hour: '20:00', load: 100 },
    { hour: '22:00', load: 85 },
    { hour: '00:00', load: 40 },
  ];

  const tableRanking = [
    { table: 'Table #4', usage: 92 },
    { table: 'Table #1', usage: 85 },
    { table: 'Table #3', usage: 78 },
    { table: 'Table #2', usage: 65 },
    { table: 'Table #5', usage: 45 },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, [hallId]);

  if (loading) return <LoadingSpinner message="Computing Analytics Hub..." />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            <BarChart3 className="text-accent" size={32} />
            INSIGHTS ENGINE
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Advanced metrics and behavioral analytics</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-secondary border border-gray-800 px-4 py-3 rounded-2xl text-sm font-bold hover:bg-primary transition-colors">
            <Filter size={18} /> Time Range
          </button>
          <button className="flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-2xl text-sm font-black uppercase shadow-lg">
            <Download size={18} /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Trend Chart */}
        <div className="lg:col-span-3 bg-secondary rounded-[3rem] p-12 border border-gray-800">
           <div className="flex justify-between items-start mb-12">
             <div>
                <h3 className="text-2xl font-black italic text-white uppercase tracking-tight">Revenue Trends</h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Daily gross revenue over last 7 days</p>
             </div>
             <div className="text-right">
                <span className="text-4xl font-black italic text-accent tabular-nums">$17,200</span>
                <p className="text-success text-[10px] font-black uppercase tracking-widest flex items-center justify-end gap-1 mt-1">
                   <ArrowUpRight size={14} /> +12.4% vs last week
                </p>
             </div>
           </div>
           <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151', borderRadius: '12px' }}
                    itemStyle={{ color: '#00ff88' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#00ff88" strokeWidth={4} fillOpacity={1} fill="url(#colorTrend)" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Small Metrics Column */}
        <div className="space-y-6">
          <MetricSmallCard title="Conversion Rate" value="64.2%" icon={<TrendingUp size={16} />} color="text-accent" />
          <MetricSmallCard title="Avg Session" value="1.8 hrs" icon={<Clock size={16} />} color="text-warning" />
          <MetricSmallCard title="New Players" value="+42" icon={<Users size={16} />} color="text-success" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Busy Hours Heatmap style Bar Chart */}
        <div className="bg-secondary rounded-[2.5rem] p-10 border border-gray-800">
           <h3 className="text-xl font-black italic text-white uppercase tracking-tight mb-8">Heatmap of Busy Hours</h3>
           <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={busyHours}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="hour" stroke="#4b5563" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#1f2937'}}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151', borderRadius: '12px' }}
                  />
                  <Bar dataKey="load" radius={[4, 4, 0, 0]}>
                    {busyHours.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.load > 80 ? '#ff4444' : entry.load > 50 ? '#ffbb33' : '#00ff88'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Most Used Tables Ranking */}
        <div className="bg-secondary rounded-[2.5rem] p-10 border border-gray-800">
           <h3 className="text-xl font-black italic text-white uppercase tracking-tight mb-8">Asset Utilization Ranking</h3>
           <div className="space-y-6">
              {tableRanking.map((item, idx) => (
                <div key={item.table} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-gray-400">{item.table}</span>
                    <span className="text-white">{item.usage}%</span>
                  </div>
                  <div className="h-2 bg-primary rounded-full overflow-hidden border border-gray-800">
                    <div 
                      className={`h-full transition-all duration-1000 ${idx === 0 ? 'bg-accent shadow-[0_0_10px_#00ff88]' : 'bg-gray-600'}`}
                      style={{ width: `${item.usage}%` }} 
                    />
                  </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

const MetricSmallCard = ({ title, value, icon, color }: any) => (
  <div className="bg-secondary p-8 rounded-[2rem] border border-gray-800 flex flex-col justify-between h-full">
    <div className={`p-3 bg-primary rounded-xl border border-gray-800 w-fit mb-4 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-black italic text-white tracking-tighter">{value}</h4>
    </div>
  </div>
);

export default AnalyticsPage;
