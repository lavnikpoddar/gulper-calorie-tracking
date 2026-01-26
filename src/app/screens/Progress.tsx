import React from 'react';
import { GulperCard } from '@/app/components/GulperCard';
import { calculateBMI, getBMICategory, getBMICategoryColor } from '@/app/utils/calculations';

interface ProgressProps {
  currentWeight: number;
  goalWeight: number;
  weightLogs: Array<{ date: Date; weight_kg: number }>;
  avgCalorieBalance: number;
  height_cm: number;
}

export function Progress({
  currentWeight,
  goalWeight,
  weightLogs,
  avgCalorieBalance,
  height_cm,
}: ProgressProps) {
  const bmi = calculateBMI(currentWeight, height_cm);
  const bmiCategory = getBMICategory(bmi);
  const bmiColor = getBMICategoryColor(bmi);

  // Calculate balance indicator position (-1 to +1)
  const balancePosition = Math.max(-1, Math.min(1, avgCalorieBalance / 500));

  return (
    <div 
      className="h-screen flex flex-col overflow-y-auto pb-32"
      style={{ backgroundColor: 'var(--gulper-bg)' }}
    >
      <div className="px-5 pt-12 pb-6">
        <h1 
          className="font-bold mb-6"
          style={{ 
            color: 'var(--gulper-text-primary)',
            fontSize: 'var(--text-h1)',
            lineHeight: 'var(--text-h1-lh)'
          }}
        >
          Progress
        </h1>

        {/* My Weight Card */}
        <GulperCard className="mb-4">
          <div 
            className="uppercase font-semibold mb-2"
            style={{ 
              color: 'var(--gulper-text-secondary)',
              fontSize: 'var(--text-caption)',
              letterSpacing: '0.5px'
            }}
          >
            My Weight
          </div>
          <div 
            className="font-extrabold mb-1"
            style={{ 
              color: 'var(--gulper-text-primary)',
              fontSize: '40px',
              lineHeight: '44px'
            }}
          >
            {currentWeight}
            <span 
              className="font-semibold ml-2"
              style={{ 
                color: 'var(--gulper-text-secondary)',
                fontSize: '20px'
              }}
            >
              kg
            </span>
          </div>
          <div 
            className="font-medium"
            style={{ 
              color: 'var(--gulper-text-secondary)',
              fontSize: 'var(--text-caption)'
            }}
          >
            Goal {goalWeight} kg
          </div>
        </GulperCard>

        {/* Weight Trend Chart Card */}
        <GulperCard className="mb-4" padding="large">
          <div 
            className="font-semibold mb-4"
            style={{ 
              color: 'var(--gulper-text-primary)',
              fontSize: 'var(--text-h2)',
              lineHeight: 'var(--text-h2-lh)'
            }}
          >
            Weight Trend
          </div>

          <div className="relative h-40">
            <svg className="w-full h-full" viewBox="0 0 300 140" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="35" x2="300" y2="35" stroke="#E6E9EF" strokeWidth="1" />
              <line x1="0" y1="70" x2="300" y2="70" stroke="#E6E9EF" strokeWidth="1" />
              <line x1="0" y1="105" x2="300" y2="105" stroke="#E6E9EF" strokeWidth="1" />

              {/* Trend area fill */}
              <defs>
                <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#2DBE60" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2DBE60" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Sample trend line */}
              <path
                d="M 0 55 Q 75 50, 150 45 T 300 35"
                fill="url(#trendGradient)"
                stroke="none"
              />
              <path
                d="M 0 55 Q 75 50, 150 45 T 300 35"
                fill="none"
                stroke="#2DBE60"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Current weight marker */}
              <circle cx="150" cy="45" r="4" fill="#2DBE60" />
            </svg>

            {/* Labels */}
            <div 
              className="absolute top-10 left-2 px-2 py-1 rounded-md font-semibold"
              style={{ 
                backgroundColor: 'var(--gulper-green-tint)', 
                color: 'var(--gulper-green)',
                fontSize: '10px'
              }}
            >
              Start
            </div>
            <div 
              className="absolute top-6 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md font-bold"
              style={{ 
                backgroundColor: 'var(--gulper-green)', 
                color: 'white',
                fontSize: '11px'
              }}
            >
              {currentWeight} kg
            </div>
            <div 
              className="absolute bottom-6 right-2 px-2 py-1 rounded-md font-medium"
              style={{ 
                backgroundColor: 'var(--gulper-bg)', 
                color: 'var(--gulper-text-secondary)',
                fontSize: '10px'
              }}
            >
              Goal
            </div>
          </div>
        </GulperCard>

        {/* Calorie Balance Card */}
        <GulperCard className="mb-4" padding="large">
          <div 
            className="font-semibold mb-4"
            style={{ 
              color: 'var(--gulper-text-primary)',
              fontSize: 'var(--text-h2)',
              lineHeight: 'var(--text-h2-lh)'
            }}
          >
            Calorie Balance
          </div>
          
          <div className="relative mb-3">
            {/* Track */}
            <div 
              className="h-2 rounded-full"
              style={{ backgroundColor: 'var(--gulper-border)' }}
            />
            
            {/* Indicator */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: 'var(--gulper-green)',
                left: `calc(${((balancePosition + 1) / 2) * 100}% - 10px)`,
                boxShadow: '0 2px 6px rgba(45, 190, 96, 0.3)'
              }}
            />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span 
              className="uppercase font-semibold"
              style={{ 
                color: 'var(--gulper-text-secondary)',
                fontSize: '10px',
                letterSpacing: '0.5px'
              }}
            >
              EATING LESS
            </span>
            <span 
              className="uppercase font-semibold"
              style={{ 
                color: 'var(--gulper-text-secondary)',
                fontSize: '10px',
                letterSpacing: '0.5px'
              }}
            >
              EATING MORE
            </span>
          </div>

          <div 
            className="text-center font-medium"
            style={{ 
              color: 'var(--gulper-text-secondary)',
              fontSize: 'var(--text-caption)'
            }}
          >
            Based on last 7 days
          </div>
        </GulperCard>

        {/* BMI Card */}
        <GulperCard padding="large">
          <div 
            className="font-semibold mb-4"
            style={{ 
              color: 'var(--gulper-text-primary)',
              fontSize: 'var(--text-h2)',
              lineHeight: 'var(--text-h2-lh)'
            }}
          >
            Your BMI
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <div 
              className="font-extrabold"
              style={{ 
                color: 'var(--gulper-text-primary)',
                fontSize: '40px'
              }}
            >
              {bmi.toFixed(1)}
            </div>
            <div 
              className="px-3 py-1 rounded-[10px] font-bold uppercase"
              style={{ 
                backgroundColor: `${bmiColor}20`, 
                color: bmiColor,
                fontSize: '11px'
              }}
            >
              {bmiCategory}
            </div>
          </div>

          {/* BMI gradient bar */}
          <div className="relative h-2.5 rounded-full overflow-hidden mb-2">
            <div className="absolute inset-0 flex">
              <div className="flex-1" style={{ backgroundColor: '#60A5FA' }} />
              <div className="flex-1" style={{ backgroundColor: '#2DBE60' }} />
              <div className="flex-1" style={{ backgroundColor: '#FBBF24' }} />
              <div className="flex-1" style={{ backgroundColor: '#EF4444' }} />
            </div>
            
            {/* BMI marker */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-black rounded-full"
              style={{ 
                left: `${Math.min(100, Math.max(0, ((bmi - 15) / 25) * 100))}%`,
              }}
            />
          </div>

          {/* Legend */}
          <div className="flex justify-between mt-2">
            <span className="font-medium" style={{ color: '#60A5FA', fontSize: '10px' }}>Under</span>
            <span className="font-medium" style={{ color: '#2DBE60', fontSize: '10px' }}>Healthy</span>
            <span className="font-medium" style={{ color: '#FBBF24', fontSize: '10px' }}>Over</span>
            <span className="font-medium" style={{ color: '#EF4444', fontSize: '10px' }}>Obese</span>
          </div>
        </GulperCard>
      </div>
    </div>
  );
}
