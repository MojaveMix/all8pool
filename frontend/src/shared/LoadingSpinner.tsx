interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Modern Circular Loader */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Background blurred glow */}
        <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl animate-pulse" />
        
        {/* Outer static ring */}
        <div className="absolute inset-0 rounded-full border border-gray-800" />
        
        {/* Inner spinning segmented ring */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-accent border-b-2 border-b-transparent border-l-2 border-l-transparent animate-spin drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]" style={{ animationDuration: '1s' }} />
        
        {/* Reverse spinning inner ring */}
        <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-white/30 border-t-2 border-t-transparent border-r-2 border-r-transparent animate-[spin_1.5s_linear_infinite_reverse]" />

        {/* Center Element */}
        <div className="w-12 h-12 bg-secondary border border-gray-700 rounded-full flex items-center justify-center relative z-10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
          <span className="text-accent font-black text-xl italic drop-shadow-[0_0_5px_rgba(0,255,136,0.5)]">
            8
          </span>
        </div>
      </div>
      
      {/* Loading Text */}
      {message && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-gray-300 font-bold uppercase tracking-[0.3em] text-xs animate-pulse">
            {message}
          </p>
          
          {/* Animated loading dots using pulse with delay */}
          <div className="flex gap-1.5">
             <div className="w-1.5 h-1.5 bg-accent/80 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
             <div className="w-1.5 h-1.5 bg-accent/80 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
             <div className="w-1.5 h-1.5 bg-accent/80 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-primary/95 backdrop-blur-lg z-[9999] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-16">
      {content}
    </div>
  );
};

export default LoadingSpinner;
