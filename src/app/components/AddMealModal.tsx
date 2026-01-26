import React, { useState } from 'react';
import { PrimaryCTA } from './PrimaryCTA';
import { X } from 'lucide-react';

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, calories: number) => void;
}

export function AddMealModal({ isOpen, onClose, onSave }: AddMealModalProps) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (name && calories) {
      onSave(name, parseInt(calories));
      setName('');
      setCalories('');
      onClose();
    }
  };

  const handleClose = () => {
    setName('');
    setCalories('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-5"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className="w-full max-w-md rounded-[20px] p-5"
          style={{ backgroundColor: 'var(--gulper-surface)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 
              className="font-bold"
              style={{ 
                color: 'var(--gulper-text-primary)',
                fontSize: 'var(--text-h2)',
                lineHeight: 'var(--text-h2-lh)'
              }}
            >
              Add Meal
            </h3>
            <button 
              onClick={handleClose}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--gulper-bg)' }}
            >
              <X size={18} style={{ color: 'var(--gulper-text-secondary)' }} />
            </button>
          </div>

          {/* Food name input */}
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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

          {/* Calories input */}
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

          {/* Actions */}
          <div className="space-y-2">
            <PrimaryCTA onClick={handleSave} disabled={!name || !calories}>
              Save
            </PrimaryCTA>
            <button
              onClick={handleClose}
              className="w-full py-3 font-semibold"
              style={{ 
                color: 'var(--gulper-text-secondary)',
                fontSize: 'var(--text-body)'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
