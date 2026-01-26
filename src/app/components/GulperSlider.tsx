import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

interface GulperSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function GulperSlider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
}: GulperSliderProps) {
  return (
    <SliderPrimitive.Root
      value={value}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      className={`relative flex w-full touch-none items-center select-none ${className}`}
    >
      <SliderPrimitive.Track
        className="relative grow overflow-hidden rounded-full h-2"
        style={{ backgroundColor: 'var(--gulper-border)' }}
      >
        <SliderPrimitive.Range
          className="absolute h-full"
          style={{ backgroundColor: 'var(--gulper-green)' }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className="block w-5 h-5 rounded-full border-none transition-all focus:outline-none focus:ring-0"
        style={{ 
          backgroundColor: 'var(--gulper-green)',
          boxShadow: '0 2px 6px rgba(45, 190, 96, 0.3)'
        }}
      />
    </SliderPrimitive.Root>
  );
}
