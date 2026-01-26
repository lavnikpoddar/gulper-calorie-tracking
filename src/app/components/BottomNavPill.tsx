import React from 'react';
import { Home, TrendingUp, Plus } from 'lucide-react';

interface BottomNavPillProps {
  activeTab: 'home' | 'progress';
  onTabChange: (tab: 'home' | 'progress') => void;
  onAddClick: () => void;
}

export function BottomNavPill({ activeTab, onTabChange, onAddClick }: BottomNavPillProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center">
      <div 
        className="w-full max-w-md mx-auto px-5 pb-5"
        style={{ backgroundColor: 'var(--gulper-bg)' }}
      >
        <div className="flex items-center gap-2">
          {/* Navigation Pill */}
          <div 
            className="flex items-center justify-around rounded-[20px] border flex-1"
            style={{ 
              backgroundColor: 'var(--gulper-black-cta)',
              borderColor: 'rgba(255,255,255,0.1)',
              height: '64px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
            }}
          >
            <button
              onClick={() => onTabChange('home')}
              className="flex flex-col items-center justify-center px-6 py-2 transition-all"
            >
              <Home 
                size={22} 
                className={activeTab === 'home' ? 'text-white' : 'text-white/40'}
                fill={activeTab === 'home' ? 'white' : 'none'}
              />
              <span 
                className={`mt-1 ${
                  activeTab === 'home' ? 'text-white' : 'text-white/40'
                }`}
                style={{ fontSize: '11px', fontWeight: 600 }}
              >
                Home
              </span>
            </button>
            
            <button
              onClick={() => onTabChange('progress')}
              className="flex flex-col items-center justify-center px-6 py-2 transition-all"
            >
              <TrendingUp 
                size={22} 
                className={activeTab === 'progress' ? 'text-white' : 'text-white/40'}
              />
              <span 
                className={`mt-1 ${
                  activeTab === 'progress' ? 'text-white' : 'text-white/40'
                }`}
                style={{ fontSize: '11px', fontWeight: 600 }}
              >
                Progress
              </span>
            </button>
          </div>

          {/* Plus Button */}
          <button
            onClick={onAddClick}
            className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{ 
              backgroundColor: 'var(--gulper-green)',
              boxShadow: '0 8px 24px rgba(45, 190, 96, 0.4)'
            }}
          >
            <Plus size={24} className="text-white" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}