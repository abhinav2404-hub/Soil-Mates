import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      id="toast"
      className="fixed bottom-16 left-4 right-4 z-50 mx-auto max-w-sm rounded-xl px-4 py-3 text-center text-xs font-bold shadow-xl transition-all animate-bounce"
      style={{
        backgroundColor: 'var(--soil)',
        color: '#EDD9B8',
        border: '1px solid rgba(237, 217, 184, 0.3)'
      }}
    >
      {message}
    </div>
  );
};
