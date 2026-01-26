import React from 'react';

interface GulperCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'default' | 'large';
}

export function GulperCard({ children, className = '', padding = 'default' }: GulperCardProps) {
  const paddingClass = padding === 'large' ? 'p-5' : 'p-4';
  
  return (
    <div 
      className={`bg-white rounded-[16px] border ${paddingClass} ${className}`}
      style={{ 
        backgroundColor: 'var(--gulper-surface)',
        borderColor: 'var(--gulper-border)'
      }}
    >
      {children}
    </div>
  );
}
