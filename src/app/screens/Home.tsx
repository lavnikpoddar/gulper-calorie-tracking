import React from 'react';
import { Calendar } from 'lucide-react';
import { CalendarDayRing } from '@/app/components/CalendarDayRing';
import { CalorieRing } from '@/app/components/CalorieRing';
import { GulperCard } from '@/app/components/GulperCard';
import { SecondaryPill } from '@/app/components/SecondaryPill';
import { MealRow } from '@/app/components/MealRow';
import { JourneyBar } from '@/app/components/JourneyBar';

interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
}

interface HomeProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  consumedCalories: number;
  targetCalories: number;
  goalType: 'lose' | 'gain' | 'maintain';
  startDate: Date;
  goalDateObj: Date;
  meals: Meal[];
  onAddMeal: () => void;
  onEditMeal?: (id: string) => void;
  onDeleteMeal?: (id: string) => void;
  onCalendarClick: () => void;
}

export function Home({
  selectedDate,
  onDateChange,
  consumedCalories,
  targetCalories,
  goalType,
  startDate,
  goalDateObj,
  meals,
  onAddMeal,
  onEditMeal,
  onDeleteMeal,
  onCalendarClick,
}: HomeProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Generate many days for infinite scrolling (60 days back, 30 forward)
  const generateDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = -60; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    
    return days;
  };

  const allDays = generateDays();
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayDate = new Date();

  // Scroll to selected date on mount
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedIndex = allDays.findIndex(
        d => d.toDateString() === selectedDate.toDateString()
      );
      if (selectedIndex !== -1) {
        const scrollPosition = selectedIndex * 52; // 48px width + 4px gap
        scrollContainerRef.current.scrollLeft = scrollPosition - (window.innerWidth / 2) + 24;
      }
    }
  }, []);

  return (
    <div 
      className="h-screen flex flex-col overflow-y-auto pb-32"
      style={{ backgroundColor: 'var(--gulper-bg)' }}
    >
      {/* Week Calendar Strip */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-3">
          <h2 
            className="font-semibold flex-1"
            style={{ 
              color: 'var(--gulper-text-primary)',
              fontSize: 'var(--text-h2)',
              lineHeight: 'var(--text-h2-lh)'
            }}
          >
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          <button
            onClick={onCalendarClick}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ backgroundColor: 'var(--gulper-surface)' }}
          >
            <Calendar size={18} style={{ color: 'var(--gulper-text-primary)' }} />
          </button>
        </div>
        
        <div 
          ref={scrollContainerRef}
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide"
          style={{ 
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {allDays.map((date, idx) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === todayDate.toDateString();
            const dayProgress = isSelected ? (consumedCalories / targetCalories) * 100 : 0;
            
            return (
              <CalendarDayRing
                key={idx}
                day={dayNames[date.getDay()]}
                date={date.getDate()}
                isSelected={isSelected}
                isToday={isToday}
                onClick={() => onDateChange(date)}
                progress={dayProgress}
              />
            );
          })}
        </div>
      </div>

      {/* Main Calorie Ring Card */}
      <div className="px-5 mb-4">
        <GulperCard padding="large">
          <CalorieRing
            consumed={consumedCalories}
            target={targetCalories}
            goalType={goalType}
          />

          {/* Journey Bar */}
          <JourneyBar
            startDate={startDate}
            goalDate={goalDateObj}
          />
        </GulperCard>
      </div>

      {/* Meals Section */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 
            className="font-semibold"
            style={{ 
              color: 'var(--gulper-text-primary)',
              fontSize: 'var(--text-h2)',
              lineHeight: 'var(--text-h2-lh)'
            }}
          >
            Meals
          </h2>
          <button 
            onClick={onAddMeal}
            className="font-semibold"
            style={{ 
              color: 'var(--gulper-green)',
              fontSize: '14px'
            }}
          >
            + Add Meal
          </button>
        </div>

        {meals.length === 0 ? (
          <GulperCard>
            <div 
              className="text-center py-8 font-medium"
              style={{ 
                color: 'var(--gulper-text-secondary)',
                fontSize: 'var(--text-body)'
              }}
            >
              No meals logged today
            </div>
          </GulperCard>
        ) : (
          <GulperCard>
            {meals.map((meal) => (
              <MealRow
                key={meal.id}
                name={meal.name}
                calories={meal.calories}
                time={meal.time}
                onEdit={onEditMeal ? () => onEditMeal(meal.id) : undefined}
                onDelete={onDeleteMeal ? () => onDeleteMeal(meal.id) : undefined}
              />
            ))}
          </GulperCard>
        )}
      </div>
    </div>
  );
}