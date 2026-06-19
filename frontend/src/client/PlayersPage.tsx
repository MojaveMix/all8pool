import { useState, useEffect } from 'react';
import api from '../api';
import { useTranslation } from 'react-i18next';
import { Search, Star, Zap, X, MapPin, Calendar, Clock, Coins, ShieldCheck, Users } from 'lucide-react';
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
  points: number;
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
      alert('Challenge request sent successfully! Once the player accepts, the owner will review and organize the match.');
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

          <div className="bg-blue-500/10 p-6 rounded-3xl border border-blue-500/20 text-center">
             <ShieldCheck className="text-blue-500 mx-auto mb-2" size={32} />
             <p className="text-sm text-blue-400 font-black uppercase tracking-widest mb-1">Direct Challenge</p>
             <p className="text-xs text-gray-400 font-medium">Send a direct challenge to this player. If they accept, the hall owner will contact both of you to confirm the final arrangements and table reservation.</p>
          </div>

          <div className="flex items-center gap-4 p-4 bg-primary/50 rounded-3xl border border-white/5">
             <div className="w-16 h-16 bg-secondary rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                {player.avatar ? (
                  <img src={player.avatar} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center font-black italic text-xl text-primary uppercase select-none">
                    {player.name ? player.name[0] : 'P'}
                  </div>
                )}
             </div>
             <div>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Challenging</p>
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
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-tighter text-xl shadow-[0_0_50px_rgba(37,99,235,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? 'Transmitting...' : <>Send Challenge Request <Zap size={24} /></>}
          </button>
        </div>
      </div>
    </div>
  );
};

const PlayersPage = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const { t } = useTranslation();
  const { user } = useAuth();

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPlayers(players);
    } else {
      const lowerQ = searchQuery.toLowerCase();
      setFilteredPlayers(players.filter(p => p.name.toLowerCase().includes(lowerQ)));
    }
  }, [searchQuery, players]);

  const fetchPlayers = async () => {
    try {
      const res = await api.get('/users/rankings'); // Reusing rankings for rich stats
      setPlayers(res.data);
      setFilteredPlayers(res.data);
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

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {selectedPlayer && (
        <ChallengeModal 
          player={selectedPlayer} 
          onClose={() => setSelectedPlayer(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase flex items-center gap-4">
            <Users className="text-accent" size={40} />
            Player Directory
          </h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">
            Find Rivals and Send Challenges
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input 
            type="text"
            placeholder="Search players by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-bold outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner message={t('common.loading')} />
        </div>
      ) : filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlayers.map((player) => (
            <div key={player.id} className="bg-secondary/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 hover:border-accent/30 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-accent/10 transition-colors" />
               
               <div className="flex flex-col items-center text-center space-y-4">
                  <Link to={`/profile/${player.id}`} className="w-24 h-24 bg-primary rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform shadow-xl">
                     {player.avatar ? (
                       <img src={player.avatar} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full bg-gradient-to-br from-accent to-emerald-600 flex items-center justify-center font-black italic text-3xl text-primary uppercase select-none">
                         {player.name ? player.name[0] : 'P'}
                       </div>
                     )}
                  </Link>

                  <div>
                     <Link to={`/profile/${player.id}`} className="text-xl font-black italic text-white uppercase group-hover:text-accent transition-colors block mb-1">{player.name}</Link>
                     <div className="flex justify-center">{renderStars(player.rating)}</div>
                  </div>

                  <div className="grid grid-cols-2 w-full gap-3 py-4 border-y border-white/5">
                     <div>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Points</p>
                        <p className="text-sm font-black text-white italic">{player.points.toLocaleString()}</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Win Rate</p>
                        <p className="text-sm font-black text-accent italic">{((player.wins / (player.wins + player.losses || 1)) * 100).toFixed(0)}%</p>
                     </div>
                  </div>

                  {user?.id !== player.id && user?.role === 'player' && (
                     <button 
                       onClick={() => setSelectedPlayer(player)}
                       className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                     >
                        <Zap size={14} /> Send Challenge
                     </button>
                  )}
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/50 rounded-[3rem] border border-dashed border-gray-800">
           <Users size={48} className="mx-auto text-gray-700 mb-4" />
           <p className="text-gray-500 font-black uppercase tracking-widest">No players found matching "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default PlayersPage;
