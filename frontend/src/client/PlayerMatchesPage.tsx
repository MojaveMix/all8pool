import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../store/AuthContext';
import { useTranslation } from 'react-i18next';
import { Activity, Clock, Users, Circle, MapPin, Star, UserPlus, Zap, Plus, X, Calendar, ChevronRight, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';

interface Match {
  id: string;
  table: { number: number } | null;
  poolHall: { id: string; name: string; city: string };
  player1: { id: string; name: string; avatar: string | null; rating: number } | null;
  player1Name: string;
  player1Id?: string;
  player2: { id: string; name: string; avatar: string | null; rating: number } | null;
  player2Name: string;
  player2Id?: string;
  score1: number;
  score2: number;
  status: 'open' | 'matched' | 'live' | 'finished' | 'challenge' | 'cancelled';
  challengeStatus?: 'pending' | 'accepted' | 'rejected' | 'none';
  scheduledStartTime?: string;
  startTime: string;
  appliedPromotion?: string;
  stake?: number;
}

interface PoolHall {
  id: string;
  name: string;
  city: string;
}

const ChallengeModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) => {
  const [halls, setHalls] = useState<PoolHall[]>([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [stake, setStake] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHalls();
  }, []);

  const fetchHalls = async () => {
    try {
      const res = await api.get('/pool-halls');
      setHalls(res.data);
      if (res.data.length > 0) setSelectedHall(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBroadcast = async () => {
    if (!selectedHall) return alert('Please select a pool hall');
    setLoading(true);
    try {
      await api.post('/matches/challenge', {
        poolHallId: selectedHall,
        scheduledStartTime: `${date}T${time}:00`,
        stake
      });
      alert('Open challenge broadcasted successfully!');
      onSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to broadcast challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/90 backdrop-blur-xl">
      <div className="bg-secondary w-full max-w-xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">Broadcast Open Call</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="bg-accent/5 p-6 rounded-3xl border border-accent/10">
             <p className="text-sm text-accent font-black uppercase tracking-widest mb-1">Status: Open to Anyone</p>
             <p className="text-xs text-gray-500 leading-relaxed uppercase font-bold">This challenge will be visible to all players in the Arena. The first to accept will be your rival.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Select Battleground</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                <select 
                  value={selectedHall}
                  onChange={(e) => setSelectedHall(e.target.value)}
                  className="w-full bg-primary border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-bold appearance-none outline-none focus:border-accent transition-colors"
                >
                  {halls.map(h => (
                    <option key={h.id} value={h.id}>{h.name} - {h.city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                  <input 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-primary border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                  <input 
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-primary border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Virtual Stake (Optional)</label>
              <div className="relative">
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-500" size={18} />
                <input 
                  type="number"
                  placeholder="0"
                  value={stake}
                  onChange={(e) => setStake(Number(e.target.value))}
                  className="w-full bg-primary border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleBroadcast}
            disabled={loading}
            className="w-full bg-accent text-primary py-5 rounded-2xl font-black uppercase tracking-tighter text-xl shadow-[0_0_50px_rgba(0,255,136,0.2)] hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Transmitting...' : <>Post Open Challenge <ChevronRight size={24} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

const PlayerMatchesPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'live' | 'finished' | 'challenge'>('live');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

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

  const handleRespondChallenge = async (matchId: string, action: 'accept' | 'reject') => {
    try {
      await api.patch(`/matches/${matchId}/respond`, { action });
      alert(action === 'accept' ? 'Challenge Accepted! Wait for the owner to organize the table.' : 'Challenge Rejected.');
      fetchMatches();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to respond to challenge.');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {showBroadcastModal && (
        <ChallengeModal 
          onClose={() => setShowBroadcastModal(false)} 
          onSuccess={() => { setShowBroadcastModal(false); fetchMatches(); }} 
        />
      )}

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

        <div className="flex flex-wrap gap-4 items-center">
          {user?.role === 'player' && (
             <button 
               onClick={() => setShowBroadcastModal(true)}
               className="bg-accent text-primary px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 transition-all flex items-center gap-2"
             >
                <Plus size={16} /> Broadcast Challenge
             </button>
          )}

          <div className="flex bg-secondary p-1 rounded-2xl border border-gray-800">
            <button 
              onClick={() => setFilter('live')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'live' ? 'bg-accent text-primary shadow-lg shadow-accent/20' : 'text-gray-500 hover:text-white'}`}
            >
              {t('arena.live')}
            </button>
            <button 
              onClick={() => setFilter('challenge')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'challenge' ? 'bg-accent text-primary shadow-lg shadow-accent/20' : 'text-gray-500 hover:text-white'}`}
            >
              Challenges
            </button>
            <button 
              onClick={() => setFilter('finished')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'finished' ? 'bg-accent text-primary shadow-lg shadow-accent/20' : 'text-gray-500 hover:text-white'}`}
            >
              {t('arena.history')}
            </button>
          </div>
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
              onRespond={(action) => handleRespondChallenge(match.id, action)}
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

const PlayerMatchCard = ({ match, onJoin, onRespond, currentUser, t }: { match: Match, onJoin: () => void, onRespond: (action: 'accept' | 'reject') => void, currentUser: any, t: any }) => {
  const isLive = match.status === 'live';
  const isMatched = match.status === 'matched';
  const isOpen = match.status === 'open';
  const isChallenge = match.status === 'challenge';
  
  const p1Name = match.player1?.name || match.player1Name || 'Guest 1';
  const p2Name = match.player2?.name || match.player2Name || t('arena.awaiting_rival', { defaultValue: 'Awaiting Rival' });
  
  const canJoin = isOpen && !match.player2 && currentUser?.role === 'player' && currentUser?.id !== match.player1?.id;
  const isIncomingChallenge = isChallenge && match.player2Id === currentUser?.id && match.challengeStatus === 'pending';

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
        isChallenge ? 'border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.1)]' :
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
          <h4 className="text-2xl font-black italic text-white leading-none">
            {match.table ? `TABLE #${match.table.number}` : 'TBD'}
          </h4>
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
        {isChallenge && (
           <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${match.challengeStatus === 'accepted' ? 'bg-success/20 text-success border-success/30' : 'bg-blue-500/20 text-blue-500 border-blue-500/30'}`}>
              <Zap size={8} className={match.challengeStatus === 'pending' ? 'animate-pulse' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">{match.challengeStatus}</span>
           </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex-1 text-center">
          <Link to={match.player1 ? `/profile/${match.player1.id}` : '#'} className={`relative w-16 h-16 bg-primary rounded-2xl border border-gray-800 flex items-center justify-center mx-auto mb-2 shadow-inner group-hover:scale-110 transition-transform block ${!match.player1 ? 'cursor-default' : 'hover:border-accent'}`}>
             {match.player1?.avatar ? (
                <img src={match.player1.avatar} className="w-full h-full object-cover rounded-2xl" />
             ) : match.player1 ? (
                <div className="w-full h-full bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center font-black italic text-xl text-primary uppercase select-none rounded-2xl">
                  {match.player1.name ? match.player1.name[0] : 'P'}
                </div>
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
             ) : match.player2 ? (
                <div className="w-full h-full bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center font-black italic text-xl text-primary uppercase select-none rounded-2xl">
                  {match.player2.name ? match.player2.name[0] : 'P'}
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
               {isChallenge ? (match.scheduledStartTime ? new Date(match.scheduledStartTime).toLocaleString() : 'TBD') : 
                isMatched ? 'Verification Required' : isLive ? 'Match in Progress' : 'Awaiting Rival'}
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

         {isIncomingChallenge && (
            <div className="flex gap-2 w-full">
               <button 
                  onClick={() => onRespond('accept')}
                  className="flex-1 bg-accent text-primary py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 transition-all"
               >
                  Accept
               </button>
               <button 
                  onClick={() => onRespond('reject')}
                  className="flex-1 bg-red-500 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
               >
                  Reject
               </button>
            </div>
         )}

         {isChallenge && match.challengeStatus === 'accepted' && (
            <div className="w-full bg-success/10 text-success p-4 rounded-2xl border border-success/20 text-center">
               <p className="text-[10px] font-black uppercase tracking-widest mb-1">Challenge Accepted</p>
               <p className="text-[8px] font-bold text-gray-400 uppercase leading-relaxed italic">The owner will assign a table shortly. Check back soon.</p>
            </div>
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
