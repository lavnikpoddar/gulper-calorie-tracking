import React from 'react';
import { PrimaryCTA } from '@/app/components/PrimaryCTA';
import { Check } from 'lucide-react';

interface Onboarding3Props {
  calorieTarget: number;
  onComplete: () => void;
}

export function Onboarding3({ calorieTarget, onComplete }: Onboarding3Props) {
  return (
    <div 
      className="h-screen flex flex-col items-center justify-center px-5"
      style={{ backgroundColor: 'var(--gulper-green)' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center max-w-md">
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-black"
        >
          <Check size={40} className="text-white" strokeWidth={2.5} />
        </div>

        <h1 
          className="font-extrabold mb-3 text-center text-white"
          style={{ 
            fontSize: '32px',
            lineHeight: '38px'
          }}
        >
          Plan Ready!
        </h1>

        <p 
          className="font-medium text-center mb-8 text-white opacity-90"
          style={{ 
            fontSize: 'var(--text-body)'
          }}
        >
          Your personalized daily budget:
        </p>

        <div className="text-center mb-12">
          <div 
            className="font-extrabold leading-none text-white"
            style={{ 
              fontSize: '52px'
            }}
          >
            {calorieTarget}
          </div>
          <div 
            className="font-semibold uppercase mt-1 text-white opacity-75"
            style={{ 
              fontSize: '18px',
              letterSpacing: '1px'
            }}
          >
            KCAL
          </div>
        </div>
      </div>

      <div className="w-full pb-5">
        <button
          onClick={onComplete}
          className="w-full rounded-[14px] text-white font-semibold flex items-center justify-center transition-all active:scale-[0.98] bg-black"
          style={{ 
            height: 'var(--btn-primary-height)',
            fontSize: '16px'
          }}
        >
          Start Tracking
        </button>
      </div>
    </div>
  );
}