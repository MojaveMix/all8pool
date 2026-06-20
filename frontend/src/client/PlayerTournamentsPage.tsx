import { useState, useEffect } from 'react';
import { Trophy, Users, Star, ChevronRight, Medal } from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import api from '../api';
import { TournamentBracket } from '../shared/TournamentBracket';

const PlayerTournamentsPage = () => {
  const { user } = useAuth();
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const res = await api.get('/tournaments');
      setTournaments(res.data);
      // If we currently have a tournament selected, update its data to reflect any new joins
      if (selectedTournament) {
        const updated = res.data.find((t: any) => t.id === selectedTournament.id);
        if (updated) setSelectedTournament(updated);
      }
    } catch (err) {
      console.error('Failed to fetch tournaments', err);
    }
  };

  const handleJoin = async (tournamentId: string) => {
    if (!user) {
      alert('You must be logged in to join a tournament');
      return;
    }
    try {
      await api.post(`/tournaments/${tournamentId}/join`, { userId: user.id });
      alert('Join request sent successfully!');
      fetchTournaments(); // Refresh to update status
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to join tournament');
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Header */}
      <div className="relative h-48 rounded-[3rem] bg-gradient-to-r from-emerald-600/20 to-primary border border-white/5 flex items-center px-12 overflow-hidden">
         <div className="absolute right-0 top-0 opacity-10 scale-150 translate-x-1/4 -translate-y-1/4">
            <Trophy size={300} />
         </div>
         <div className="relative z-10">
            <h2 className="text-5xl font-black italic tracking-tighter uppercase">Championship Arena</h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs mt-2">Where legends are forged in green felt</p>
         </div>
      </div>

      {/* Featured Tournament */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {tournaments.map((t) => {
            const approvedCount = t.players ? t.players.filter((p: any) => p.status === 'approved').length : 0;
            const userEntry = t.players ? t.players.find((p: any) => p.playerId === user?.id) : null;
            const progress = t.size > 0 ? (approvedCount / t.size) * 100 : 0;

            return (
              <div key={t.id} className="group relative bg-secondary rounded-[2.5rem] border border-gray-800 hover:border-accent transition-all overflow-hidden flex flex-col">
                 <div className={`h-32 bg-emerald-500/10 flex items-center justify-center border-b border-white/5 group-hover:bg-accent/5 transition-colors`}>
                    <Medal size={48} className="text-white/20 group-hover:text-accent/30 transition-colors" />
                 </div>

                 <div className="p-8 space-y-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                       <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                          t.status === 'ongoing' ? 'bg-success/10 text-success border-success/20' : 
                          t.status === 'upcoming' ? 'bg-accent/10 text-accent border-accent/20' : 
                          'bg-gray-800 text-gray-500 border-white/5'
                       }`}>
                          {t.status}
                       </span>
                    </div>

                    <h3 className="text-2xl font-black italic text-white leading-tight uppercase tracking-tighter group-hover:text-accent transition-colors">
                       {t.name}
                    </h3>

                    <div className="flex flex-wrap gap-4">
                       <div className="flex items-center gap-2 text-gray-500">
                          <Users size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{approvedCount}/{t.size} Spots</span>
                       </div>
                       <div className="flex items-center gap-2 text-accent">
                          <Star size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Entry Fee: ${t.entryFee}</span>
                       </div>
                       <div className="flex items-center gap-2 text-warning">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{t.size - approvedCount} Empty Left</span>
                       </div>
                    </div>

                    <div className="space-y-2 pt-2">
                       <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-600">
                          <span>Registration Progress</span>
                          <span>{Math.round(progress)}%</span>
                       </div>
                       <div className="h-1.5 bg-primary rounded-full overflow-hidden border border-white/5">
                          <div 
                             className="h-full bg-accent shadow-[0_0_10px_rgba(0,255,136,0.3)] transition-all duration-1000" 
                             style={{ width: `${progress}%` }}
                           />
                       </div>
                    </div>

                    <button 
                       onClick={() => setSelectedTournament(t)}
                       className="w-full flex items-center justify-center gap-2 bg-primary/40 border border-gray-800/80 py-3 rounded-2xl font-black uppercase tracking-tighter text-[10px] text-gray-400 hover:text-white hover:border-accent/40 transition-all"
                    >
                       View Players & Slots
                    </button>

                    <div className="pt-4 mt-auto">
                       {userEntry ? (
                          <div className={`w-full flex items-center justify-center gap-2 border py-4 rounded-2xl font-black uppercase tracking-tighter text-xs ${
                            userEntry.status === 'approved' ? 'bg-success/10 text-success border-success/20' : 
                            userEntry.status === 'pending' ? 'bg-warning/10 text-warning border-warning/20' : 
                            'bg-danger/10 text-danger border-danger/20'
                          }`}>
                             Status: {userEntry.status}
                          </div>
                       ) : (
                          <button 
                             onClick={() => handleJoin(t.id)}
                             disabled={approvedCount >= t.size || t.status !== 'upcoming'}
                             className="w-full flex items-center justify-center gap-2 bg-primary border border-gray-800 py-4 rounded-2xl font-black uppercase tracking-tighter text-xs hover:bg-accent hover:text-primary transition-all disabled:opacity-50"
                          >
                             {approvedCount >= t.size ? 'Tournament Full' : 'Join Tournament'}
                             <ChevronRight size={16} />
                          </button>
                       )}
                    </div>
                 </div>
              </div>
            );
         })}
         {tournaments.length === 0 && (
           <div className="col-span-full text-center py-20 text-gray-500 font-bold uppercase tracking-widest">
             No tournaments available at the moment.
           </div>
         )}
      </div>

      {/* View Players Modal */}
      {selectedTournament && (() => {
         const approvedPlayers = selectedTournament.players?.filter((p: any) => p.status === 'approved') || [];
         const emptySlotsCount = Math.max(0, selectedTournament.size - approvedPlayers.length);

         return (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
               <div className="bg-secondary w-full max-w-4xl p-10 rounded-[3rem] border border-gray-800 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border mb-2 inline-block ${
                           selectedTournament.status === 'ongoing' ? 'bg-success/10 text-success border-success/20' : 
                           selectedTournament.status === 'upcoming' ? 'bg-accent/10 text-accent border-accent/20' : 
                           'bg-gray-800 text-gray-500 border-white/5'
                        }`}>
                           {selectedTournament.status}
                        </span>
                        <h3 className="text-3xl font-black italic text-white tracking-tight uppercase">{selectedTournament.name}</h3>
                        <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-wider">
                           {approvedPlayers.length} / {selectedTournament.size} Spots Filled • <span className="text-warning">{emptySlotsCount} Empty Places Left</span>
                        </p>
                     </div>
                     <button 
                        onClick={() => setSelectedTournament(null)}
                        className="bg-primary/80 text-gray-400 hover:text-white p-3 rounded-full border border-gray-800 hover:border-gray-700 transition-all font-bold text-xs uppercase"
                     >
                        Close
                     </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 space-y-8 scrollbar-thin">
                     <div>
                        <h4 className="text-sm font-black italic text-accent tracking-widest uppercase mb-4 border-b border-gray-800 pb-2">Tournament Bracket (FIFA Style)</h4>
                        <TournamentBracket size={selectedTournament.size} players={approvedPlayers} />
                     </div>

                     <div>
                        <h4 className="text-sm font-black italic text-accent tracking-widest uppercase mb-4 border-b border-gray-800 pb-2">Registered Players & Slots</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {approvedPlayers.map((entry: any, index: number) => (
                              <div key={entry.id} className="bg-primary p-4 rounded-2xl border border-gray-800/80 flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center font-black text-accent text-sm">
                                    {index + 1}
                                 </div>
                                 <div>
                                    <p className="font-bold text-white text-sm">{entry.player?.name || 'Unknown User'}</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Joined Arena</p>
                                 </div>
                              </div>
                           ))}
                           {Array.from({ length: emptySlotsCount }).map((_, index) => (
                              <div key={`empty-${index}`} className="bg-primary/20 p-4 rounded-2xl border border-dashed border-gray-800/50 flex items-center gap-3 opacity-60">
                                 <div className="w-8 h-8 rounded-full border border-dashed border-gray-850 flex items-center justify-center font-bold text-gray-600 text-sm">
                                    {approvedPlayers.length + index + 1}
                                 </div>
                                 <div>
                                    <p className="font-bold text-gray-500 text-sm">Empty Slot</p>
                                    <p className="text-[10px] text-warning font-semibold uppercase tracking-wider">Available</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         );
      })()}

      {/* Stats Overview */}
      <div className="bg-secondary/40 rounded-[3rem] p-12 border border-white/5 flex flex-col md:flex-row gap-12 items-center justify-between">
         <div className="space-y-4 text-center md:text-left">
            <h3 className="text-3xl font-black italic uppercase tracking-tighter">Become a Pro</h3>
            <p className="text-gray-500 font-medium max-w-md">Join sanctioned tournaments to earn professional rating points and climb the global All 8 Pool leaderboard.</p>
         </div>
         <div className="flex gap-8">
            <StatItem label="Total Tournaments" value={tournaments.length.toString()} />
            <StatItem label="Active Players" value="1.2k" />
            <StatItem label="Total Prizes" value="$45k" />
         </div>
      </div>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string, value: string }) => (
   <div className="text-center space-y-1">
      <p className="text-4xl font-black italic text-white tracking-tighter">{value}</p>
      <p className="text-[8px] font-black uppercase tracking-widest text-gray-600">{label}</p>
   </div>
);

export default PlayerTournamentsPage;
