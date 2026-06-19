import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Zap, MapPin, Calendar, Clock, Coins, ChevronLeft, Check, Flame } from 'lucide-react';
import api from '../api';
import { useAuth } from '../store/AuthContext';

interface Player {
  id: string;
  name: string;
  avatar: string | null;
  rating: number;
  wins?: number;
  losses?: number;
}

interface PoolHall {
  id: string;
  name: string;
  city: string;
}

interface IncomingChallenge {
  id: string;
  player1Id: string;
  player1: {
    id: string;
    name: string;
    avatar: string | null;
    rating: number;
  };
  poolHall: {
    name: string;
    city: string;
  };
  scheduledStartTime: string;
  stake: number;
  challengeStatus: string;
}

const GlobalChallengeWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'contenders' | 'incoming'>('contenders');
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [incomingChallenges, setIncomingChallenges] = useState<IncomingChallenge[]>([]);
  
  // Challenge Form State
  const [halls, setHalls] = useState<PoolHall[]>([]);
  const [selectedHall, setSelectedHall] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [stake, setStake] = useState(0);
  const [loading, setLoading] = useState(false);

  // Background incoming challenges polling
  useEffect(() => {
    if (!user) return;
    fetchIncoming();
    const interval = setInterval(fetchIncoming, 15000); // check for incoming challenges every 15s
    return () => clearInterval(interval);
  }, [user]);

  // Handle drawer data fetching when open
  useEffect(() => {
    if (isOpen) {
      fetchPlayers();
      fetchHalls();
      fetchIncoming();
    }
  }, [isOpen]);

  useEffect(() => {
    const list = user ? players.filter(p => p.id !== user.id) : players;
    if (searchQuery.trim() === '') {
      setFilteredPlayers(list);
    } else {
      const lowerQ = searchQuery.toLowerCase();
      setFilteredPlayers(list.filter(p => p.name.toLowerCase().includes(lowerQ)));
    }
  }, [searchQuery, players, user]);

  const fetchPlayers = async () => {
    try {
      const res = await api.get('/users/rankings'); // Reusing rankings to get players
      setPlayers(res.data);
      setFilteredPlayers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHalls = async () => {
    try {
      const res = await api.get('/pool-halls');
      setHalls(res.data);
      if (res.data.length > 0) setSelectedHall(res.data[0].id);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIncoming = async () => {
    if (!user) return;
    try {
      const res = await api.get('/matches?status=challenge');
      const incoming = res.data.filter(
        (m: any) => m.player2Id === user.id && m.challengeStatus === 'pending'
      );
      setIncomingChallenges(incoming);
    } catch (err) {
      console.error('Failed to load incoming challenges', err);
    }
  };

  const handleChallenge = async () => {
    if (!selectedPlayer) return;
    if (selectedPlayer.id === user?.id) {
      return alert('You cannot challenge yourself');
    }
    if (!selectedHall) return alert('Please select a pool hall');
    setLoading(true);
    try {
      await api.post('/matches/challenge', {
        player2Id: selectedPlayer.id,
        poolHallId: selectedHall,
        scheduledStartTime: `${date}T${time}:00`,
        stake
      });
      alert('Challenge request sent successfully!');
      setSelectedPlayer(null);
      setIsOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to send challenge');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (matchId: string, action: 'accept' | 'reject') => {
    setLoading(true);
    try {
      await api.patch(`/matches/${matchId}/respond`, { action });
      alert(`Challenge ${action === 'accept' ? 'accepted!' : 'declined!'}`);
      fetchIncoming();
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${action} challenge`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Floating Vertical Edge Tab */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-[9990] flex flex-col items-center justify-center py-6 px-3 bg-gradient-to-b from-primary/95 via-emerald-950/95 to-primary/95 border-l-2 border-y-2 border-accent/40 rounded-l-2xl shadow-[-5px_0_25px_rgba(0,255,136,0.15)] hover:border-accent hover:-translate-x-1 hover:shadow-[-5px_0_35px_rgba(0,255,136,0.4)] transition-all duration-300 group ${isOpen ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}
      >
        <div className="w-8 h-8 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-3 shadow-[0_0_10px_rgba(0,255,136,0.2)] group-hover:bg-accent/20 group-hover:scale-110 transition-all duration-300">
          <Zap size={16} className="text-accent animate-pulse" />
        </div>
        <span 
          className="text-[10px] font-black uppercase tracking-[0.25em] text-white/90 group-hover:text-accent font-mono select-none"
          style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
        >
          CHALLENGE PLAYERS
        </span>
        
        {/* Glow indicator dot */}
        {incomingChallenges.length > 0 && (
          <>
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-accent rounded-full border border-primary shadow-[0_0_10px_#00ff88] animate-ping" />
            <div className="absolute -top-1 -left-1 w-4 h-4 bg-accent rounded-full border border-primary shadow-[0_0_5px_#00ff88] flex items-center justify-center text-[8px] text-primary font-black">
              {incomingChallenges.length}
            </div>
          </>
        )}
      </button>

      {/* Slide-out Panel Overlay Background */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[9994] bg-black/80 backdrop-blur-sm"
            />

            {/* Sidebar Challenge Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 z-[9995] w-full sm:w-[420px] h-screen bg-[#121212]/95 border-l-2 border-accent/20 backdrop-blur-xl shadow-[-10px_0_50px_rgba(0,255,136,0.15)] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-primary via-emerald-950 to-primary p-6 border-b border-accent/20 flex items-center justify-between shrink-0 relative">
                {/* Glow strip */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_10px_#00ff88]" />
                
                <div className="flex items-center gap-3">
                  {selectedPlayer ? (
                    <button 
                      onClick={() => setSelectedPlayer(null)} 
                      className="p-2 hover:bg-accent/10 border border-white/5 hover:border-accent/20 rounded-xl transition-colors text-white hover:text-accent"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  ) : (
                    <div className="p-2 bg-accent/10 rounded-xl border border-accent/20">
                      <Flame size={20} className="text-accent animate-pulse" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-black italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-accent to-white tracking-wider drop-shadow-[0_0_8px_rgba(0,255,136,0.3)]">
                      {selectedPlayer ? 'GAUNTLET CONFIG' : 'CHALLENGE ARENA'}
                    </h3>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-emerald-400/60 mt-0.5">
                      {selectedPlayer ? 'Configure Battle Parameters' : 'Launch & Respond to Duels'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 hover:bg-danger/10 border border-transparent hover:border-danger/30 rounded-xl transition-colors text-white/70 hover:text-danger"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tab Selector (only visible when not configuring a challenge) */}
              {!selectedPlayer && (
                <div className="flex border-b border-white/5 bg-[#161616] shrink-0">
                  <button 
                    onClick={() => setActiveTab('contenders')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest font-mono border-b-2 transition-all ${activeTab === 'contenders' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-white'}`}
                  >
                    Contenders
                  </button>
                  <button 
                    onClick={() => setActiveTab('incoming')}
                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest font-mono border-b-2 transition-all relative ${activeTab === 'incoming' ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-white'}`}
                  >
                    Incoming Duels
                    {incomingChallenges.length > 0 && (
                      <span className="ml-2 bg-accent text-primary text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-[0_0_8px_#00ff88]">
                        {incomingChallenges.length}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-5 relative">
                <AnimatePresence mode="wait">
                  {!selectedPlayer ? (
                    activeTab === 'contenders' ? (
                      /* CONTENDERS TAB */
                      <motion.div
                        key="player-list"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4 h-full flex flex-col"
                      >
                        {/* Search Bar */}
                        <div className="relative shrink-0">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/60" size={16} />
                          <input
                            type="text"
                            placeholder="SEARCH TARGET PLAYERS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-primary/80 border border-white/15 focus:border-accent rounded-2xl pl-11 pr-4 py-3.5 text-xs uppercase tracking-wider font-mono text-white outline-none transition-all placeholder-gray-500 shadow-inner focus:shadow-[0_0_15px_rgba(0,255,136,0.15)]"
                          />
                        </div>
                        
                        {/* Candidates */}
                        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                          {filteredPlayers.length > 0 ? (
                            filteredPlayers.map((player) => (
                              <div 
                                key={player.id} 
                                className="relative flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/70 border border-white/5 hover:border-accent/30 rounded-2xl transition-all duration-300 group overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                
                                <div className="flex items-center gap-3.5 overflow-hidden relative z-10">
                                  <div className="relative shrink-0">
                                    <div className="w-12 h-12 bg-primary rounded-xl border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-accent/40 transition-colors">
                                      {player.avatar ? (
                                        <img src={player.avatar} className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="font-mono text-base font-black uppercase text-accent">{player.name[0]}</span>
                                      )}
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-accent border border-primary rounded-full shadow-[0_0_5px_#00ff88]" />
                                  </div>
                                  
                                  <div className="min-w-0">
                                    <p className="text-sm font-black text-white truncate uppercase tracking-wide group-hover:text-accent transition-colors">
                                      {player.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-[10px] text-accent font-mono uppercase tracking-widest bg-accent/5 px-1.5 py-0.5 rounded border border-accent/15">
                                        RATING: {parseFloat((player.rating ?? 0).toString()).toFixed(1)}
                                      </span>
                                    </div>
                                    {/* Win Rate Stats */}
                                    <div className="flex gap-1.5 mt-1.5">
                                      <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">
                                        {player.wins || 0} W
                                      </span>
                                      <span className="text-[8px] font-mono font-bold text-danger bg-danger/10 px-1.5 py-0.5 rounded border border-danger/20 uppercase tracking-widest">
                                        {player.losses || 0} L
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <button
                                  onClick={() => setSelectedPlayer(player)}
                                  className="bg-accent/10 text-accent p-3 rounded-xl border border-accent/25 hover:bg-accent hover:text-primary transition-all duration-300 shrink-0 shadow-[0_0_10px_rgba(0,255,136,0.1)] hover:shadow-[0_0_20px_rgba(0,255,136,0.4)] group-hover:scale-105 relative z-10"
                                >
                                  <Zap size={16} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-20 opacity-40">
                              <Search size={36} className="mx-auto mb-3 text-accent/50" />
                              <p className="text-xs font-mono uppercase tracking-widest font-black">No contenders active</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ) : (
                      /* INCOMING TAB */
                      <motion.div
                        key="incoming-list"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        {incomingChallenges.length > 0 ? (
                          incomingChallenges.map((challenge) => (
                            <div 
                              key={challenge.id} 
                              className="bg-secondary/35 border border-white/5 rounded-2xl p-4 space-y-4 hover:border-accent/20 transition-all relative overflow-hidden group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/3 to-transparent pointer-events-none" />
                              
                              {/* Challenger header */}
                              <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 bg-primary rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                  {challenge.player1.avatar ? (
                                    <img src={challenge.player1.avatar} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="font-mono text-sm font-black text-accent uppercase">{challenge.player1.name[0]}</span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] text-accent font-mono uppercase tracking-widest">Incoming Challenge</p>
                                  <p className="text-sm font-black text-white uppercase tracking-wide truncate">{challenge.player1.name}</p>
                                </div>
                                <div className="ml-auto shrink-0 bg-accent/10 px-2 py-0.5 rounded border border-accent/20 text-[10px] font-mono text-accent">
                                  ★ {parseFloat(challenge.player1.rating.toString()).toFixed(1)}
                                </div>
                              </div>

                              {/* Details */}
                              <div className="bg-primary/50 p-3 rounded-xl space-y-2 border border-white/5 text-xs text-gray-400 font-mono relative z-10">
                                <div className="flex items-center gap-2">
                                  <MapPin size={14} className="text-accent" />
                                  <span className="truncate text-white">{challenge.poolHall.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar size={14} className="text-accent" />
                                  <span>{formatDate(challenge.scheduledStartTime)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={14} className="text-accent" />
                                  <span>{formatTime(challenge.scheduledStartTime)}</span>
                                </div>
                                <div className="flex items-center gap-2 border-t border-white/5 pt-1.5 mt-1 text-yellow-500">
                                  <Coins size={14} />
                                  <span className="font-black text-white">{challenge.stake} Pts Wagered</span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-2 relative z-10">
                                <button
                                  onClick={() => handleRespond(challenge.id, 'reject')}
                                  disabled={loading}
                                  className="flex-1 py-2.5 border border-danger/30 text-danger rounded-xl text-[10px] font-mono font-black uppercase tracking-wider hover:bg-danger hover:text-white transition-all duration-300 disabled:opacity-50"
                                >
                                  Decline
                                </button>
                                <button
                                  onClick={() => handleRespond(challenge.id, 'accept')}
                                  disabled={loading}
                                  className="flex-1 py-2.5 bg-accent text-primary rounded-xl text-[10px] font-mono font-black uppercase tracking-wider hover:bg-emerald-400 shadow-[0_0_15px_rgba(0,255,136,0.15)] hover:shadow-[0_0_20px_rgba(0,255,136,0.35)] transition-all duration-300 flex items-center justify-center gap-1 disabled:opacity-50"
                                >
                                  Accept Duel <Check size={12} />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-20 opacity-40">
                            <Flame size={36} className="mx-auto mb-3 text-gray-500" />
                            <p className="text-xs font-mono uppercase tracking-widest font-black">No incoming requests</p>
                          </div>
                        )}
                      </motion.div>
                    )
                  ) : (
                    /* CONFIG CHALLENGE VIEW */
                    <motion.div
                      key="challenge-form"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6"
                    >
                      {/* Challenger card info */}
                      <div className="flex items-center gap-4 bg-secondary/40 p-4 rounded-2xl border border-white/5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-transparent pointer-events-none" />
                        <div className="w-14 h-14 bg-primary rounded-xl border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                          {selectedPlayer.avatar ? (
                            <img src={selectedPlayer.avatar} className="w-full h-full object-cover" />
                          ) : (
                            <span className="font-mono text-xl font-black uppercase text-accent">{selectedPlayer.name[0]}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-[9px] text-accent font-mono uppercase tracking-widest">Selected Opponent</p>
                          <p className="text-base font-black text-white uppercase tracking-wider">{selectedPlayer.name}</p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">Rating: {parseFloat((selectedPlayer.rating ?? 0).toString()).toFixed(1)}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Battleground */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest ml-1">Select Battleground</label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={16} />
                            <select 
                              value={selectedHall}
                              onChange={(e) => setSelectedHall(e.target.value)}
                              className="w-full bg-primary border border-white/15 focus:border-accent rounded-xl pl-10 pr-10 py-3 text-xs text-white font-mono uppercase tracking-wide outline-none transition-all appearance-none cursor-pointer"
                            >
                              {halls.map(h => (
                                <option key={h.id} value={h.id}>{h.name} - {h.city}</option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                          </div>
                        </div>

                        {/* Date and Time */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest ml-1">Match Date</label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={16} />
                              <input 
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-primary border border-white/15 focus:border-accent rounded-xl pl-10 pr-3 py-3 text-xs text-white font-mono outline-none transition-all cursor-pointer"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest ml-1">Match Time</label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" size={16} />
                              <input 
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full bg-primary border border-white/15 focus:border-accent rounded-xl pl-10 pr-3 py-3 text-xs text-white font-mono outline-none transition-all cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Stake */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono font-black text-gray-400 uppercase tracking-widest ml-1">Points Wager (Stake)</label>
                          <div className="relative">
                            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500" size={16} />
                            <input 
                              type="number"
                              value={stake}
                              onChange={(e) => setStake(Number(e.target.value))}
                              min="0"
                              className="w-full bg-primary border border-white/15 focus:border-accent rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-white outline-none transition-all"
                              placeholder="0"
                            />
                          </div>
                          <p className="text-[9px] text-gray-500 font-mono italic">Virtual points transferred to the winner of the duel.</p>
                        </div>
                      </div>

                      {/* Dispatch Button */}
                      <button 
                        onClick={handleChallenge}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-accent to-emerald-600 text-primary py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(0,255,136,0.2)] hover:shadow-[0_0_40px_rgba(0,255,136,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {loading ? (
                          'TRANSMITTING CHALLENGE...'
                        ) : (
                          <>
                            DISPATCH CHALLENGE <Zap size={14} />
                          </>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlobalChallengeWidget;
