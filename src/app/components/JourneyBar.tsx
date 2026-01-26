import React from 'react';

interface JourneyBarProps {
  startDate: Date;
  goalDate: Date;
}

export function JourneyBar({ startDate, goalDate }: JourneyBarProps) {
  const now = new Date();
  const totalDays = Math.ceil((goalDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="mt-5 pt-5 border-t" style={{ borderColor: 'var(--gulper-border)' }}>
      <div 
        className="uppercase font-semibold mb-2 text-center"
        style={{ 
          color: 'var(--gulper-text-secondary)',
          fontSize: '10px',
          letterSpacing: '0.5px'
        }}
      >
        JOURNEY
      </div>
      
      {/* Progress bar */}
      <div className="relative h-2 rounded-full mb-2" style={{ backgroundColor: 'var(--gulper-border)' }}>
        <div 
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
          style={{ 
            backgroundColor: 'var(--gulper-green)',
            width: `${progress}%`
          }}
        />
      </div>

      {/* Date labels */}
      <div className="flex justify-between">
        <span 
          className="font-medium"
          style={{ 
            color: 'var(--gulper-text-secondary)',
            fontSize: 'var(--text-caption)'
          }}
        >
          {formatDate(startDate)}
        </span>
        <span 
          className="font-semibold"
          style={{ 
            color: 'var(--gulper-green)',
            fontSize: 'var(--text-caption)'
          }}
        >
          Day {elapsedDays} of {totalDays}
        </span>
        <span 
          className="font-medium"
          style={{ 
            color: 'var(--gulper-text-secondary)',
            fontSize: 'var(--text-caption)'
          }}
        >
          {formatDate(goalDate)}
        </span>
      </div>
    </div>
  );
}
