interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative">
        {/* Modern 3D Glossy 8-Ball */}
        <div 
          className="w-20 h-20 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#4b5563_0%,_#0b0f19_60%,_#000000_100%)] border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.8),inset_0_4px_12px_rgba(255,255,255,0.25)] flex items-center justify-center relative z-10 overflow-hidden select-none"
          style={{ animation: 'ball-bounce 1.6s infinite ease-in-out' }}
        >
          {/* Glass glare highlight */}
          <div className="absolute top-1.5 left-3.5 w-10 h-5 bg-gradient-to-b from-white/35 via-white/5 to-transparent rounded-full rotate-[-15deg] blur-[0.5px]"></div>
          
          {/* Bottom bounce light reflection */}
          <div className="absolute bottom-1 right-3 w-8 h-3 bg-white/10 rounded-full blur-[1px] opacity-60"></div>
          
          {/* White target circle */}
          <div className="w-9 h-9 bg-gradient-to-tr from-gray-200 via-white to-gray-100 rounded-full flex items-center justify-center shadow-[inset_0_-2px_6px_rgba(0,0,0,0.25),0_4px_8px_rgba(0,0,0,0.5)] transform rotate-[10deg]">
            <span
              className="text-gray-950 font-black text-xl tracking-tighter"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              8
            </span>
          </div>
        </div>
        
        {/* Animated Shadow Wrapper (keeps it perfectly centered while scaling) */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 pointer-events-none">
          <div 
            className="w-full h-full bg-accent/30 rounded-full"
            style={{ animation: 'shadow-pulse 1.6s infinite ease-in-out' }}
          />
        </div>
      </div>
      
      {message && (
        <p className="text-accent font-black italic uppercase tracking-[0.3em] text-sm animate-pulse">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
