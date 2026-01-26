import React, { useState, useRef } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface MealRowProps {
  name: string;
  calories: number;
  time: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MealRow({ name, calories, time, onEdit, onDelete }: MealRowProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    currentX.current = e.touches[0].clientX;
    const diff = startX.current - currentX.current;
    // Only allow left swipe (positive diff)
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 140)); // Max swipe 140px
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    // Snap to open or closed
    if (swipeOffset > 70) {
      setSwipeOffset(140);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping) return;
    currentX.current = e.clientX;
    const diff = startX.current - currentX.current;
    if (diff > 0) {
      setSwipeOffset(Math.min(diff, 140));
    }
  };

  const handleMouseUp = () => {
    setIsSwiping(false);
    if (swipeOffset > 70) {
      setSwipeOffset(140);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleEdit = () => {
    setSwipeOffset(0);
    onEdit?.();
  };

  const handleDelete = () => {
    setSwipeOffset(0);
    onDelete?.();
  };

  // Close swipe when clicking elsewhere
  React.useEffect(() => {
    const handleClickOutside = () => {
      if (swipeOffset > 0) {
        setSwipeOffset(0);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [swipeOffset]);

  return (
    <div className="relative overflow-hidden border-b last:border-b-0" style={{ borderColor: 'var(--gulper-border)' }}>
      {/* Action buttons (behind) */}
      <div className="absolute right-0 top-0 bottom-0 flex">
        <button
          onClick={handleEdit}
          className="w-16 flex items-center justify-center"
          style={{ backgroundColor: 'var(--gulper-green)' }}
        >
          <Pencil size={18} className="text-white" />
        </button>
        <button
          onClick={handleDelete}
          className="w-16 flex items-center justify-center"
          style={{ backgroundColor: '#EF4444' }}
        >
          <Trash2 size={18} className="text-white" />
        </button>
      </div>

      {/* Swipeable content (foreground) */}
      <div 
        className="flex items-center justify-between py-3 transition-transform"
        style={{ 
          backgroundColor: 'var(--gulper-surface)',
          transform: `translateX(-${swipeOffset}px)`,
          touchAction: 'pan-y'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className="flex-1 pl-4">
          <div 
            className="font-semibold mb-0.5"
            style={{ 
              color: 'var(--gulper-text-primary)',
              fontSize: 'var(--text-body)'
            }}
          >
            {name}
          </div>
          <div 
            className="font-medium"
            style={{ 
              color: 'var(--gulper-text-secondary)',
              fontSize: 'var(--text-caption)'
            }}
          >
            {time}
          </div>
        </div>
        <div 
          className="font-bold pr-4"
          style={{ 
            color: 'var(--gulper-text-primary)',
            fontSize: '16px'
          }}
        >
          {calories}
          <span 
            className="font-semibold ml-1"
            style={{ 
              color: 'var(--gulper-text-secondary)',
              fontSize: 'var(--text-caption)'
            }}
          >
            kcal
          </span>
        </div>
      </div>
    </div>
  );
}