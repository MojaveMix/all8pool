import React, { useState } from 'react';
import { Trophy, User, Maximize2, Minimize2 } from 'lucide-react';

interface TournamentBracketProps {
  size: number;
  players: any[]; // approved players
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({ size, players }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Ensure size is a valid power of 2, default to 8 if not
  const tournamentSize = [8, 16, 32, 64].includes(size) ? size : 8;
  const numRounds = Math.log2(tournamentSize);
  
  // Get names of approved players
  const approvedPlayerNames = players.map(p => p.player?.name || 'Unknown Player');

  // Let's get the round names
  const getRoundName = (roundIndex: number, totalRounds: number) => {
    const roundsLeft = totalRounds - roundIndex;
    if (roundsLeft === 1) return 'Finals';
    if (roundsLeft === 2) return 'Semifinals';
    if (roundsLeft === 3) return 'Quarterfinals';
    if (roundsLeft === 4) return 'Round of 16';
    return `Round of ${Math.pow(2, roundsLeft)}`;
  };

  // Build the bracket structure
  // Round 0: list of matches
  const bracketData: any[][] = [];
  
  // Build Round 1 (index 0)
  const round1Matches: any[] = [];
  const numMatchesInRound1 = tournamentSize / 2;
  for (let i = 0; i < numMatchesInRound1; i++) {
    const playerA = approvedPlayerNames[i * 2] || null;
    const playerB = approvedPlayerNames[i * 2 + 1] || null;
    round1Matches.push({
      id: `r1-m${i}`,
      playerA,
      playerB,
    });
  }
  bracketData.push(round1Matches);

  // Build subsequent rounds (index 1 to numRounds - 1)
  for (let r = 1; r < numRounds; r++) {
    const prevRoundMatches = bracketData[r - 1];
    const numMatchesInThisRound = prevRoundMatches.length / 2;
    const roundMatches: any[] = [];
    for (let i = 0; i < numMatchesInThisRound; i++) {
      // Subsequent rounds show "Winner of Match X" placeholder instead of auto-progressing single players
      const playerA = null;
      const playerB = null;
      const placeholderA = `Winner of Match ${i * 2 + 1}`;
      const placeholderB = `Winner of Match ${i * 2 + 2}`;

      roundMatches.push({
        id: `r${r+1}-m${i}`,
        playerA,
        playerB,
        placeholderA,
        placeholderB,
      });
    }
    bracketData.push(roundMatches);
  }

  const bracketContent = (
    <div className={`w-full overflow-x-auto py-8 select-none scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent ${isFullscreen ? 'min-h-[70vh] flex items-center' : ''}`}>
      <div className="flex gap-12 min-w-[800px] justify-between items-stretch px-4 mx-auto">
        {bracketData.map((roundMatches, roundIndex) => {
          const roundName = getRoundName(roundIndex, numRounds);
          const isLastRound = roundIndex === numRounds - 1;
          
          return (
            <div key={roundIndex} className="flex flex-col flex-1 justify-around min-w-[220px]">
              <div className="text-center mb-6">
                <span className="text-[10px] font-black tracking-[0.2em] text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  {roundName}
                </span>
                <p className="text-[8px] text-gray-500 font-bold uppercase mt-1">
                  {roundMatches.length} Match{roundMatches.length > 1 ? 'es' : ''}
                </p>
              </div>

              <div className="flex flex-col justify-around flex-1 gap-12 py-4 relative">
                {roundMatches.map((match, matchIndex) => (
                  <div key={match.id} className="relative flex flex-col justify-center">
                    {/* Match box */}
                    <div className="bg-primary/80 border border-gray-800/80 rounded-2xl p-4 space-y-3 shadow-lg relative z-10 hover:border-accent/40 hover:bg-primary transition-all">
                      {/* Match Seed Number */}
                      <div className="flex justify-between items-center text-[8px] font-black text-gray-500 tracking-wider uppercase">
                        <span>Match #{matchIndex + 1}</span>
                        <span className="text-accent/50">8-Pool Arena</span>
                      </div>

                      {/* Player 1 */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                            match.playerA ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-gray-900 text-gray-600 border border-gray-850'
                          }`}>
                            {match.playerA ? <User size={12} /> : <span className="text-[8px]">?</span>}
                          </div>
                          <span className={`text-xs font-bold truncate ${match.playerA ? 'text-white' : 'text-gray-500 italic'}`}>
                            {match.playerA || match.placeholderA || 'TBD'}
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-[1px] bg-gray-850" />

                      {/* Player 2 */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                            match.playerB ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-gray-900 text-gray-600 border border-gray-850'
                          }`}>
                            {match.playerB ? <User size={12} /> : <span className="text-[8px]">?</span>}
                          </div>
                          <span className={`text-xs font-bold truncate ${match.playerB ? 'text-white' : 'text-gray-500 italic'}`}>
                            {match.playerB || match.placeholderB || 'TBD'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CSS connection lines */}
                    {!isLastRound && (
                      <div 
                        className={`absolute left-[100%] w-6 border-gray-850 pointer-events-none ${
                          matchIndex % 2 === 0 
                            ? 'h-[50%] border-t-2 border-r-2 rounded-tr-lg top-[50%]' 
                            : 'h-[50%] border-b-2 border-r-2 rounded-br-lg bottom-[50%]'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Winner Showcase */}
        <div className="flex flex-col justify-center items-center min-w-[160px]">
          <div className="text-center mb-6">
            <span className="text-[10px] font-black tracking-[0.2em] text-warning bg-warning/10 px-3 py-1 rounded-full border border-warning/20">
              CHAMPION
            </span>
          </div>
          <div className="bg-gradient-to-b from-warning/20 to-primary/40 border border-warning/30 rounded-[2.5rem] p-6 text-center shadow-xl flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-warning/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Trophy size={44} className="text-warning animate-bounce" />
            <div>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">🏆 ALL 8 POOL 🏆</p>
              <p className="text-xs font-black italic text-white uppercase mt-1">TOURNAMENT WINNER</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative group">
      <button 
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute right-0 top-0 z-40 p-2 bg-gray-800/80 hover:bg-accent hover:text-primary text-gray-400 rounded-xl transition-all shadow-lg opacity-80 group-hover:opacity-100 flex items-center gap-2"
        title={isFullscreen ? "Exit Fullscreen" : "View Fullscreen Bracket"}
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        {!isFullscreen && <span className="text-[10px] font-bold uppercase tracking-wider pr-1">Fullscreen</span>}
      </button>

      {isFullscreen ? (
        <div className="fixed inset-0 z-[99999] bg-secondary/95 backdrop-blur-2xl flex flex-col p-4 md:p-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6 shrink-0 bg-primary/40 p-4 rounded-2xl border border-gray-800">
            <div>
               <h2 className="text-xl md:text-3xl font-black italic text-white uppercase tracking-tight">
                 Tournament Bracket <span className="text-accent ml-2">Arena View</span>
               </h2>
               <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Scroll horizontally to view all rounds</p>
            </div>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-3 bg-gray-800 hover:bg-danger text-white rounded-xl font-bold uppercase tracking-wider transition-colors flex items-center gap-2 text-[10px] md:text-xs"
            >
              <Minimize2 size={16} /> <span className="hidden md:inline">Close Fullscreen</span>
            </button>
          </div>
          <div className="flex-1 bg-primary/40 rounded-3xl border border-gray-800 p-2 md:p-8 overflow-auto shadow-2xl flex items-center justify-center">
            {bracketContent}
          </div>
        </div>
      ) : (
        <div className="mt-8">
           {bracketContent}
        </div>
      )}
    </div>
  );
};
