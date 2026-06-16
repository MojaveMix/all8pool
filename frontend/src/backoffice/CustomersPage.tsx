import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Ban, 
  Tag, 
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';

const CustomersPage = () => {
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get('hallId');
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for professional UI
    setCustomers([
      { id: '1', name: 'Alex Morgan', visits: 24, spent: 480, favoriteTable: '#4', lastVisit: 'Jun 12, 2026', status: 'active' },
      { id: '2', name: 'John Smith', visits: 12, spent: 210, favoriteTable: '#1', lastVisit: 'Jun 10, 2026', status: 'active' },
      { id: '3', name: 'Sarah Connor', visits: 45, spent: 920, favoriteTable: '#2', lastVisit: 'Jun 14, 2026', status: 'active' },
      { id: '4', name: 'David K.', visits: 8, spent: 140, favoriteTable: '#3', lastVisit: 'May 28, 2026', status: 'blocked' },
    ]);
    setLoading(false);
  }, [hallId]);

  if (loading) return <LoadingSpinner message="Loading Customers..." />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            <Users className="text-accent" size={32} />
            PLAYER DATABASE
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Monitor and engage with your community</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search players..." 
              className="bg-secondary border border-gray-800 pl-12 pr-4 py-3 rounded-2xl text-sm font-bold outline-none focus:border-accent transition-colors w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-secondary border border-gray-800 px-4 py-3 rounded-2xl text-sm font-bold hover:bg-primary transition-colors">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="bg-secondary rounded-[2.5rem] border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/30 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-10 py-5">Player Name</th>
                <th className="px-10 py-5">Visits</th>
                <th className="px-10 py-5">Total Spent</th>
                <th className="px-10 py-5">Fav Table</th>
                <th className="px-10 py-5">Last Visit</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {customers.map((player) => (
                <tr key={player.id} className="hover:bg-primary/40 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-gray-800 rounded-2xl flex items-center justify-center text-accent font-black shadow-inner">
                          {player.name[0]}
                        </div>
                        {player.visits > 20 && (
                          <div className="absolute -top-1 -right-1 bg-warning text-primary p-0.5 rounded-full border-2 border-secondary">
                            <Star size={10} fill="currentColor" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-white block">{player.name}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${player.status === 'blocked' ? 'text-danger' : 'text-success'}`}>
                          {player.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm font-black text-white">{player.visits}</td>
                  <td className="px-10 py-6 font-black italic text-accent tracking-tighter text-lg">${player.spent}</td>
                  <td className="px-10 py-6 text-sm text-gray-400 font-bold">{player.favoriteTable}</td>
                  <td className="px-10 py-6 text-sm text-gray-500 font-medium">{player.lastVisit}</td>
                  <td className="px-10 py-6">
                    <div className="flex justify-end gap-2">
                      <button className="p-3 bg-primary border border-gray-800 rounded-xl hover:text-accent transition-all" title="View Profile">
                        <Eye size={18} />
                      </button>
                      <button className="p-3 bg-primary border border-gray-800 rounded-xl hover:text-warning transition-all" title="Give Discount">
                        <Tag size={18} />
                      </button>
                      <button className="p-3 bg-primary border border-gray-800 rounded-xl hover:text-danger transition-all" title="Block User">
                        <Ban size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-8 border-t border-gray-800 flex justify-between items-center bg-secondary/50">
          <p className="text-xs font-bold text-gray-600">Showing 1 to 4 of 128 players</p>
          <div className="flex gap-2">
            <button className="p-2 bg-primary border border-gray-800 rounded-xl text-gray-500 cursor-not-allowed">
              <ChevronLeft size={18} />
            </button>
            <button className="px-4 py-2 bg-accent text-primary rounded-xl text-[10px] font-black uppercase">1</button>
            <button className="px-4 py-2 bg-primary border border-gray-800 text-white rounded-xl text-[10px] font-black uppercase hover:border-accent transition-colors">2</button>
            <button className="px-4 py-2 bg-primary border border-gray-800 text-white rounded-xl text-[10px] font-black uppercase hover:border-accent transition-colors">3</button>
            <button className="p-2 bg-primary border border-gray-800 rounded-xl text-white hover:border-accent transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
