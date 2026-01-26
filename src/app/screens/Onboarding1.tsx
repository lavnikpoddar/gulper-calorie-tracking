import React, { useState } from 'react';
import { SegmentedControl } from '@/app/components/SegmentedControl';
import { ScalePickerRow } from '@/app/components/ScalePickerRow';
import { PrimaryCTA } from '@/app/components/PrimaryCTA';
import { GulperCard } from '@/app/components/GulperCard';
import { calculateBMI, getBMICategory, getBMICategoryColor } from '@/app/utils/calculations';

interface Onboarding1Props {
  onContinue: (data: {
    units: 'Metric' | 'Imperial';
    sex: 'male' | 'female';
    age: number;
    height_cm: number;
    weight_kg: number;
  }) => void;
}

export function Onboarding1({ onContinue }: Onboarding1Props) {
  const [units, setUnits] = useState<'Metric' | 'Imperial'>('Metric');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState(25);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);

  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi);
  const bmiColor = getBMICategoryColor(bmi);

  const handleContinue = () => {
    onContinue({
      units,
      sex,
      age,
      height_cm: height,
      weight_kg: weight,
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
            About You
          </h1>
          <SegmentedControl
            options={['Metric', 'Imperial']}
            value={units}
            onChange={(val) => setUnits(val as 'Metric' | 'Imperial')}
          />
        </div>

        {/* Gender Selection */}
        <div className="mb-5">
          <div 
            className="flex gap-2 p-1 rounded-[14px] border"
            style={{ 
              backgroundColor: 'var(--gulper-surface)',
              borderColor: 'var(--gulper-border)'
            }}
          >
            <button
              onClick={() => setSex('male')}
              className={`flex-1 rounded-[12px] font-semibold transition-all ${
                sex === 'male' ? '' : ''
              }`}
              style={{
                backgroundColor: sex === 'male' ? 'var(--gulper-green-tint)' : 'transparent',
                color: sex === 'male' ? 'var(--gulper-green)' : 'var(--gulper-text-secondary)',
                height: '44px',
                fontSize: '14px'
              }}
            >
              Male
            </button>
            <button
              onClick={() => setSex('female')}
              className={`flex-1 rounded-[12px] font-semibold transition-all ${
                sex === 'female' ? '' : ''
              }`}
              style={{
                backgroundColor: sex === 'female' ? 'var(--gulper-green-tint)' : 'transparent',
                color: sex === 'female' ? 'var(--gulper-green)' : 'var(--gulper-text-secondary)',
                height: '44px',
                fontSize: '14px'
              }}
            >
              Female
            </button>
          </div>
        </div>

        <ScalePickerRow
          label="AGE"
          value={age}
          onChange={setAge}
          min={15}
          max={80}
          step={1}
          unit=""
        />

        <ScalePickerRow
          label="HEIGHT"
          value={height}
          onChange={setHeight}
          min={units === 'Metric' ? 140 : 55}
          max={units === 'Metric' ? 220 : 87}
          step={1}
          unit={units === 'Metric' ? 'cm' : 'in'}
        />

        <ScalePickerRow
          label="WEIGHT"
          value={weight}
          onChange={setWeight}
          min={units === 'Metric' ? 40 : 88}
          max={units === 'Metric' ? 200 : 440}
          step={1}
          unit={units === 'Metric' ? 'kg' : 'lb'}
        />

        {/* Live BMI Calculator */}
        <GulperCard className="mt-4" padding="large">
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