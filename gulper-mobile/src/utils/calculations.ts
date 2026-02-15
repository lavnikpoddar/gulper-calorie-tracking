// Gulper Calculation Logic
// Ported from web version - pure TypeScript functions

export interface CalorieProfile {
    gender: 'male' | 'female' | 'other';
    activityLevel: 'sedentary' | 'light' | 'active';
    height: number; // cm
    currentWeight: number; // kg
    dateOfBirth: Date;
    targetWeight: number; // kg
    progressRate: number; // kg per week
}

// Calculate age from birth date
export function calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
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

// Activity multipliers for TDEE calculation
export function getActivityMultiplier(activityLevel: 'sedentary' | 'light' | 'active'): number {
    switch (activityLevel) {
        case 'sedentary': return 1.2;  // 0-2 workouts
        case 'light': return 1.375;    // 3-5 workouts
        case 'active': return 1.55;    // 6+ workouts
        default: return 1.2;
    }
}

// BMR Calculation (Mifflin-St Jeor)
export function calculateBMR(profile: CalorieProfile): number {
    const { currentWeight, height, gender, dateOfBirth } = profile;
    const age = calculateAge(dateOfBirth);
    // For 'other' gender, use average of male and female formulas
    if (gender === 'other') {
        const maleBMR = 10 * currentWeight + 6.25 * height - 5 * age + 5;
        const femaleBMR = 10 * currentWeight + 6.25 * height - 5 * age - 161;
        return (maleBMR + femaleBMR) / 2;
    }
    const S = gender === 'male' ? 5 : -161;
    return 10 * currentWeight + 6.25 * height - 5 * age + S;
}

// Daily Calorie Target
export function calculateDailyCalorieTarget(profile: CalorieProfile): number {
    const bmr = calculateBMR(profile);
    const activityMultiplier = getActivityMultiplier(profile.activityLevel);
    const tdee = bmr * activityMultiplier;

    const goalType = getGoalType(profile.currentWeight, profile.targetWeight);
    const daily_delta = (profile.progressRate * 7700) / 7;

    let target = tdee;
    if (goalType === 'lose') {
        target = tdee - daily_delta;
    } else if (goalType === 'gain') {
        target = tdee + daily_delta;
    }

    // Safety guardrails
    const minCalories = profile.gender === 'male' ? 1500 : 1200;
    const maxCalories = 4000;
    return Math.min(Math.max(Math.round(target), minCalories), maxCalories);
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

// Calculate weeks to goal
export function calculateWeeksToGoal(
    current_kg: number,
    goal_kg: number,
    pace_kg_per_week: number
): number {
    const total_kg_change = Math.abs(goal_kg - current_kg);
    return Math.ceil(total_kg_change / pace_kg_per_week);
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
    return Math.max(0.1, Math.min(1.0, total_kg_change / weeks_needed));
}

// Unit conversions
export function kgToLbs(kg: number): number {
    return kg * 2.20462;
}

export function lbsToKg(lbs: number): number {
    return lbs / 2.20462;
}

export function cmToInches(cm: number): number {
    return cm / 2.54;
}

export function inchesToCm(inches: number): number {
    return inches * 2.54;
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

export function formatDateISO(date: Date): string {
    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Get day difference
export function getDaysDifference(start: Date, end: Date): number {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
