import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../store/AuthContext';
import { useTranslation } from 'react-i18next';
import { Activity, Trophy, Clock, Users, Circle, Search, MapPin, Star, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';

interface Match {
  id: string;
  table: { number: number };
  poolHall: { id: string; name: string; city: string };
  player1: { id: string; name: string; avatar: string | null; rating: number } | null;
  player1Name: string;
  player2: { id: string; name: string; avatar: string | null; rating: number } | null;
  player2Name: string;
  score1: number;
  score2: number;
  status: 'open' | 'matched' | 'live' | 'finished';
  startTime: string;
  appliedPromotion?: string;
}

const PlayerMatchesPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'live' | 'finished'>('live');

  useEffect(() => {
    fetchMatches();
  }, [filter]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/matches?status=${filter}`);
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMatch = async (matchId: string) => {
    if (user?.role !== 'player') {
      alert('Only players can join matches.');
      return;
    }
    try {
      await api.post(`/matches/${matchId}/join`);
      alert('Challenge Accepted! Head to the hall to verify with the owner.');
      fetchMatches();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to join match.');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-4">
            <Activity className="text-accent animate-pulse" size={40} />
            {t('arena.title')}
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">
            {t('arena.subtitle')}
          </p>
        </div>

        <div className="flex bg-secondary p-1 rounded-2xl border border-gray-800">
          <button 
            onClick={() => setFilter('live')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'live' ? 'bg-accent text-primary shadow-lg shadow-accent/20' : 'text-gray-500 hover:text-white'}`}
          >
            {t('arena.live')}
          </button>
          <button 
            onClick={() => setFilter('finished')}
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'finished' ? 'bg-accent text-primary shadow-lg shadow-accent/20' : 'text-gray-500 hover:text-white'}`}
          >
            {t('arena.history')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner message={t('common.loading')} />
        </div>
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((match) => (
            <PlayerMatchCard 
              key={match.id} 
              match={match} 
              onJoin={() => handleJoinMatch(match.id)}
              currentUser={user}
              t={t}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/50 rounded-[3rem] border border-dashed border-gray-800">
          <Users size={48} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-500 font-black uppercase tracking-widest">{t('arena.no_matches')}</p>
        </div>
      )}
    </div>
  );
};

const PlayerMatchCard = ({ match, onJoin, currentUser, t }: { match: Match, onJoin: () => void, currentUser: any, t: any }) => {
  const isLive = match.status === 'live';
  const isMatched = match.status === 'matched';
  const isOpen = match.status === 'open';
  
  const p1Name = match.player1?.name || match.player1Name || 'Guest 1';
  const p2Name = match.player2?.name || match.player2Name || t('arena.awaiting_rival', { defaultValue: 'Awaiting Rival' });
  
  const canJoin = isOpen && !match.player2 && currentUser?.role === 'player' && currentUser?.id !== match.player1?.id;

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5 justify-center">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={8} className={`${s <= Math.round(rating) ? 'fill-accent text-accent' : 'text-gray-800'}`} />
      ))}
    </div>
  );

  return (
    <div className={`
      relative bg-secondary rounded-[2.5rem] p-8 border-2 transition-all duration-500 group overflow-hidden flex flex-col
      ${isLive ? 'border-accent shadow-[0_0_40px_rgba(0,255,136,0.1)]' : 
        isMatched ? 'border-warning shadow-[0_0_40px_rgba(255,187,51,0.1)] opacity-95' : 
        'border-gray-800 opacity-80'}
    `}>
      {match.appliedPromotion && (
         <div className="absolute -left-10 top-4 bg-accent text-primary px-10 py-0.5 rotate-[315deg] font-black text-[8px] uppercase tracking-widest shadow-xl">
            {match.appliedPromotion}
         </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 text-gray-500 mb-1">
             <MapPin size={14} className="text-accent" />
             <span className="text-[10px] font-black uppercase tracking-widest">{match.poolHall.name}</span>
          </div>
          <h4 className="text-2xl font-black italic text-white leading-none">TABLE #{match.table.number}</h4>
        </div>
        {isLive && (
           <div className="flex items-center gap-1.5 bg-success/20 text-success px-3 py-1 rounded-full border border-success/30">
              <Circle size={8} className="fill-success animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Live</span>
           </div>
        )}
        {isMatched && (
           <div className="flex items-center gap-1.5 bg-warning/20 text-warning px-3 py-1 rounded-full border border-warning/30">
              <Clock size={8} className="fill-warning animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Matched</span>
           </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex-1 text-center">
          <Link to={match.player1 ? `/profile/${match.player1.id}` : '#'} className={`relative w-16 h-16 bg-primary rounded-2xl border border-gray-800 flex items-center justify-center mx-auto mb-2 shadow-inner group-hover:scale-110 transition-transform block ${!match.player1 ? 'cursor-default' : 'hover:border-accent'}`}>
             {match.player1?.avatar ? (
                <img src={match.player1.avatar} className="w-full h-full object-cover rounded-2xl" />
             ) : (
                <Users size={24} className="text-gray-700" />
             )}
          </Link>
          <p className="text-sm font-black truncate text-white mb-1">{p1Name}</p>
          {match.player1 && renderStars(match.player1.rating)}
        </div>

        <div className="flex flex-col items-center gap-1">
           <div className="flex items-center gap-3">
              <span className={`text-4xl font-black italic tabular-nums ${isLive ? 'text-accent' : 'text-gray-700'}`}>{match.score1}</span>
              <span className="text-xl font-black text-gray-700">:</span>
              <span className={`text-4xl font-black italic tabular-nums ${isLive ? 'text-white' : 'text-gray-700'}`}>{match.score2}</span>
           </div>
           <div className="h-[2px] w-8 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>

        <div className="flex-1 text-center">
          <Link to={match.player2 ? `/profile/${match.player2.id}` : '#'} className={`relative w-16 h-16 bg-primary rounded-2xl border border-gray-800 flex items-center justify-center mx-auto mb-2 shadow-inner group-hover:scale-110 transition-transform overflow-hidden block ${!match.player2 ? 'cursor-default' : 'hover:border-accent'}`}>
             {match.player2?.avatar ? (
                <img src={match.player2.avatar} className="w-full h-full object-cover rounded-2xl" />
             ) : canJoin ? (
                <div className="w-full h-full bg-accent/10 text-accent flex flex-col items-center justify-center gap-1">
                   <UserPlus size={20} />
                   <span className="text-[8px] font-black uppercase tracking-tighter">Open</span>
                </div>
             ) : (
                <Users size={24} className="text-gray-700" />
             )}
          </Link>
          <p className={`text-sm font-black truncate ${isOpen ? 'text-gray-600 italic' : 'text-white'} mb-1`}>{p2Name}</p>
          {match.player2 && renderStars(match.player2.rating)}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-gray-800/50 flex flex-col items-center gap-4">
         <div className="flex items-center gap-2 text-gray-500">
            <Clock size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
               {isMatched ? 'Verification Required' : isLive ? 'Match in Progress' : 'Awaiting Rival'}
            </span>
         </div>
         
         {canJoin && (
            <button 
               onClick={(e) => { e.preventDefault(); onJoin(); }}
               className="w-full bg-accent text-primary py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 transition-all"
            >
               {t('arena.accept_challenge')}
            </button>
         )}

         {isMatched && (
            <div className="w-full bg-warning/10 text-warning p-4 rounded-2xl border border-warning/20 text-center">
               <p className="text-[10px] font-black uppercase tracking-widest mb-1">Safe-Match Secured</p>
               <p className="text-[8px] font-bold text-gray-400 uppercase leading-relaxed">Both players must see the owner to verify physical presence and activate the scoreboard.</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default PlayerMatchesPage;
