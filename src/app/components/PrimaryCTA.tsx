import React from 'react';

interface PrimaryCTAProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function PrimaryCTA({ children, onClick, disabled = false, className = '' }: PrimaryCTAProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-[14px] text-white flex items-center justify-center transition-all active:scale-[0.98] ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      style={{ 
        backgroundColor: disabled ? 'var(--gulper-disabled)' : 'var(--gulper-black-cta)',
        height: 'var(--btn-primary-height)'
      }}
    >
      <span className="font-semibold" style={{ fontSize: '16px' }}>{children}</span>
    </button>
  );
}
