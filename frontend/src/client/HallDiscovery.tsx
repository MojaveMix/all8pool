import { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Trophy, ChevronLeft, ChevronRight, Sparkles, SlidersHorizontal, Filter, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PoolHall {
  id: string;
  name: string;
  address: string;
  city: string;
  tables: any[];
  promotionType: 'none' | 'percentage' | 'free';
  promotionValue: number;
  image?: string;
}

const HallDiscovery = () => {
  const [halls, setHalls] = useState<PoolHall[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCity, setSelectedCity] = useState('all');
  const [onlyPromo, setOnlyPromo] = useState(false);
  const ITEMS_PER_PAGE = 6;
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchHalls();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCity, onlyPromo]);

  const fetchHalls = async () => {
    try {
      const res = await api.get('/pool-halls');
      setHalls(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Get unique list of cities for filtration
  const cities = Array.from(new Set(halls.map(h => h.city).filter(Boolean)));

  const filteredHalls = halls.filter(hall => {
    const matchesSearch = 
      hall.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hall.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hall.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === 'all' || hall.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesPromo = !onlyPromo || (hall.promotionType && hall.promotionType !== 'none');

    return matchesSearch && matchesCity && matchesPromo;
  });

  const totalItems = filteredHalls.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedHalls = filteredHalls.slice(startIndex, endIndex);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-500">
      {/* Premium Hero Section */}
      <section className="relative min-h-[300px] rounded-[3rem] overflow-hidden flex flex-col items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_rgba(0,255,136,0.12)_0%,_transparent_70%)] border border-white/5 shadow-2xl">
        {/* Animated background shapes */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 via-primary to-primary z-0" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[80px] animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px] animate-pulse pointer-events-none" />

        <div className="relative z-10 text-center space-y-8 max-w-2xl w-full">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.4em] text-accent bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full select-none">
              <Sparkles size={10} className="animate-spin duration-3000" />
              {halls.length} Premium Arenas Live
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black italic tracking-tighter uppercase leading-none select-none">
              DISCOVER <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-emerald-400 to-cyan-500 drop-shadow-[0_0_30px_rgba(0,255,136,0.25)]">
                THE BEST TABLES.
              </span>
            </h2>
            <p className="text-xs md:text-sm text-gray-400 font-bold max-w-lg mx-auto leading-relaxed">
              Find verified pool halls near you, view table availability, unlock exclusive community discounts, and secure your session in seconds.
            </p>
          </div>

          {/* Glassmorphic Search Bar */}
          <div className="relative max-w-xl mx-auto w-full group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-cyan-500/20 rounded-2xl blur-md opacity-50 group-hover:opacity-100 transition-all duration-300" />
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-accent transition-colors" size={20} />
              <input 
                type="text"
                placeholder={t('arena.search_placeholder')}
                className="w-full pl-14 pr-4 py-4 bg-secondary/80 backdrop-blur-xl border border-gray-800 rounded-2xl focus:border-accent/80 focus:bg-secondary outline-none text-white shadow-2xl font-bold transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sleek Filters Control Bar */}
      <div className="bg-secondary/40 backdrop-blur-md rounded-2xl border border-gray-800/80 p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center border border-gray-800 text-accent">
            <SlidersHorizontal size={18} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Refine Search</h4>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Filter by location & promotions</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          {/* City Selection dropdown */}
          <div className="relative flex items-center gap-2 bg-primary border border-gray-800 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:border-accent transition-colors cursor-pointer min-w-[140px]">
            <Filter size={14} className="text-accent" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-none text-white text-xs font-bold outline-none cursor-pointer appearance-none w-full pr-4 uppercase"
            >
              <option value="all" className="bg-primary text-white">ALL CITIES</option>
              {cities.map((city) => (
                <option key={city} value={city} className="bg-primary text-white uppercase">{city.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Promotions filter toggle */}
          <button
            onClick={() => setOnlyPromo(prev => !prev)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
              onlyPromo 
                ? 'bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(0,255,136,0.1)]' 
                : 'bg-primary border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
            }`}
          >
            <Sparkles size={14} className={onlyPromo ? 'text-accent' : 'text-gray-500'} />
            Exclusive Deals
          </button>
        </div>
      </div>

      {/* Featured/All Halls Grid */}
      {paginatedHalls.length === 0 ? (
        <div className="text-center py-20 bg-secondary/30 rounded-[2.5rem] border border-gray-800 border-dashed space-y-4">
          <div className="text-gray-600 text-5xl">🔍</div>
          <h3 className="text-xl font-black italic uppercase text-white">No Arenas Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto font-bold">
            Try adjusting your search query, city filter, or toggle exclusive deals off.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedHalls.map((hall) => (
            <div 
              key={hall.id} 
              className="group relative bg-secondary rounded-[2.5rem] border border-gray-800/80 overflow-hidden hover:border-accent transition-all duration-300 cursor-pointer shadow-xl hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex flex-col h-full animate-in fade-in duration-300"
              onClick={() => navigate(`/hall/${hall.id}`)}
            >
              {/* Promo ribbon */}
              {hall.promotionType !== 'none' && (
                 <div className="absolute top-4 left-4 bg-accent text-primary px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg z-10 flex items-center gap-1.5 animate-pulse">
                    <Sparkles size={10} />
                    {hall.promotionType === 'free' ? 'FREE HOUR' : `${hall.promotionValue}% OFF`}
                 </div>
              )}
              
              {/* Styled header image container */}
              <div className="h-48 bg-gradient-to-tr from-primary to-secondary relative flex items-center justify-center group-hover:scale-[1.01] transition-transform duration-500 overflow-hidden shrink-0 border-b border-gray-800/50">
                {hall.image ? (
                  <img src={hall.image} alt={hall.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <>
                    {/* Background grid */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
                    
                    {/* Neon blur accent */}
                    <div className="absolute -bottom-10 w-40 h-40 bg-accent/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="text-6xl font-black text-white/5 group-hover:text-accent/10 transition-colors uppercase italic select-none tracking-tighter">ARENA</div>
                  </>
                )}
                <div className="absolute bottom-4 right-4">
                   <span className="bg-primary/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/5 text-gray-300 shadow-md">
                      {hall.city}
                   </span>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-8 flex flex-col flex-1 justify-between gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black italic text-white group-hover:text-accent transition-colors uppercase tracking-tight leading-tight">{hall.name}</h3>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 truncate">
                      <MapPin size={12} className="text-accent shrink-0" /> 
                      <span className="truncate">{hall.address}</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6 py-1">
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1">
                         <Activity size={8} className="text-success animate-pulse" /> {t('common.available')}
                       </p>
                       <span className="text-sm text-gray-300 font-bold italic block">
                         {hall.tables?.length || 0} Tables
                       </span>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1">
                         <Trophy size={8} className="text-accent" /> Skill Class
                       </p>
                       <span className="text-sm text-gray-300 font-bold italic block uppercase">
                         PRO LEVEL
                       </span>
                    </div>
                  </div>
                </div>
                
                {/* Book & Starting Price footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-800/60 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{t('arena.starting_from')}</span>
                    <span className="text-2xl font-black text-white italic tracking-tighter">$12<span className="text-xs text-gray-600 font-bold">/hr</span></span>
                  </div>
                  <button className="bg-accent text-primary px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] hover:scale-105 transition-transform shadow-lg shadow-accent/10 active:scale-95 group-hover:bg-accent/90 cursor-pointer">
                    {t('arena.book_now')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controller */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-800/50">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest select-none">
            Showing {startIndex + 1}–{Math.min(endIndex, totalItems)} of {totalItems} Pool Halls
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-3 bg-secondary border border-gray-800 rounded-xl hover:border-accent hover:text-accent transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-xl text-xs font-black uppercase transition-all cursor-pointer ${
                  currentPage === page 
                    ? 'bg-accent text-primary font-black shadow-[0_0_15px_rgba(0,255,136,0.2)]' 
                    : 'bg-secondary border border-gray-800 text-gray-400 hover:border-accent hover:text-white'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3 bg-secondary border border-gray-800 rounded-xl hover:border-accent hover:text-accent transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallDiscovery;
