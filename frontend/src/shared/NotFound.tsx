import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-700">
      {/* 404 Visual with a billiard theme */}
      <div className="relative flex items-center justify-center select-none mb-8">
        <span className="text-8xl md:text-9xl font-black italic tracking-tighter text-white/5 font-mono absolute">404</span>
        <div className="flex gap-4 items-center relative z-10">
          <span className="text-7xl md:text-8xl font-black italic tracking-tighter text-white">4</span>
          
          {/* Stylized 8-ball replacing the '0' */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-primary border-4 border-gray-800 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(0,255,136,0.2)] animate-bounce relative">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center font-black text-primary text-sm md:text-md select-none">
              8
            </div>
            <div className="absolute top-1 left-2 w-3 h-1.5 bg-white/20 rounded-full transform rotate-[-30deg]"></div>
          </div>
          
          <span className="text-7xl md:text-8xl font-black italic tracking-tighter text-white">4</span>
        </div>
      </div>

      {/* Styled text block */}
      <div className="space-y-4 max-w-md">
        <h3 className="text-2xl font-black italic text-accent tracking-tight uppercase">CUE BALL SCRATCHED!</h3>
        <p className="text-gray-400 font-bold text-sm leading-relaxed uppercase tracking-wider">
          The page you are looking for has been pocketed or never existed. Let's get you back on the table.
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full max-w-xs sm:max-w-md justify-center">
        <Link 
          to="/"
          className="flex items-center justify-center gap-2 bg-accent text-primary px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-accent/15 hover:scale-[1.02] transition-transform"
        >
          <ChevronLeft size={16} /> Return to Lobby
        </Link>
        <Link 
          to="/arena"
          className="flex items-center justify-center gap-2 bg-secondary text-white border border-gray-800 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:border-white/20 hover:bg-gray-800 transition-colors"
        >
          <HelpCircle size={16} /> Discovery Arena
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
