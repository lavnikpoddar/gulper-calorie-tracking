// Gulper Calculation Logic

export interface UserProfile {
  weight_kg: number;
  height_cm: number;
  age_years: number;
  sex: 'male' | 'female';
  goal_weight_kg: number;
  pace_kg_per_week: number;
}

// BMI Calculation
export function calculateBMI(weight_kg: number, height_cm: number): number {
  const height_m = height_cm / 100;
  return weight_kg / (height_m * height_m);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Healthy';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function getBMICategoryColor(bmi: number): string {
  if (bmi < 18.5) return '#60A5FA'; // blue
  if (bmi < 25) return '#5EC26A'; // green
  if (bmi < 30) return '#FBBF24'; // yellow
  return '#EF4444'; // red
}

// BMR Calculation (Mifflin-St Jeor)
export function calculateBMR(profile: UserProfile): number {
  const { weight_kg, height_cm, age_years, sex } = profile;
  const S = sex === 'male' ? 5 : -161;
  return 10 * weight_kg + 6.25 * height_cm - 5 * age_years + S;
}

// Daily Calorie Target
export function calculateDailyCalorieTarget(profile: UserProfile): number {
  const bmr = calculateBMR(profile);
  const tdee = bmr * 1.2; // Sedentary activity factor
  
  const goalType = getGoalType(profile.weight_kg, profile.goal_weight_kg);
  const daily_delta = (profile.pace_kg_per_week * 7700) / 7;
  
  let target = tdee;
  if (goalType === 'lose') {
    target = tdee - daily_delta;
  } else if (goalType === 'gain') {
    target = tdee + daily_delta;
  }
  
  // Safety guardrails
  const minCalories = profile.sex === 'male' ? 1500 : 1200;
  return Math.max(Math.round(target), minCalories);
}

// Goal Type
export function getGoalType(current_kg: number, goal_kg: number): 'lose' | 'gain' | 'maintain' {
  const diff = goal_kg - current_kg;
  if (Math.abs(diff) < 0.5) return 'maintain';
  return diff < 0 ? 'lose' : 'gain';
}

// Goal Date Calculation
export function calculateGoalDate(
  current_kg: number,
  goal_kg: number,
  pace_kg_per_week: number
): Date {
  const total_kg_change = Math.abs(goal_kg - current_kg);
  const weeks_needed = total_kg_change / pace_kg_per_week;
  const days_needed = Math.round(weeks_needed * 7);
  
  const goalDate = new Date();
  goalDate.setDate(goalDate.getDate() + days_needed);
  return goalDate;
}

// Calculate pace from target date
export function calculatePaceFromDate(
  current_kg: number,
  goal_kg: number,
  target_date: Date
): number {
  const today = new Date();
  const days_diff = Math.max(1, Math.floor((target_date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const weeks_needed = days_diff / 7;
  const total_kg_change = Math.abs(goal_kg - current_kg);
  return Math.max(0.1, total_kg_change / weeks_needed);
}

// Unit conversions
export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

// Format date
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDateLong(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
