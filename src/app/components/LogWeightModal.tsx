import React, { useState } from 'react';
import { PrimaryCTA } from './PrimaryCTA';
import { X } from 'lucide-react';

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (weight: number) => void;
  currentWeight?: number;
  unit?: 'kg' | 'lb';
}

export function LogWeightModal({ 
  isOpen, 
  onClose, 
  onSave, 
  currentWeight = 70,
  unit = 'kg'
}: LogWeightModalProps) {
  const [weight, setWeight] = useState(currentWeight.toString());

  if (!isOpen) return null;

  const handleSave = () => {
    if (weight) {
      onSave(parseFloat(weight));
      onClose();
    }
  };

  const handleClose = () => {
    setWeight(currentWeight.toString());
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
              Log Weight
            </h3>
            <button 
              onClick={handleClose}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'var(--gulper-bg)' }}
            >
              <X size={18} style={{ color: 'var(--gulper-text-secondary)' }} />
            </button>
          </div>

          {/* Weight input */}
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

          {/* Actions */}
          <div className="space-y-2">
            <PrimaryCTA onClick={handleSave} disabled={!weight}>
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
