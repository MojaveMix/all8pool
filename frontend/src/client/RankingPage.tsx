import React, { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Trophy, Star, TrendingUp, Medal, Users, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';

interface Player {
  id: string;
  name: string;
  avatar: string | null;
  wins: number;
  losses: number;
  rating: number;
  virtualMoney: number;
}

const RankingPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const res = await api.get('/users/rankings');
      setPlayers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size = 12) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= Math.round(rating) ? 'fill-accent text-accent' : 'text-gray-800'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) return (
    <div className="py-20">
      <LoadingSpinner message={t('common.loading')} />
    </div>
  );

  const topThree = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="max-w-6xl mx-auto space-y-20 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-6xl font-black italic tracking-tighter text-white uppercase">Hall of Fame</h2>
        <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">The Elite Circle of All 8 Pool</p>
      </div>

      {/* Podium Section */}
      {topThree.length > 0 && (
        <div className="flex flex-col md:flex-row items-end justify-center gap-8 md:gap-4 pt-20">
          {/* Silver - 2nd */}
          {topThree[1] && (
            <div className="order-2 md:order-1 flex-1 max-w-[280px] w-full group">
               <PodiumPosition player={topThree[1]} rank={2} color="text-slate-400" bgColor="bg-slate-400/10" height="h-48" stars={renderStars(topThree[1].rating, 16)} t={t} />
            </div>
          )}
          
          {/* Gold - 1st */}
          {topThree[0] && (
            <div className="order-1 md:order-2 flex-1 max-w-[320px] w-full -translate-y-10 group">
               <PodiumPosition player={topThree[0]} rank={1} color="text-accent" bgColor="bg-accent/10" height="h-64" stars={renderStars(topThree[0].rating, 24)} isGold t={t} />
            </div>
          )}

          {/* Bronze - 3rd */}
          {topThree[2] && (
            <div className="order-3 flex-1 max-w-[280px] w-full group">
               <PodiumPosition player={topThree[2]} rank={3} color="text-amber-600" bgColor="bg-amber-600/10" height="h-40" stars={renderStars(topThree[2].rating, 14)} t={t} />
            </div>
          )}
        </div>
      )}

      {/* List Section */}
      <div className="bg-secondary/30 rounded-[3rem] p-10 border border-white/5">
        <div className="flex items-center gap-4 mb-10 px-4">
           <Medal className="text-accent" size={24} />
           <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Global Leaderboard</h3>
        </div>

        <div className="space-y-4">
          {rest.map((player, index) => (
            <div key={player.id} className="flex items-center gap-6 p-6 bg-primary/40 rounded-3xl border border-white/5 hover:border-accent/30 transition-all group">
              <div className="w-12 text-center font-black italic text-gray-700 text-2xl group-hover:text-accent transition-colors">#{index + 4}</div>
              
              <Link to={`/profile/${player.id}`} className="w-14 h-14 bg-secondary rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                {player.avatar ? <img src={player.avatar} className="w-full h-full object-cover" /> : <Users size={24} className="text-gray-700" />}
              </Link>

              <div className="flex-1">
                <Link to={`/profile/${player.id}`} className="text-xl font-black italic text-white uppercase group-hover:text-accent transition-colors block">{player.name}</Link>
                {renderStars(player.rating)}
              </div>

              <div className="hidden md:flex gap-10 text-right pr-4">
                 <div className="space-y-1 text-yellow-500">
                    <p className="text-[8px] font-black uppercase tracking-widest">{t('profile.coins')}</p>
                    <p className="text-xl font-black italic flex items-center justify-end gap-1">
                      <Coins size={14} /> {player.virtualMoney.toLocaleString()}
                    </p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{t('profile.mastery')}</p>
                    <p className="text-xl font-black text-accent italic">{parseFloat(player.rating.toString()).toFixed(1)}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Palmares</p>
                    <p className="text-xl font-black text-white italic">{player.wins} <span className="text-[10px] text-gray-600 uppercase not-italic">{t('profile.wins')}</span></p>
                 </div>
              </div>
            </div>
          ))}

          {players.length === 0 && (
            <div className="text-center py-20">
               <Users size={64} className="mx-auto text-gray-800 mb-4" />
               <p className="text-gray-500 font-bold uppercase tracking-widest">The arena is quiet. No legends yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PodiumPosition = ({ player, rank, color, bgColor, height, stars, isGold, t }: any) => (
   <div className="flex flex-col items-center gap-6">
      <Link to={`/profile/${player.id}`} className="relative">
         <div className={`w-24 h-24 rounded-[2rem] border-4 border-white/10 overflow-hidden shadow-2xl relative z-10 ${isGold ? 'scale-125' : ''}`}>
            {player.avatar ? <img src={player.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-secondary flex items-center justify-center"><Users size={40} className="text-gray-700" /></div>}
         </div>
         <div className={`absolute -top-4 -right-4 w-12 h-12 ${bgColor} rounded-2xl flex items-center justify-center border-2 border-white/10 z-20 shadow-xl`}>
            <Trophy className={color} size={20} />
         </div>
      </Link>
      
      <div className="text-center space-y-1 mt-4">
         <Link to={`/profile/${player.id}`} className="text-2xl font-black italic text-white uppercase truncate max-w-[200px] hover:text-accent transition-colors block">{player.name}</Link>
         <div className="flex justify-center">{stars}</div>
      </div>

      <div className={`w-full ${height} ${bgColor} rounded-t-[3rem] border-x-2 border-t-2 border-white/10 flex flex-col items-center pt-8 space-y-2 group-hover:border-accent/40 transition-colors shadow-2xl relative overflow-hidden`}>
         <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
         <span className={`text-6xl font-black italic ${color}`}>#{rank}</span>
         <div className="text-center relative z-10">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">{t('profile.coins')}</p>
            <p className="text-xl font-black text-yellow-500 italic flex items-center justify-center gap-1">
              <Coins size={16} /> {player.virtualMoney.toLocaleString()}
            </p>
         </div>
         <div className="text-center relative z-10 pt-2 opacity-50">
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-[0.3em]">Palmares</p>
            <p className="text-sm font-black text-white italic">{player.wins} {t('profile.wins')}</p>
         </div>
      </div>
   </div>
);

export default RankingPage;
