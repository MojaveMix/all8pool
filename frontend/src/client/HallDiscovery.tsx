import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, MapPin, Calendar, Users, Trophy, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PoolHall {
  id: string;
  name: string;
  address: string;
  city: string;
  tables: any[];
  promotionType: 'none' | 'percentage' | 'free';
  promotionValue: number;
}

const HallDiscovery = () => {
  const [halls, setHalls] = useState<PoolHall[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const res = await api.get('/pool-halls');
      setHalls(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredHalls = halls.filter(hall => 
    hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hall.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative h-64 rounded-3xl overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary z-0" />
        <div className="relative z-10 text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase">DISCOVER THE BEST TABLES.</h2>
          <div className="relative max-w-xl mx-auto px-4">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text"
              placeholder="Search by hall name or city..."
              className="w-full pl-12 pr-4 py-4 bg-secondary border border-gray-800 rounded-2xl focus:border-accent outline-none text-white shadow-2xl font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Featured/All Halls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredHalls.map((hall) => (
          <div 
            key={hall.id} 
            className="group relative bg-secondary rounded-[2.5rem] border border-gray-800 overflow-hidden hover:border-accent transition-all cursor-pointer shadow-xl"
            onClick={() => navigate(`/hall/${hall.id}`)}
          >
            {hall.promotionType !== 'none' && (
               <div className="absolute -right-10 top-6 bg-accent text-primary px-10 py-1 rotate-45 font-black text-[10px] uppercase tracking-widest shadow-2xl z-10">
                  {hall.promotionType === 'free' ? 'FREE' : `${hall.promotionValue}% OFF`}
               </div>
            )}
            
            <div className="h-40 bg-primary flex items-center justify-center group-hover:bg-primary/50 transition-colors relative overflow-hidden">
              <div className="text-7xl font-black text-gray-900 group-hover:text-accent/10 transition-colors uppercase italic select-none">ARENA</div>
              <div className="absolute bottom-4 right-4">
                 <span className="bg-primary/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                    {hall.city}
                 </span>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-black italic text-white group-hover:text-accent transition-colors uppercase tracking-tight">{hall.name}</h3>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} className="text-accent" /> {hall.address}
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="space-y-1">
                   <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Available</p>
                   <div className="flex items-center gap-1.5">
                     <div className="w-2 h-2 bg-success rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,136,0.5)]" />
                     <span className="text-white font-black italic">{hall.tables?.length || 0} Tables</span>
                   </div>
                </div>
                <div className="space-y-1">
                   <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Skill Level</p>
                   <div className="flex items-center gap-1.5">
                     <Trophy size={14} className="text-accent" />
                     <span className="text-white font-black italic">PRO</span>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-800/50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Starting from</span>
                  <span className="text-xl font-black text-white italic">$12<span className="text-xs text-gray-600">/hr</span></span>
                </div>
                <button className="bg-accent text-primary px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-110 transition-all shadow-lg shadow-accent/20">
                  BOOK NOW
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HallDiscovery;
