import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingFABProps {
  onClick: () => void;
}

export function FloatingFAB({ onClick }: FloatingFABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-90 z-50"
      style={{ 
        backgroundColor: 'var(--gulper-green)',
        boxShadow: '0 8px 24px rgba(45, 190, 96, 0.4)'
      }}
    >
      <Plus size={24} className="text-white" strokeWidth={2.5} />
    </button>
  );
}
