import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { Activity, Users, Trophy, Clock, ChevronRight, Plus, Minus, Square, Search, Check, Mail } from 'lucide-react';

interface Match {
  id: string;
  table: { number: number };
  player1: { name: string; id: string, email: string } | null;
  player1Name: string | null;
  player1Email: string | null;
  player1Id?: string | null;
  player2: { name: string; id: string, email: string } | null;
  player2Name: string | null;
  player2Email: string | null;
  player2Id?: string | null;
  score1: number;
  score2: number;
  status: 'open' | 'matched' | 'live' | 'finished';
  startTime: string;
}

const LiveMatchesPage = () => {
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get('hallId');
  const [matches, setMatches] = useState<Match[]>([]);
  const [showPlayerModal, setShowPlayerModal] = useState<{ matchId: string, playerIndex: 1 | 2 } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [guestData, setGuestData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (hallId) fetchMatches();
  }, [hallId]);

  const fetchMatches = async () => {
    try {
      const res = await api.get(`/matches?hallId=${hallId}`);
      setMatches(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyMatch = async (matchId: string) => {
    try {
      await api.patch(`/matches/${matchId}/verify`);
      fetchMatches();
      alert('Match verified and started! Players are at the table.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to verify match');
    }
  };

  const handleSearchUsers = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/users?search=${query}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const assignPlayer = async (userId: string | null, name: string, email?: string) => {
    if (!showPlayerModal) return;
    try {
      const payload: any = {};
      if (showPlayerModal.playerIndex === 1) {
        payload.player1Id = userId;
        payload.player1Name = name;
        payload.player1Email = email || null;
      } else {
        payload.player2Id = userId;
        payload.player2Name = name;
        payload.player2Email = email || null;
      }

      await api.patch(`/matches/${showPlayerModal.matchId}/score`, payload);
      setShowPlayerModal(null);
      setSearchQuery('');
      setSearchResults([]);
      setGuestData({ name: '', email: '' });
      fetchMatches();
    } catch (err) {
      console.error(err);
    }
  };

  const updateScore = async (matchId: string, score1: number, score2: number) => {
    // Optimistic Update
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, score1, score2 } : m));
    try {
      await api.patch(`/matches/${matchId}/score`, { score1, score2 });
    } catch (err) {
      console.error(err);
      fetchMatches(); // Revert on error
    }
  };

  const endMatch = async (matchId: string) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    if (!window.confirm(`End match at Table #${match.table.number}? Final Score ${match.score1}:${match.score2}`)) return;

    try {
      await api.patch(`/matches/${matchId}/score`, { status: 'finished' });
      fetchMatches();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
          <Activity className="text-accent animate-pulse" size={32} />
          LIVE MATCHBOARD
        </h2>
        <div className="flex gap-2">
          <div className="bg-success/20 text-success px-4 py-2 rounded-xl text-xs font-black uppercase border border-success/30">
            {matches.filter(m => m.status === 'live').length} Active
          </div>
          <div className="bg-warning/20 text-warning px-4 py-2 rounded-xl text-xs font-black uppercase border border-warning/30">
            {matches.filter(m => m.status === 'matched').length} Pending
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matches.filter(m => m.status !== 'finished').map((match) => (
          <MatchCard 
            key={match.id} 
            match={match} 
            onUpdateScore={(s1, s2) => updateScore(match.id, s1, s2)}
            onEndMatch={() => endMatch(match.id)}
            onAssignPlayer={(index) => setShowPlayerModal({ matchId: match.id, playerIndex: index })}
            onVerifyMatch={() => handleVerifyMatch(match.id)}
          />
        ))}
        
        {matches.filter(m => m.status !== 'finished').length === 0 && (
          <div className="col-span-full py-20 text-center bg-secondary rounded-[2.5rem] border border-gray-800 border-dashed">
            <Users size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest">No live or pending matches</p>
          </div>
        )}
      </div>

      {showPlayerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-secondary w-full max-w-md p-10 rounded-[2.5rem] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-black italic text-accent mb-8 tracking-tight uppercase">Assign Player {showPlayerModal.playerIndex}</h3>
            
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Search Account</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..."
                    className="w-full bg-primary border border-gray-800 pl-12 pr-4 py-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                    value={searchQuery}
                    onChange={(e) => handleSearchUsers(e.target.value)}
                  />
                </div>
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button 
                      key={user.id}
                      onClick={() => assignPlayer(user.id, user.name, user.email)}
                      className="w-full flex items-center justify-between p-4 bg-primary rounded-xl border border-gray-800 hover:border-accent transition-colors"
                    >
                      <div className="text-left">
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-[10px] text-gray-500">{user.email}</p>
                      </div>
                      <Plus size={16} className="text-accent" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-800"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                  <span className="bg-secondary px-4 text-gray-500">OR VERIFIED GUEST</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Guest Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter full name"
                    className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                    value={guestData.name}
                    onChange={(e) => setGuestData({ ...guestData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Guest Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter email for verification"
                    className="w-full bg-primary border border-gray-800 p-4 rounded-2xl text-white outline-none focus:border-accent transition-colors font-bold"
                    value={guestData.email}
                    onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowPlayerModal(null)}
                  className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-2xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  disabled={!guestData.name || !guestData.email}
                  onClick={() => assignPlayer(null, guestData.name, guestData.email)}
                  className="flex-1 bg-accent text-primary font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                >
                  SET GUEST
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MatchCard = ({ match, onUpdateScore, onEndMatch, onAssignPlayer, onVerifyMatch }: { 
  match: Match, 
  onUpdateScore: (s1: number, s2: number) => void,
  onEndMatch: () => void,
  onAssignPlayer: (index: 1 | 2) => void,
  onVerifyMatch: () => void
}) => {
  const isLive = match.status === 'live';
  const isMatched = match.status === 'matched';
  const player1Name = match.player1?.name || match.player1Name || 'Add Player 1';
  const player2Name = match.player2?.name || match.player2Name || 'Add Player 2';
  const hasPlayer1 = !!(match.player1 || match.player1Name);
  const hasPlayer2 = !!(match.player2 || match.player2Name);

  return (
    <div className={`
      relative bg-secondary rounded-[2rem] p-8 border-2 transition-all duration-500
      ${isLive ? 'border-accent shadow-[0_0_30px_rgba(0,255,136,0.15)] ring-1 ring-accent/50' : 
        isMatched ? 'border-warning shadow-[0_0_30px_rgba(255,187,51,0.15)] ring-1 ring-warning/50' : 
        'border-gray-800 opacity-60'}
    `}>
      {isLive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
          Live Now
        </div>
      )}
      {isMatched && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-warning text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
          Ready to Verify
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Table</span>
          <span className="text-3xl font-black italic text-white">#{match.table.number}</span>
        </div>
        <div className="flex items-center gap-2 bg-primary px-4 py-2 rounded-2xl border border-gray-800">
          <Clock size={16} className="text-gray-500" />
          <span className="text-sm font-bold font-mono">
            {new Date(match.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 text-center group/player">
          <div className="relative w-16 h-16 bg-primary rounded-2xl border border-gray-800 flex items-center justify-center mx-auto mb-3 shadow-inner overflow-hidden">
            {hasPlayer1 ? (
              <Users size={24} className="text-gray-600" />
            ) : (
              <button onClick={() => onAssignPlayer(1)} className="w-full h-full flex items-center justify-center bg-accent/10 text-accent hover:bg-accent hover:text-primary transition-all">
                <Plus size={24} />
              </button>
            )}
            {hasPlayer1 && !isLive && (
              <button 
                onClick={() => onAssignPlayer(1)}
                className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover/player:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
          <p className={`text-sm font-black truncate ${!hasPlayer1 ? 'text-gray-600 italic' : ''}`}>{player1Name}</p>
          {isLive && (
            <div className="flex justify-center gap-2 mt-2">
              <button onClick={() => onUpdateScore(Math.max(0, match.score1 - 1), match.score2)} className="p-1 bg-gray-800 rounded-md hover:text-accent transition-colors"><Minus size={12}/></button>
              <button onClick={() => onUpdateScore(match.score1 + 1, match.score2)} className="p-1 bg-gray-800 rounded-md hover:text-accent transition-colors"><Plus size={12}/></button>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <span className={`text-5xl font-black italic tabular-nums ${isLive ? 'text-accent' : 'text-gray-700'}`}>{match.score1}</span>
            <span className="text-xl font-black text-gray-700">:</span>
            <span className={`text-5xl font-black italic tabular-nums ${isLive ? 'text-white' : 'text-gray-700'}`}>{match.score2}</span>
          </div>
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>

        <div className="flex-1 text-center group/player">
          <div className="relative w-16 h-16 bg-primary rounded-2xl border border-gray-800 flex items-center justify-center mx-auto mb-3 shadow-inner overflow-hidden">
            {hasPlayer2 ? (
              <Users size={24} className="text-gray-600" />
            ) : (
              <button onClick={() => onAssignPlayer(2)} className="w-full h-full flex items-center justify-center bg-accent/10 text-accent hover:bg-accent hover:text-primary transition-all">
                <Plus size={24} />
              </button>
            )}
            {hasPlayer2 && !isLive && (
              <button 
                onClick={() => onAssignPlayer(2)}
                className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover/player:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
          <p className={`text-sm font-black truncate ${!hasPlayer2 ? 'text-gray-600 italic' : ''}`}>{player2Name}</p>
          {match.player2Email && !match.player2Id && (
            <div className="flex items-center justify-center gap-1 text-[8px] font-black text-accent uppercase tracking-tighter mt-1">
               <Mail size={8} /> Verified Guest
            </div>
          )}
          {isLive && (
            <div className="flex justify-center gap-2 mt-2">
              <button onClick={() => onUpdateScore(match.score1, Math.max(0, match.score2 - 1))} className="p-1 bg-gray-800 rounded-md hover:text-accent transition-colors"><Minus size={12}/></button>
              <button onClick={() => onUpdateScore(match.score1, match.score2 + 1)} className="p-1 bg-gray-800 rounded-md hover:text-accent transition-colors"><Plus size={12}/></button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800/50 flex gap-3">
        {isMatched || (match.status === 'open' && hasPlayer1 && hasPlayer2) ? (
          <button 
            onClick={onVerifyMatch}
            className="flex-1 bg-warning text-primary font-black uppercase py-4 rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
          >
            <Trophy size={18} /> {isMatched ? 'VERIFY PLAYERS' : 'START MATCH'}
          </button>
        ) : isLive ? (
          <button 
            onClick={onEndMatch}
            className="flex-1 bg-danger/10 text-danger border border-danger/20 text-xs font-black uppercase py-3 rounded-xl hover:bg-danger hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <Square size={14} /> End Match
          </button>
        ) : (
           <div className="flex-1 py-3 text-center text-[10px] font-black text-gray-600 uppercase tracking-widest bg-primary rounded-xl border border-white/5">
              Awaiting Opponent
           </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatchesPage;
