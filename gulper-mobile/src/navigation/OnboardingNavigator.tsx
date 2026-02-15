// Onboarding Navigator - Stack navigator for 10 onboarding screens
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import onboarding screens
import { NameScreen } from '../screens/onboarding/NameScreen';
import { GenderScreen } from '../screens/onboarding/GenderScreen';
import { WorkoutScreen } from '../screens/onboarding/WorkoutScreen';
import { HeightWeightScreen } from '../screens/onboarding/HeightWeightScreen';
import { BirthDateScreen } from '../screens/onboarding/BirthDateScreen';
import { GoalWeightScreen } from '../screens/onboarding/GoalWeightScreen';
import { PaceScreen } from '../screens/onboarding/PaceScreen';
import { MotivationScreen } from '../screens/onboarding/MotivationScreen';
import { BuildingPlanScreen } from '../screens/onboarding/BuildingPlanScreen';
import { PlanReadyScreen } from '../screens/onboarding/PlanReadyScreen';

export type OnboardingStackParamList = {
    Name: undefined;
    Gender: undefined;
    Workout: undefined;
    HeightWeight: undefined;
    BirthDate: undefined;
    GoalWeight: undefined;
    Pace: undefined;
    Motivation: undefined;
    BuildingPlan: undefined;
    PlanReady: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#F7F8FA' },
                gestureEnabled: true,
            }}
        >
            <Stack.Screen name="Name" component={NameScreen} />
            <Stack.Screen name="Gender" component={GenderScreen} />
            <Stack.Screen name="Workout" component={WorkoutScreen} />
            <Stack.Screen name="HeightWeight" component={HeightWeightScreen} />
            <Stack.Screen name="BirthDate" component={BirthDateScreen} />
            <Stack.Screen name="GoalWeight" component={GoalWeightScreen} />
            <Stack.Screen name="Pace" component={PaceScreen} />
            <Stack.Screen name="Motivation" component={MotivationScreen} />
            <Stack.Screen name="BuildingPlan" component={BuildingPlanScreen} />
            <Stack.Screen name="PlanReady" component={PlanReadyScreen} />
        </Stack.Navigator>
    );
}
