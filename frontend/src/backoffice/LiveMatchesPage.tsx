import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { Activity, Users, Trophy, Clock, ChevronRight, Plus, Minus, Square } from 'lucide-react';

interface Match {
  id: string;
  table: { number: number };
  player1: { name: string } | null;
  player1Name: string | null;
  player2: { name: string } | null;
  player2Name: string | null;
  score1: number;
  score2: number;
  status: 'live' | 'finished';
  startTime: string;
}

const LiveMatchesPage = () => {
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get('hallId');
  const [matches, setMatches] = useState<Match[]>([]);

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

  const updateScore = async (matchId: string, score1: number, score2: number) => {
    try {
      await api.patch(`/matches/${matchId}/score`, { score1, score2 });
      fetchMatches();
    } catch (err) {
      console.error(err);
    }
  };

  const endMatch = async (matchId: string) => {
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {matches.map((match) => (
          <MatchCard 
            key={match.id} 
            match={match} 
            onUpdateScore={(s1, s2) => updateScore(match.id, s1, s2)}
            onEndMatch={() => endMatch(match.id)}
          />
        ))}
        
        {matches.length === 0 && (
          <div className="col-span-full py-20 text-center bg-secondary rounded-[2.5rem] border border-gray-800 border-dashed">
            <Users size={48} className="mx-auto text-gray-700 mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest">No active matches found</p>
          </div>
        )}
      </div>
    </div>
  );
};

const MatchCard = ({ match, onUpdateScore, onEndMatch }: { 
  match: Match, 
  onUpdateScore: (s1: number, s2: number) => void,
  onEndMatch: () => void 
}) => {
  const isLive = match.status === 'live';
  const player1Name = match.player1?.name || match.player1Name || 'Guest 1';
  const player2Name = match.player2?.name || match.player2Name || 'Guest 2';

  return (
    <div className={`
      relative bg-secondary rounded-[2rem] p-8 border-2 transition-all duration-500
      ${isLive ? 'border-accent shadow-[0_0_30px_rgba(0,255,136,0.15)] ring-1 ring-accent/50' : 'border-gray-800 opacity-60'}
    `}>
      {isLive && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
          Live Now
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
        <div className="flex-1 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl border border-gray-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Users size={24} className="text-gray-600" />
          </div>
          <p className="text-sm font-black truncate">{player1Name}</p>
          <div className="flex justify-center gap-2 mt-2">
            <button onClick={() => onUpdateScore(Math.max(0, match.score1 - 1), match.score2)} className="p-1 bg-gray-800 rounded-md hover:text-accent"><Minus size={12}/></button>
            <button onClick={() => onUpdateScore(match.score1 + 1, match.score2)} className="p-1 bg-gray-800 rounded-md hover:text-accent"><Plus size={12}/></button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="text-5xl font-black italic text-accent tabular-nums">{match.score1}</span>
            <span className="text-xl font-black text-gray-700">:</span>
            <span className="text-5xl font-black italic text-white tabular-nums">{match.score2}</span>
          </div>
          <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>

        <div className="flex-1 text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl border border-gray-800 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Users size={24} className="text-gray-600" />
          </div>
          <p className="text-sm font-black truncate">{player2Name}</p>
          <div className="flex justify-center gap-2 mt-2">
            <button onClick={() => onUpdateScore(match.score1, Math.max(0, match.score2 - 1))} className="p-1 bg-gray-800 rounded-md hover:text-accent"><Minus size={12}/></button>
            <button onClick={() => onUpdateScore(match.score1, match.score2 + 1)} className="p-1 bg-gray-800 rounded-md hover:text-accent"><Plus size={12}/></button>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800/50 flex gap-3">
        <button 
          onClick={onEndMatch}
          className="flex-1 bg-danger/10 text-danger border border-danger/20 text-xs font-black uppercase py-3 rounded-xl hover:bg-danger hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <Square size={14} /> End Match
        </button>
      </div>
    </div>
  );
};

export default LiveMatchesPage;
