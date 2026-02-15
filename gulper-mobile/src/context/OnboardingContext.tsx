// Onboarding State - Temporary state to collect all onboarding data
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface OnboardingData {
    displayName: string;
    gender: 'male' | 'female' | 'other' | null;
    activityLevel: 'sedentary' | 'light' | 'active' | null;
    height: number; // cm
    currentWeight: number; // kg
    units: 'metric' | 'imperial';
    dateOfBirth: Date | null;
    targetWeight: number; // kg
    progressRate: number; // kg per week
    motivations: string[];
}

const initialData: OnboardingData = {
    displayName: '',
    gender: null,
    activityLevel: null,
    height: 170,
    currentWeight: 70,
    units: 'metric',
    dateOfBirth: null,
    targetWeight: 65,
    progressRate: 0.5,
    motivations: [],
};

interface OnboardingContextType {
    data: OnboardingData;
    updateData: (updates: Partial<OnboardingData>) => void;
    resetData: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<OnboardingData>(initialData);

    const updateData = (updates: Partial<OnboardingData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const resetData = () => {
        setData(initialData);
    };

    return (
        <OnboardingContext.Provider value={{ data, updateData, resetData }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}
