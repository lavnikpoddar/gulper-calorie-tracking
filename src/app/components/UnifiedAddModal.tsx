import React, { useState } from 'react';
import { PrimaryCTA } from './PrimaryCTA';
import { SegmentedControl } from './SegmentedControl';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UnifiedAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMeal: (name: string, calories: number) => void;
  onSaveWeight: (weight: number) => void;
  currentWeight?: number;
  unit?: 'kg' | 'lb';
}

export function UnifiedAddModal({ 
  isOpen, 
  onClose, 
  onSaveMeal,
  onSaveWeight,
  currentWeight = 70,
  unit = 'kg'
}: UnifiedAddModalProps) {
  const [mode, setMode] = useState<'Meal' | 'Weight'>('Meal');
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [weight, setWeight] = useState(currentWeight.toString());

  const handleSave = () => {
    if (mode === 'Meal' && mealName && calories) {
      onSaveMeal(mealName, parseInt(calories));
      setMealName('');
      setCalories('');
      onClose();
    } else if (mode === 'Weight' && weight) {
      onSaveWeight(parseFloat(weight));
      onClose();
    }
  };

  const handleClose = () => {
    setMealName('');
    setCalories('');
    setWeight(currentWeight.toString());
    setMode('Meal');
    onClose();
  };

  const isValid = mode === 'Meal' ? (mealName && calories) : weight;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Modal sliding from bottom */}
          <motion.div 
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[24px] p-5 max-w-md mx-auto"
            style={{ backgroundColor: 'var(--gulper-surface)' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <SegmentedControl
                options={['Meal', 'Weight']}
                value={mode}
                onChange={(val) => setMode(val as 'Meal' | 'Weight')}
              />
              <button 
                onClick={handleClose}
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--gulper-bg)' }}
              >
                <X size={18} style={{ color: 'var(--gulper-text-secondary)' }} />
              </button>
            </div>

            {/* Meal Form */}
            {mode === 'Meal' && (
              <>
                <div className="mb-3">
                  <label 
                    className="block uppercase font-semibold mb-2"
                    style={{ 
                      color: 'var(--gulper-text-secondary)',
                      fontSize: 'var(--text-caption)',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Food Name
                  </label>
                  <input
                    type="text"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    placeholder="e.g., Chicken Salad"
                    className="w-full px-4 rounded-[14px] font-medium border outline-none"
                    style={{ 
                      backgroundColor: 'var(--gulper-bg)',
                      borderColor: 'var(--gulper-border)',
                      color: 'var(--gulper-text-primary)',
                      height: 'var(--input-height)',
                      fontSize: 'var(--text-body)'
                    }}
                  />
                </div>

                <div className="mb-5">
                  <label 
                    className="block uppercase font-semibold mb-2"
                    style={{ 
                      color: 'var(--gulper-text-secondary)',
                      fontSize: 'var(--text-caption)',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Calories
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="e.g., 450"
                    className="w-full px-4 rounded-[14px] font-medium border outline-none"
                    style={{ 
                      backgroundColor: 'var(--gulper-bg)',
                      borderColor: 'var(--gulper-border)',
                      color: 'var(--gulper-text-primary)',
                      height: 'var(--input-height)',
                      fontSize: 'var(--text-body)'
                    }}
                  />
                </div>
              </>
            )}

            {/* Weight Form */}
            {mode === 'Weight' && (
              <div className="mb-5">
                <label 
                  className="block uppercase font-semibold mb-2"
                  style={{ 
                    color: 'var(--gulper-text-secondary)',
                    fontSize: 'var(--text-caption)',
                    letterSpacing: '0.5px'
                  }}
                >
                  Weight ({unit})
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={`e.g., ${currentWeight}`}
                  className="w-full px-4 rounded-[14px] font-medium border outline-none"
                  style={{ 
                    backgroundColor: 'var(--gulper-bg)',
                    borderColor: 'var(--gulper-border)',
                    color: 'var(--gulper-text-primary)',
                    height: 'var(--input-height)',
                    fontSize: 'var(--text-body)'
                  }}
                />
              </div>
            )}

            {/* Save Button */}
            <PrimaryCTA onClick={handleSave} disabled={!isValid}>
              Save
            </PrimaryCTA>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}