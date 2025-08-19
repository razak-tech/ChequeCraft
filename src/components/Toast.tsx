import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
  headings?: {
    success: string;
    error: string;
  };
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000, headings }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);
    
    // Auto-close timer
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  const getToastStyles = () => {
    if (type === 'success') {
      return 'bg-gradient-to-r from-emerald-500 to-green-600 border-emerald-400';
    }
    return 'bg-gradient-to-r from-red-500 to-rose-600 border-red-400';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        className={`
          ${getToastStyles()}
          text-white px-6 py-4 rounded-2xl shadow-large border backdrop-blur-sm
          flex items-center gap-3 min-w-[300px] max-w-[400px]
          transform transition-all duration-300 ease-out
          ${isVisible && !isLeaving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        `}
      >
        <div className="flex-shrink-0">
          <span className="neo-mini-icon">
            {type === 'success' ? (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="font-semibold text-sm">
            {type === 'success' ? (headings?.success ?? 'Success!') : (headings?.error ?? 'Error!')}
          </div>
          <div className="text-white/90 text-sm leading-relaxed">{message}</div>
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 group"
        >
          <span className="neo-mini-icon-sm">
            <svg className="group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-2xl overflow-hidden">
          <div 
            className="h-full bg-white/60 rounded-b-2xl transition-all duration-100 ease-linear"
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`
            }}
          />
        </div>
      </div>
      
    </div>
  );
};

export default Toast;