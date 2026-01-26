import React, { useRef, useEffect } from 'react';

interface ScalePickerRowProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export function ScalePickerRow({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  unit = ''
}: ScalePickerRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const values = [];
  for (let i = min; i <= max; i += step) {
    values.push(i);
  }

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const itemWidth = 50;
    const index = Math.round(scrollLeft / itemWidth);
    const newValue = values[index];
    if (newValue !== undefined && newValue !== value) {
      onChange(newValue);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const index = values.indexOf(value);
      if (index !== -1) {
        scrollRef.current.scrollLeft = index * 50;
      }
    }
  }, []);

  return (
    <div className="mb-3">
      <div 
        className="uppercase text-center mb-2"
        style={{ 
          color: 'var(--gulper-text-secondary)',
          fontSize: 'var(--text-caption)',
          fontWeight: 600,
          letterSpacing: '0.5px'
        }}
      >
        {label}
      </div>
      <div 
        className="relative rounded-[16px] overflow-hidden border"
        style={{ 
          backgroundColor: 'var(--gulper-surface)',
          borderColor: 'var(--gulper-border)',
          height: '72px'
        }}
      >
        {/* Green indicator line */}
        <div 
          className="absolute top-0 bottom-0 left-1/2 w-0.5 pointer-events-none z-10"
          style={{ 
            backgroundColor: 'var(--gulper-green)',
            opacity: 0.6
          }}
        />
        
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory h-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Left padding */}
          <div className="min-w-[calc(50%-25px)]" />
          
          {values.map((val, idx) => (
            <div
              key={idx}
              className="min-w-[50px] flex flex-col items-center justify-center snap-center"
            >
              <div 
                className={`transition-all ${
                  Math.abs(val - value) === 0 ? 'font-bold scale-105' : 'font-normal opacity-30'
                }`}
                style={{ 
                  color: Math.abs(val - value) === 0 ? 'var(--gulper-text-primary)' : 'var(--gulper-text-secondary)',
                  fontSize: '20px'
                }}
              >
                {val}
              </div>
              {Math.abs(val - value) === 0 && (
                <div 
                  className="font-medium mt-0.5"
                  style={{ 
                    color: 'var(--gulper-text-secondary)',
                    fontSize: 'var(--text-caption)'
                  }}
                >
                  {unit}
                </div>
              )}
            </div>
          ))}
          
          {/* Right padding */}
          <div className="min-w-[calc(50%-25px)]" />
        </div>
      </div>
    </div>
  );
}