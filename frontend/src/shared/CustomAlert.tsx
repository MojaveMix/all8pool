import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface CustomAlertProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  if (!isOpen) return null;

  const config = {
    success: { icon: <CheckCircle className="text-emerald-500" size={32} />, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    error: { icon: <AlertCircle className="text-danger" size={32} />, bg: 'bg-danger/10', border: 'border-danger/20' },
    warning: { icon: <AlertCircle className="text-warning" size={32} />, bg: 'bg-warning/10', border: 'border-warning/20' },
    info: { icon: <Info className="text-accent" size={32} />, bg: 'bg-accent/10', border: 'border-accent/20' }
  };

  const currentConfig = config[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-secondary rounded-[2rem] border border-gray-800 p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center text-center space-y-4">
          <div className={`p-4 rounded-full ${currentConfig.bg} ${currentConfig.border} border`}>
            {currentConfig.icon}
          </div>
          
          <h3 className="text-xl font-black text-white italic uppercase tracking-tight">
            {title}
          </h3>
          
          <p className="text-sm font-bold text-gray-400">
            {message}
          </p>

          <div className="flex gap-4 w-full pt-6">
            {onConfirm ? (
              <>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl font-black uppercase text-xs tracking-widest text-gray-400 hover:text-white hover:bg-gray-800 transition-colors border border-gray-800"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-transform hover:scale-105 ${
                    type === 'error' ? 'bg-danger text-white' : 
                    type === 'warning' ? 'bg-warning text-primary' : 
                    'bg-accent text-primary'
                  }`}
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl font-black uppercase text-xs tracking-widest bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                Got it
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
