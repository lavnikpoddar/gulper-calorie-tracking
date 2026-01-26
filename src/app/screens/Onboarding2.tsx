import React, { useState } from 'react';
import { ScalePickerRow } from '@/app/components/ScalePickerRow';
import { PrimaryCTA } from '@/app/components/PrimaryCTA';
import { GulperCard } from '@/app/components/GulperCard';
import { GulperSlider } from '@/app/components/GulperSlider';
import { SegmentedControl } from '@/app/components/SegmentedControl';
import { Calendar } from 'lucide-react';
import { calculateGoalDate, getGoalType, formatDateLong } from '@/app/utils/calculations';

interface Onboarding2Props {
  currentWeight: number;
  units: 'Metric' | 'Imperial';
  onContinue: (data: {
    goal_weight_kg: number;
    pace_kg_per_week: number;
  }) => void;
}

export function Onboarding2({ currentWeight, units: initialUnits, onContinue }: Onboarding2Props) {
  const [units, setUnits] = useState<'Metric' | 'Imperial'>(initialUnits);
  const [goalWeight, setGoalWeight] = useState(Math.max(40, currentWeight - 3));
  const [pace, setPace] = useState(0.5);
  
  const goalType = getGoalType(currentWeight, goalWeight);
  const goalDate = calculateGoalDate(currentWeight, goalWeight, pace);

  const handleContinue = () => {
    onContinue({
      goal_weight_kg: goalWeight,
      pace_kg_per_week: pace,
    });
  };

  return (
    <div 
      className="h-screen flex flex-col"
      style={{ backgroundColor: 'var(--gulper-bg)' }}
    >
      <div className="flex-1 overflow-y-auto px-5 pt-12 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 
            className="font-bold"
            style={{ 
              color: 'var(--gulper-text-primary)',
              fontSize: 'var(--text-h1)',
              lineHeight: 'var(--text-h1-lh)'
            }}
          >
            Your Target
          </h1>
          <SegmentedControl
            options={['Metric', 'Imperial']}
            value={units}
            onChange={(val) => setUnits(val as 'Metric' | 'Imperial')}
          />
        </div>

        <ScalePickerRow
          label="DESIRED WEIGHT"
          value={goalWeight}
          onChange={setGoalWeight}
          min={40}
          max={150}
          step={1}
          unit={units === 'Metric' ? 'kg' : 'lb'}
        />

        <GulperCard padding="large" className="mt-4">
          <div className="flex items-center justify-between mb-3">
            <div 
              className="uppercase font-semibold"
              style={{ 
                color: 'var(--gulper-text-secondary)',
                fontSize: 'var(--text-caption)',
                letterSpacing: '0.5px'
              }}
            >
              TARGET PACE
            </div>
            <div 
              className="font-bold"
              style={{ 
                color: 'var(--gulper-green)',
                fontSize: '18px'
              }}
            >
              {pace.toFixed(2)} kg/wk
            </div>
          </div>

          <div className="mb-5">
            <GulperSlider
              value={[pace]}
              onValueChange={(vals) => setPace(vals[0])}
              min={0.1}
              max={1.0}
              step={0.05}
            />
            <div className="flex justify-between mt-2">
              <span style={{ fontSize: '24px' }}>🐢</span>
              <span style={{ fontSize: '24px' }}>🐰</span>
            </div>
          </div>

          <div 
            className="flex items-center gap-3 pt-4 border-t"
            style={{ borderColor: 'var(--gulper-border)' }}
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--gulper-green-tint)' }}
            >
              <Calendar size={18} style={{ color: 'var(--gulper-green)' }} />
            </div>
            <div className="flex-1">
              <div 
                className="uppercase font-semibold mb-0.5"
                style={{ 
                  color: 'var(--gulper-text-secondary)',
                  fontSize: '10px',
                  letterSpacing: '0.5px'
                }}
              >
                GOAL REACHED BY
              </div>
              <div 
                className="font-bold"
                style={{ 
                  color: 'var(--gulper-text-primary)',
                  fontSize: 'var(--text-body)'
                }}
              >
                {formatDateLong(goalDate)}
              </div>
            </div>
          </div>
        </GulperCard>
      </div>

      <div 
        className="fixed bottom-0 left-0 right-0 px-5 pb-5"
        style={{ backgroundColor: 'var(--gulper-bg)' }}
      >
        <PrimaryCTA onClick={handleContinue}>
          Continue
        </PrimaryCTA>
      </div>
    </div>
  );
}