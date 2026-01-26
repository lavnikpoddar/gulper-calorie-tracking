import React from 'react';

interface CalorieRingProps {
  consumed: number;
  target: number;
  goalType?: 'lose' | 'gain' | 'maintain';
}

export function CalorieRing({ consumed, target, goalType = 'lose' }: CalorieRingProps) {
  const progress = Math.min((consumed / target) * 100, 100);
  const overProgress = consumed > target ? ((consumed - target) / target) * 100 : 0;
  
  const radius = 75;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const overStrokeDashoffset = circumference - (overProgress / 100) * circumference;
  
  const remaining = Math.max(target - consumed, 0);
  const isOver = consumed > target;
  
  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
        {/* Background circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#E6E9EF"
          strokeWidth="10"
        />
        
        {/* Progress circle */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={isOver ? '#FF6B6B' : '#2DBE60'}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
        
        {/* Over-consumption circle (second lap) */}
        {isOver && (
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#FF6B6B"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={overStrokeDashoffset}
            strokeLinecap="round"
            opacity="0.3"
            className="transition-all duration-500"
          />
        )}
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div 
          className="font-extrabold"
          style={{ 
            color: 'var(--gulper-text-primary)',
            fontSize: '44px',
            lineHeight: '48px'
          }}
        >
          {isOver ? consumed - target : remaining}
        </div>
        <div 
          className="font-semibold uppercase mt-1"
          style={{ 
            color: 'var(--gulper-text-secondary)',
            fontSize: 'var(--text-caption)',
            letterSpacing: '0.5px'
          }}
        >
          {isOver ? 'KCAL OVER' : goalType === 'gain' ? 'KCAL TO GO' : 'KCAL LEFT'}
        </div>
      </div>
    </div>
  );
}
