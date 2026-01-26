import React from 'react';
import { Utensils, Scale } from 'lucide-react';

interface AddBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: () => void;
  onLogWeight: () => void;
}

export function AddBottomSheet({ isOpen, onClose, onAddMeal, onLogWeight }: AddBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-[20px]"
        style={{ 
          backgroundColor: 'var(--gulper-surface)',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.1)'
        }}
      >
        <div className="px-5 pt-5 pb-6">
          {/* Handle */}
          <div className="flex justify-center mb-5">
            <div 
              className="w-10 h-1 rounded-full"
              style={{ backgroundColor: 'var(--gulper-border)' }}
            />
          </div>

          <h3 
            className="font-bold mb-4"
            style={{ 
              color: 'var(--gulper-text-primary)',
              fontSize: 'var(--text-h2)',
              lineHeight: 'var(--text-h2-lh)'
            }}
          >
            Add
          </h3>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onClose();
                onAddMeal();
              }}
              className="w-full flex items-center gap-3 p-4 rounded-[14px] transition-all active:scale-[0.98]"
              style={{ backgroundColor: 'var(--gulper-bg)' }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--gulper-green-tint)' }}
              >
                <Utensils size={20} style={{ color: 'var(--gulper-green)' }} />
              </div>
              <span 
                className="font-semibold"
                style={{ 
                  color: 'var(--gulper-text-primary)',
                  fontSize: 'var(--text-body)'
                }}
              >
                Add Meal
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onLogWeight();
              }}
              className="w-full flex items-center gap-3 p-4 rounded-[14px] transition-all active:scale-[0.98]"
              style={{ backgroundColor: 'var(--gulper-bg)' }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--gulper-green-tint)' }}
              >
                <Scale size={20} style={{ color: 'var(--gulper-green)' }} />
              </div>
              <span 
                className="font-semibold"
                style={{ 
                  color: 'var(--gulper-text-primary)',
                  fontSize: 'var(--text-body)'
                }}
              >
                Log Weight
              </span>
            </button>
          </div>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="w-full mt-3 py-3 font-semibold"
            style={{ 
              color: 'var(--gulper-text-secondary)',
              fontSize: 'var(--text-body)'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
