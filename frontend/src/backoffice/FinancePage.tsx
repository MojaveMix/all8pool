import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Filter,
  Download,
  Table as TableIcon
} from 'lucide-react';
import { 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import LoadingSpinner from '../shared/LoadingSpinner';

const FinancePage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  // Mock data for professional UI demonstration
  const weeklyData = [
    { day: 'Mon', revenue: 450 },
    { day: 'Tue', revenue: 520 },
    { day: 'Wed', revenue: 480 },
    { day: 'Thu', revenue: 610 },
    { day: 'Fri', revenue: 890 },
    { day: 'Sat', revenue: 1240 },
    { day: 'Sun', revenue: 1100 },
  ];

  const tableIncomeData = [
    { name: 'Table #1', value: 2400 },
    { name: 'Table #2', value: 1800 },
    { name: 'Table #3', value: 3100 },
    { name: 'Table #4', value: 2700 },
    { name: 'Table #5', value: 1500 },
  ];

  const COLORS = ['#00ff88', '#00c851', '#ffbb33', '#ff4444', '#3b82f6'];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, [searchParams]);

  if (loading) return <LoadingSpinner message="Analyzing Financial Data..." />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            <DollarSign className="text-accent" size={32} />
            FINANCE HUB
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Real-time revenue & performance analytics</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-secondary border border-gray-800 px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary transition-colors">
            <Filter size={18} /> Filters
          </button>
          <button className="flex items-center gap-2 bg-accent text-primary px-4 py-2 rounded-xl text-sm font-black uppercase shadow-lg">
            <Download size={18} /> Export Report
          </button>
        </div>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinanceStatCard title="Total Revenue Today" value="$1,240.00" trend="+18.5%" isUp={true} />
        <FinanceStatCard title="Total Weekly Revenue" value="$5,290.00" trend="+12.2%" isUp={true} />
        <FinanceStatCard title="Average per Table" value="$248.00" trend="-2.4%" isUp={false} />
        <FinanceStatCard title="Projected Monthly" value="$22,500.00" trend="+5.1%" isUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-2 bg-secondary rounded-[2.5rem] p-10 border border-gray-800">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-accent" size={20} />
              Revenue Performance (Weekly)
            </h3>
            <div className="flex bg-primary p-1 rounded-xl border border-gray-800">
              <button className="px-4 py-1.5 rounded-lg bg-gray-800 text-xs font-bold text-white">Week</button>
              <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-gray-500">Month</button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="day" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#00ff88' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#00ff88" strokeWidth={4} fillOpacity={1} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income per Table Pie */}
        <div className="bg-secondary rounded-[2.5rem] p-10 border border-gray-800">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <TableIcon className="text-accent" size={20} />
            Income per Table
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tableIncomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {tableIncomeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {tableIncomeData.map((entry, index) => (
              <div key={entry.name} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm font-medium text-gray-400">{entry.name}</span>
                </div>
                <span className="text-sm font-bold text-white">${entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Finance Table (Last Transactions) */}
      <div className="bg-secondary rounded-[2.5rem] border border-gray-800 overflow-hidden">
        <div className="p-8 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold italic tracking-tight">Recent Transactions</h3>
          <button className="text-accent text-xs font-black uppercase tracking-widest hover:underline">View History</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/30 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-5">Date / Time</th>
                <th className="px-10 py-5">Player Name</th>
                <th className="px-10 py-5">Description</th>
                <th className="px-10 py-5">Method</th>
                <th className="px-10 py-5">Amount</th>
                <th className="px-10 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              <TransactionRow date="Jun 14, 13:05" player="James Wilson" desc="Table #4 (2 hours)" method="Credit Card" amount="$24.00" status="Success" />
              <TransactionRow date="Jun 14, 12:40" player="Elena Rossi" desc="Tournament Entry" method="Cash" amount="$15.00" status="Success" />
              <TransactionRow date="Jun 14, 11:15" player="Marcus Aurelius" desc="Table #1 (1 hour)" method="Wallet" amount="$12.00" status="Success" />
              <TransactionRow date="Jun 14, 10:30" player="Nina Williams" desc="Table #3 (1.5 hours)" method="Credit Card" amount="$18.00" status="Pending" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FinanceStatCard = ({ title, value, trend, isUp }: any) => (
  <div className="bg-secondary p-8 rounded-[2rem] border border-gray-800 group hover:border-accent/30 transition-all">
    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-end justify-between">
      <h4 className="text-3xl font-black italic text-white tracking-tighter">{value}</h4>
      <div className={`flex items-center gap-1 text-[11px] font-black ${isUp ? 'text-success' : 'text-danger'}`}>
        {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
  </div>
);

const TransactionRow = ({ date, player, desc, method, amount, status }: any) => (
  <tr className="hover:bg-primary/40 transition-colors group">
    <td className="px-10 py-6 text-sm font-medium text-gray-500">{date}</td>
    <td className="px-10 py-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-800 rounded-xl flex items-center justify-center font-bold text-accent shadow-inner">{player[0]}</div>
        <span className="font-bold text-white">{player}</span>
      </div>
    </td>
    <td className="px-10 py-6 text-sm text-gray-400">{desc}</td>
    <td className="px-10 py-6 text-sm text-gray-400 font-medium">{method}</td>
    <td className="px-10 py-6 font-black italic text-white">{amount}</td>
    <td className="px-10 py-6">
      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
        status === 'Success' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'
      }`}>
        {status}
      </span>
    </td>
  </tr>
);

export default FinancePage;
