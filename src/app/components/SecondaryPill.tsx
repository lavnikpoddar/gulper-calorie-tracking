import React from 'react';

interface SecondaryPillProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function SecondaryPill({ children, onClick, className = '' }: SecondaryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 rounded-[12px] flex items-center justify-center transition-all active:scale-[0.95] ${className}`}
      style={{ 
        backgroundColor: 'var(--gulper-green-tint)', 
        color: 'var(--gulper-green)',
        height: 'var(--btn-secondary-height)'
      }}
    >
      <span className="font-semibold" style={{ fontSize: '14px' }}>{children}</span>
    </button>
  );
}
