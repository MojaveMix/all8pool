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
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter">FIND YOUR NEXT TABLE.</h2>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input 
              type="text"
              placeholder="Search by hall name or city..."
              className="w-full pl-12 pr-4 py-4 bg-secondary border border-gray-800 rounded-2xl focus:border-accent outline-none text-white shadow-2xl"
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
            className="group bg-secondary rounded-3xl border border-gray-800 overflow-hidden hover:border-accent/50 transition-all cursor-pointer"
            onClick={() => navigate(`/hall/${hall.id}`)}
          >
            <div className="h-40 bg-primary flex items-center justify-center group-hover:bg-primary/50 transition-colors">
              <div className="text-6xl font-black text-gray-900 group-hover:text-accent/10 transition-colors">POOL</div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">{hall.name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                    <MapPin size={14} /> {hall.city}
                  </p>
                </div>
                <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Active
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                  <span className="text-white">8</span> Active
                </div>
                <div className="flex items-center gap-1.5">
                  <Trophy size={14} className="text-accent" />
                  <span className="text-white">3</span> Matches
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="text-sm text-gray-400">
                  <span className="text-accent font-black">4</span> Tables Free
                </div>
                <button className="bg-white text-primary px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-accent hover:scale-105 transition-all">
                  Book Table
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
