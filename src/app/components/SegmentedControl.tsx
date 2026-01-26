import React from 'react';

interface SegmentedControlProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({ options, value, onChange, className = '' }: SegmentedControlProps) {
  return (
    <div 
      className={`inline-flex rounded-[10px] p-0.5 gap-0.5 ${className}`}
      style={{ 
        backgroundColor: 'var(--gulper-border)',
        height: '36px'
      }}
    >
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`px-4 rounded-[8px] transition-all ${
            value === option 
              ? 'bg-white shadow-sm' 
              : 'bg-transparent'
          }`}
          style={{ 
            color: value === option ? 'var(--gulper-text-primary)' : 'var(--gulper-text-secondary)',
            fontSize: '13px',
            fontWeight: 600
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
