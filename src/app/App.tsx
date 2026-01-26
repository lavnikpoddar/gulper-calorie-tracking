import React, { useState, useEffect } from 'react';
import { Splash } from '@/app/screens/Splash';
import { Onboarding1 } from '@/app/screens/Onboarding1';
import { Onboarding2 } from '@/app/screens/Onboarding2';
import { Onboarding3 } from '@/app/screens/Onboarding3';
import { Home } from '@/app/screens/Home';
import { Progress } from '@/app/screens/Progress';
import { BottomNavPill } from '@/app/components/BottomNavPill';
import { UnifiedAddModal } from '@/app/components/UnifiedAddModal';
import { CalendarView } from '@/app/components/CalendarView';
import { 
  calculateDailyCalorieTarget, 
  calculateGoalDate, 
  formatDate,
  getGoalType 
} from '@/app/utils/calculations';

type Screen = 'splash' | 'onboarding1' | 'onboarding2' | 'onboarding3' | 'home' | 'progress';

interface UserProfile {
  weight_kg: number;
  height_cm: number;
  age_years: number;
  sex: 'male' | 'female';
  goal_weight_kg: number;
  pace_kg_per_week: number;
}

interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
  date: string;
}

interface WeightLog {
  date: Date;
  weight_kg: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [activeTab, setActiveTab] = useState<'home' | 'progress'>('home');
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState(2000);
  const [units, setUnits] = useState<'Metric' | 'Imperial'>('Metric');

  // Data
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Breakfast Bowl',
      calories: 420,
      time: '8:30 AM',
      date: new Date().toDateString(),
    },
    {
      id: '2',
      name: 'Chicken Salad',
      calories: 380,
      time: '1:15 PM',
      date: new Date().toDateString(),
    },
  ]);

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);

  // Handle onboarding completion
  const handleOnboarding1Complete = (data: {
    units: 'Metric' | 'Imperial';
    sex: 'male' | 'female';
    age: number;
    height_cm: number;
    weight_kg: number;
  }) => {
    setUserProfile({
      weight_kg: data.weight_kg,
      height_cm: data.height_cm,
      age_years: data.age,
      sex: data.sex,
      goal_weight_kg: data.weight_kg - 3,
      pace_kg_per_week: 0.5,
    });
    setUnits(data.units);
    setCurrentScreen('onboarding2');
  };

  const handleOnboarding2Complete = (data: {
    goal_weight_kg: number;
    pace_kg_per_week: number;
  }) => {
    if (userProfile) {
      const updatedProfile = {
        ...userProfile,
        goal_weight_kg: data.goal_weight_kg,
        pace_kg_per_week: data.pace_kg_per_week,
      };
      setUserProfile(updatedProfile);
      
      const calorieTarget = calculateDailyCalorieTarget(updatedProfile);
      setDailyCalorieTarget(calorieTarget);
      
      setCurrentScreen('onboarding3');
    }
  };

  const handleOnboarding3Complete = () => {
    setCurrentScreen('home');
    setActiveTab('home');
  };

  // Add meal
  const handleAddMeal = (name: string, calories: number) => {
    const now = new Date();
    const newMeal: Meal = {
      id: Date.now().toString(),
      name,
      calories,
      time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      date: selectedDate.toDateString(),
    };
    setMeals([...meals, newMeal]);
  };

  // Log weight
  const handleLogWeight = (weight: number) => {
    if (userProfile) {
      const newLog: WeightLog = {
        date: new Date(),
        weight_kg: weight,
      };
      setWeightLogs([...weightLogs, newLog]);
      setUserProfile({ ...userProfile, weight_kg: weight });
    }
  };

  // Get meals for selected date
  const selectedDateMeals = meals.filter(
    (meal) => meal.date === selectedDate.toDateString()
  );

  // Calculate consumed calories for selected date
  const consumedCalories = selectedDateMeals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );

  // Calculate average calorie balance
  const avgCalorieBalance = 0; // Simplified for MVP

  if (currentScreen === 'splash') {
    return <Splash onComplete={() => setCurrentScreen('onboarding1')} />;
  }

  if (currentScreen === 'onboarding1') {
    return <Onboarding1 onContinue={handleOnboarding1Complete} />;
  }

  if (currentScreen === 'onboarding2' && userProfile) {
    return (
      <Onboarding2
        currentWeight={userProfile.weight_kg}
        units={units}
        onContinue={handleOnboarding2Complete}
      />
    );
  }

  if (currentScreen === 'onboarding3') {
    return (
      <Onboarding3
        calorieTarget={dailyCalorieTarget}
        onComplete={handleOnboarding3Complete}
      />
    );
  }

  if (!userProfile) {
    return null;
  }

  const goalType = getGoalType(userProfile.weight_kg, userProfile.goal_weight_kg);
  const goalDate = calculateGoalDate(
    userProfile.weight_kg,
    userProfile.goal_weight_kg,
    userProfile.pace_kg_per_week
  );

  // Calculate meals by date for calendar view
  const mealsByDate = new Map<string, number>();
  meals.forEach((meal) => {
    const current = mealsByDate.get(meal.date) || 0;
    mealsByDate.set(meal.date, current + meal.calories);
  });

  return (
    <div className="relative max-w-md mx-auto h-screen" style={{ backgroundColor: 'var(--gulper-bg)' }}>
      {/* Main Content */}
      {activeTab === 'home' && (
        <Home
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          consumedCalories={consumedCalories}
          targetCalories={dailyCalorieTarget}
          goalType={goalType}
          startDate={new Date()}
          goalDateObj={goalDate}
          meals={selectedDateMeals}
          onAddMeal={() => setShowAddModal(true)}
          onCalendarClick={() => setShowCalendar(true)}
        />
      )}

      {activeTab === 'progress' && (
        <Progress
          currentWeight={userProfile.weight_kg}
          goalWeight={userProfile.goal_weight_kg}
          weightLogs={weightLogs}
          avgCalorieBalance={avgCalorieBalance}
          height_cm={userProfile.height_cm}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavPill 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onAddClick={() => setShowAddModal(true)}
      />

      {/* Unified Add Modal */}
      <UnifiedAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSaveMeal={handleAddMeal}
        onSaveWeight={handleLogWeight}
        currentWeight={userProfile.weight_kg}
        unit="kg"
      />

      {/* Calendar View */}
      <CalendarView
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
        mealsByDate={mealsByDate}
        targetCalories={dailyCalorieTarget}
      />
    </div>
  );
}