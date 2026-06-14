import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import { Trophy, Users, Plus, ChevronRight, Play, Star } from 'lucide-react';

const TournamentsPage = () => {
  const [searchParams] = useSearchParams();
  const hallId = searchParams.get('hallId');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);

  // Mock data for professional UI demonstration
  const tournaments = [
    { id: '1', name: 'Summer 8-Ball Open', size: 16, status: 'ongoing', entryFee: 20, prizePool: 400 },
    { id: '2', name: 'Snooker Masters 2026', size: 8, status: 'upcoming', entryFee: 50, prizePool: 1000 },
    { id: '3', name: 'Weekly Amateur 9-Ball', size: 32, status: 'finished', entryFee: 10, prizePool: 250 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
          <Trophy className="text-accent" size={32} />
          TOURNAMENT ARENA
        </h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-accent text-primary px-6 py-3 rounded-2xl font-black uppercase tracking-tighter shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
        >
          <Plus size={20} /> Create Tournament
        </button>
      </div>

      {selectedTournament ? (
        <TournamentBracketView tournament={selectedTournament} onBack={() => setSelectedTournament(null)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((t) => (
            <TournamentCard key={t.id} tournament={t} onSelect={() => setSelectedTournament(t)} />
          ))}
        </div>
      )}
    </div>
  );
};

const TournamentCard = ({ tournament, onSelect }: any) => (
  <div className="bg-secondary rounded-[2.5rem] p-8 border border-gray-800 hover:border-accent/40 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
      <Trophy size={120} />
    </div>

    <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ${
      tournament.status === 'ongoing' ? 'bg-success/10 text-success border border-success/20' : 
      tournament.status === 'upcoming' ? 'bg-accent/10 text-accent border border-accent/20' : 
      'bg-gray-800 text-gray-400'
    }`}>
      {tournament.status}
    </div>

    <h3 className="text-2xl font-black italic text-white mb-2">{tournament.name}</h3>
    
    <div className="flex gap-4 mb-6">
      <div className="flex items-center gap-2 text-gray-500 text-sm font-bold">
        <Users size={16} /> {tournament.size} Players
      </div>
      <div className="flex items-center gap-2 text-accent text-sm font-bold">
        <Star size={16} /> ${tournament.prizePool} Prize
      </div>
    </div>

    <div className="space-y-3 mb-8">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-gray-600">
        <span>Registration</span>
        <span>{tournament.status === 'finished' ? '100%' : '75%'}</span>
      </div>
      <div className="h-2 bg-primary rounded-full overflow-hidden border border-gray-800">
        <div 
          className="h-full bg-accent shadow-[0_0_10px_#00ff88]" 
          style={{ width: tournament.status === 'finished' ? '100%' : '75%' }} 
        />
      </div>
    </div>

    <button 
      onClick={onSelect}
      className="w-full flex items-center justify-center gap-2 bg-primary border border-gray-800 py-4 rounded-2xl font-black uppercase tracking-tighter group-hover:bg-accent group-hover:text-primary transition-all"
    >
      {tournament.status === 'ongoing' ? 'View Bracket' : 'Manage Tournament'}
      <ChevronRight size={18} />
    </button>
  </div>
);

const TournamentBracketView = ({ tournament, onBack }: any) => (
  <div className="space-y-8 animate-in zoom-in-95 duration-500">
    <button onClick={onBack} className="text-gray-500 hover:text-white flex items-center gap-2 font-bold uppercase text-xs tracking-widest">
      <ChevronRight className="rotate-180" size={16} /> Back to Arena
    </button>

    <div className="bg-secondary rounded-[3rem] p-12 border border-gray-800 relative overflow-hidden">
      <div className="text-center mb-16">
        <h3 className="text-4xl font-black italic text-white mb-2 tracking-tighter uppercase">{tournament.name}</h3>
        <p className="text-accent font-bold tracking-[0.3em] text-xs uppercase">Championship Bracket — Round of 16</p>
      </div>

      {/* Bracket Tree Visualization (Simplified for UI Demo) */}
      <div className="flex justify-around items-center gap-8 relative min-h-[400px]">
        {/* Round 1 (Left) */}
        <div className="space-y-12">
          <BracketMatch p1="Alex Morgan" p2="John Smith" s1={3} s2={2} active />
          <BracketMatch p1="Sarah Jenkins" p2="Mike Ross" s1={1} s2={3} />
        </div>

        {/* Connectors */}
        <div className="flex-1 h-px bg-gray-800 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full shadow-[0_0_10px_#00ff88]" />
        </div>

        {/* Quarter Final */}
        <div className="space-y-24">
          <BracketMatch p1="Alex Morgan" p2="Mike Ross" s1={0} s2={0} isNext />
        </div>

        <div className="flex-1 h-px bg-gray-800 border-dashed" />

        {/* Final */}
        <div className="text-center">
            <div className="w-24 h-24 bg-accent/10 rounded-3xl border-2 border-accent border-dashed flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Trophy size={40} className="text-accent" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">Grand Final</span>
        </div>
      </div>
    </div>
  </div>
);

const BracketMatch = ({ p1, p2, s1, s2, active, isNext }: any) => (
  <div className={`
    w-64 bg-primary rounded-2xl border-2 p-4 space-y-3 transition-all
    ${active ? 'border-accent shadow-[0_0_20px_rgba(0,255,136,0.1)]' : isNext ? 'border-gray-700 border-dashed opacity-50' : 'border-gray-800'}
  `}>
    <div className="flex justify-between items-center">
      <span className={`text-sm font-bold ${s1 > s2 ? 'text-white' : 'text-gray-500'}`}>{p1}</span>
      <span className="text-lg font-black italic text-accent tabular-nums">{s1}</span>
    </div>
    <div className="h-px bg-gray-800" />
    <div className="flex justify-between items-center">
      <span className={`text-sm font-bold ${s2 > s1 ? 'text-white' : 'text-gray-500'}`}>{p2}</span>
      <span className="text-lg font-black italic text-white tabular-nums">{s2}</span>
    </div>
  </div>
);

export default TournamentsPage;
