import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-[#50C878] to-[#77DD77]',
      icon: '✓'
    },
    error: {
      bg: 'bg-gradient-to-r from-[#FF6B81] to-[#FF8FA3]',
      icon: '✕'
    },
    info: {
      bg: 'bg-gradient-to-r from-[#F78CA2] to-[#FFD6DF]',
      icon: 'ℹ'
    }
  };

  const style = styles[type] || styles.success;

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideInRight">
      <div className={`${style.bg} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[300px] backdrop-blur-sm`}>
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold">
          {style.icon}
        </div>
        <p className="flex-1 font-['Poppins',sans-serif] text-sm">{message}</p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
