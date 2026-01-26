import React from 'react';

interface CalendarDayRingProps {
  day: string;
  date: number;
  isSelected: boolean;
  isToday?: boolean;
  onClick: () => void;
  progress?: number;
}

export function CalendarDayRing({ 
  day, 
  date, 
  isSelected,
  isToday = false,
  onClick,
  progress = 0 
}: CalendarDayRingProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 min-w-[48px] flex-shrink-0"
    >
      <div 
        className="uppercase font-semibold"
        style={{ 
          color: isSelected ? 'var(--gulper-green)' : 'var(--gulper-text-secondary)',
          fontSize: '11px',
          letterSpacing: '0.3px'
        }}
      >
        {day}
      </div>
      
      <div className="relative w-12 h-12">
        {/* Inner circle fill for selected/today */}
        {(isSelected || isToday) && (
          <div 
            className="absolute rounded-full"
            style={{
              top: '6px',
              left: '6px',
              right: '6px',
              bottom: '6px',
              backgroundColor: isToday ? '#111111' : 'var(--gulper-green)'
            }}
          />
        )}
        
        {/* Progress ring - thicker stroke like Apple Fitness */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
          {/* Background ring */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={(isSelected || isToday) ? 'rgba(255,255,255,0.3)' : 'var(--gulper-border)'}
            strokeWidth="3.5"
          />
          
          {/* Progress ring - only show if there's progress */}
          {progress > 0 && (
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke={(isSelected || isToday) ? 'white' : 'var(--gulper-green)'}
              strokeWidth="3.5"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress / 100)}`}
              strokeLinecap="round"
            />
          )}
        </svg>
        
        {/* Date number */}
        <div 
          className="absolute inset-0 flex items-center justify-center font-semibold z-10"
          style={{ 
            color: (isSelected || isToday) ? 'white' : 'var(--gulper-text-primary)',
            fontSize: '16px'
          }}
        >
          {date}
        </div>
      </div>
    </button>
  );
}