import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="relative">
        {/* The 8-Ball */}
        <div 
          className="w-20 h-20 bg-primary rounded-full border-2 border-white/10 shadow-[0_0_30px_rgba(0,255,136,0.2)] flex items-center justify-center relative z-10"
          style={{ animation: 'ball-bounce 2s infinite ease-in-out' }}
        >
          {/* Inner white circle */}
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner">
            <span className="text-primary font-black text-2xl italic leading-none select-none">8</span>
          </div>
          
          {/* Shine effect */}
          <div className="absolute top-3 left-4 w-4 h-2 bg-white/20 rounded-full blur-[1px] rotate-[-30deg]" />
        </div>
        
        {/* Animated Shadow */}
        <div 
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-12 h-2 bg-accent/20 blur-sm rounded-[100%]"
          style={{ animation: 'shadow-pulse 2s infinite ease-in-out' }}
        />
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
