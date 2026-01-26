import React from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';

interface CalendarViewProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  mealsByDate: Map<string, number>; // date string -> total calories
  targetCalories: number;
}

export function CalendarView({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onDateSelect,
  mealsByDate,
  targetCalories 
}: CalendarViewProps) {
  if (!isOpen) return null;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Generate months to show (3 months back, current, 3 months forward)
  const getMonthsToShow = () => {
    const months = [];
    const today = new Date();
    
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      months.push(date);
    }
    
    return months;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days in month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    onClose();
  };

  const getProgressForDate = (date: Date): number => {
    const dateString = date.toDateString();
    const calories = mealsByDate.get(dateString) || 0;
    return Math.min(100, (calories / targetCalories) * 100);
  };

  const monthsToShow = getMonthsToShow();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: 'var(--gulper-bg)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--gulper-border)' }}>
        <h1 
          className="font-bold"
          style={{ 
            color: 'var(--gulper-text-primary)',
            fontSize: 'var(--text-h1)'
          }}
        >
          Calendar
        </h1>

        <button 
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ backgroundColor: 'var(--gulper-surface)' }}
        >
          <X size={18} style={{ color: 'var(--gulper-text-primary)' }} />
        </button>
      </div>

      {/* Scrollable Month List */}
      <div className="flex-1 overflow-y-auto">
        {monthsToShow.map((monthDate, monthIdx) => {
          const days = getDaysInMonth(monthDate);
          const monthLabel = monthNames[monthDate.getMonth()].slice(0, 3); // "Jan", "Feb", etc.

          return (
            <div key={`month-${monthIdx}`} className="px-5 py-6">
              {/* Month Label */}
              <h2 
                className="font-bold mb-4"
                style={{ 
                  color: 'var(--gulper-text-primary)',
                  fontSize: 'var(--text-h2)'
                }}
              >
                {monthLabel}
              </h2>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-2 mb-3">
                {dayNames.map((day, idx) => (
                  <div 
                    key={`day-header-${monthIdx}-${idx}`}
                    className="text-center font-semibold"
                    style={{ 
                      color: 'var(--gulper-text-secondary)',
                      fontSize: '11px'
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${monthIdx}-${idx}`} />;
                  }

                  const isSelected = day.toDateString() === selectedDate.toDateString();
                  const isToday = day.toDateString() === new Date().toDateString();
                  const progress = getProgressForDate(day);
                  const hasData = progress > 0;

                  return (
                    <button
                      key={`day-${monthIdx}-${idx}`}
                      onClick={() => handleDateClick(day)}
                      className="aspect-square rounded-[12px] flex flex-col items-center justify-center relative overflow-hidden transition-all active:scale-95"
                    >
                      {/* Inner circle fill for selected/today */}
                      {(isSelected || isToday) && (
                        <div 
                          className="absolute rounded-full"
                          style={{
                            top: '6px',
                            left: '6px',
                            right: '6px',
                            bottom: '6px',
                            backgroundColor: isToday ? '#111111' : 'var(--gulper-green)'
                          }}
                        />
                      )}
                      
                      {/* Progress ring - thicker like Apple Fitness */}
                      <svg 
                        className="absolute inset-0 w-full h-full" 
                        viewBox="0 0 60 60"
                      >
                        {/* Background ring */}
                        <circle
                          cx="30"
                          cy="30"
                          r="26"
                          fill="none"
                          stroke={(isToday || isSelected) ? 'rgba(255,255,255,0.3)' : 'var(--gulper-border)'}
                          strokeWidth="4"
                          transform="rotate(-90 30 30)"
                        />
                        
                        {/* Progress ring - only show if has data */}
                        {hasData && (
                          <circle
                            cx="30"
                            cy="30"
                            r="26"
                            fill="none"
                            stroke={(isToday || isSelected) ? 'white' : 'var(--gulper-green)'}
                            strokeWidth="4"
                            strokeDasharray={`${(progress / 100) * 163.36} 163.36`}
                            strokeLinecap="round"
                            transform="rotate(-90 30 30)"
                          />
                        )}
                      </svg>

                      <span 
                        className="font-semibold relative z-10"
                        style={{ 
                          color: (isToday || isSelected)
                            ? 'white'
                            : 'var(--gulper-text-primary)',
                          fontSize: '16px'
                        }}
                      >
                        {day.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}