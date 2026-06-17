import { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Trophy, Star, Medal, Users, Coins, Zap, MapPin, Calendar, Clock, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../shared/LoadingSpinner';
import { useAuth } from '../store/AuthContext';

interface Player {
  id: string;
  name: string;
  avatar: string | null;
  wins: number;
  losses: number;
  rating: number;
  virtualMoney: number;
}

interface PoolHall {
  id: string;
  name: string;
  city: string;
}

const ChallengeModal = ({ player, onClose }: { player: Player, onClose: () => void }) => {
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

  const handleChallenge = async () => {
    if (!selectedHall) return alert('Please select a pool hall');
    setLoading(true);
    try {
      await api.post('/matches/challenge', {
        player2Id: player.id,
        poolHallId: selectedHall,
        scheduledStartTime: `${date}T${time}:00`,
        stake
      });
      alert('Challenge sent successfully!');
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send challenge');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/90 backdrop-blur-xl">
      <div className="bg-secondary w-full max-w-xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-black italic uppercase text-white tracking-tighter">Issue Challenge</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center gap-4 p-4 bg-primary/50 rounded-3xl border border-white/5">
             <div className="w-16 h-16 bg-secondary rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                {player.avatar ? <img src={player.avatar} className="w-full h-full object-cover" /> : <Users size={24} className="text-gray-700" />}
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Challenging Rival</p>
                <p className="text-xl font-black italic text-white uppercase">{player.name}</p>
             </div>
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
            onClick={handleChallenge}
            disabled={loading}
            className="w-full bg-accent text-primary py-5 rounded-2xl font-black uppercase tracking-tighter text-xl shadow-[0_0_50px_rgba(0,255,136,0.2)] hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Sending Protocol...' : <>Dispatch Challenge <ChevronRight size={24} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

const RankingPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { t } = useTranslation();
  const { user } = useAuth();

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
      {selectedPlayer && (
        <ChallengeModal 
          player={selectedPlayer} 
          onClose={() => setSelectedPlayer(null)} 
        />
      )}

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
               <PodiumPosition 
                player={topThree[1]} 
                rank={2} 
                color="text-slate-400" 
                bgColor="bg-slate-400/10" 
                height="h-48" 
                stars={renderStars(topThree[1].rating, 16)} 
                onChallenge={() => setSelectedPlayer(topThree[1])}
                currentUser={user}
                t={t} 
               />
            </div>
          )}
          
          {/* Gold - 1st */}
          {topThree[0] && (
            <div className="order-1 md:order-2 flex-1 max-w-[320px] w-full -translate-y-10 group">
               <PodiumPosition 
                player={topThree[0]} 
                rank={1} 
                color="text-accent" 
                bgColor="bg-accent/10" 
                height="h-64" 
                stars={renderStars(topThree[0].rating, 24)} 
                onChallenge={() => setSelectedPlayer(topThree[0])}
                currentUser={user}
                isGold 
                t={t} 
               />
            </div>
          )}

          {/* Bronze - 3rd */}
          {topThree[2] && (
            <div className="order-3 flex-1 max-w-[280px] w-full group">
               <PodiumPosition 
                player={topThree[2]} 
                rank={3} 
                color="text-amber-600" 
                bgColor="bg-amber-600/10" 
                height="h-40" 
                stars={renderStars(topThree[2].rating, 14)} 
                onChallenge={() => setSelectedPlayer(topThree[2])}
                currentUser={user}
                t={t} 
               />
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

              <div className="hidden md:flex gap-10 text-right pr-4 items-center">
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
                 
                 {user?.id !== player.id && user?.role === 'player' && (
                    <button 
                      onClick={() => setSelectedPlayer(player)}
                      className="bg-accent/10 text-accent p-3 rounded-2xl border border-accent/20 hover:bg-accent hover:text-primary transition-all shadow-lg shadow-accent/5 group/btn"
                    >
                       <Zap size={20} className="group-hover/btn:animate-pulse" />
                    </button>
                 )}
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

const PodiumPosition = ({ player, rank, color, bgColor, height, stars, isGold, t, onChallenge, currentUser }: any) => (
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
         
         {currentUser?.id !== player.id && currentUser?.role === 'player' && (
            <button 
              onClick={onChallenge}
              className="mt-4 flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-xl border border-accent/20 text-[10px] font-black uppercase tracking-widest hover:bg-accent hover:text-primary transition-all mx-auto"
            >
              <Zap size={14} /> Challenge
            </button>
         )}
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
