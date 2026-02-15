// App Context - Global state management with Firestore
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
    StoredUserProfile,
    FoodEntry,
    WeightEntry,
    saveUserProfile,
    addMeal as addMealToFirestore,
    updateMeal as updateMealInFirestore,
    deleteMealDoc,
    saveWeightLog,
    setOnboardingComplete,
    isOnboardingComplete,
    loadUserProfile,
    loadMeals,
    loadWeightLogs,
    onProfileSnapshot,
    onMealsSnapshot,
    onWeightLogsSnapshot,
} from '../utils/storage';
import { formatDateISO } from '../utils/calculations';
import { useAuth } from './AuthContext';

// State interface
interface AppState {
    isLoading: boolean;
    onboardingComplete: boolean;
    userProfile: StoredUserProfile | null;
    meals: FoodEntry[];
    weightLogs: WeightEntry[];
    selectedDate: string; // YYYY-MM-DD
}

// Action types
type AppAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ONBOARDING_COMPLETE'; payload: boolean }
    | { type: 'SET_USER_PROFILE'; payload: StoredUserProfile | null }
    | { type: 'UPDATE_USER_PROFILE'; payload: Partial<StoredUserProfile> }
    | { type: 'SET_MEALS'; payload: FoodEntry[] }
    | { type: 'ADD_MEAL'; payload: FoodEntry }
    | { type: 'UPDATE_MEAL'; payload: FoodEntry }
    | { type: 'DELETE_MEAL'; payload: string }
    | { type: 'SET_WEIGHT_LOGS'; payload: WeightEntry[] }
    | { type: 'ADD_WEIGHT_LOG'; payload: WeightEntry }
    | { type: 'SET_SELECTED_DATE'; payload: string }
    | {
        type: 'LOAD_ALL_DATA'; payload: {
            userProfile: StoredUserProfile | null;
            meals: FoodEntry[];
            weightLogs: WeightEntry[];
            onboardingComplete: boolean;
        }
    }
    | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
    isLoading: true,
    onboardingComplete: false,
    userProfile: null,
    meals: [],
    weightLogs: [],
    selectedDate: new Date().toISOString().split('T')[0],
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ONBOARDING_COMPLETE':
            return { ...state, onboardingComplete: action.payload };
        case 'SET_USER_PROFILE':
            return { ...state, userProfile: action.payload };
        case 'UPDATE_USER_PROFILE':
            return {
                ...state,
                userProfile: state.userProfile
                    ? { ...state.userProfile, ...action.payload }
                    : null
            };
        case 'SET_MEALS':
            return { ...state, meals: action.payload };
        case 'ADD_MEAL':
            return { ...state, meals: [...state.meals, action.payload] };
        case 'UPDATE_MEAL':
            return {
                ...state,
                meals: state.meals.map(m => m.id === action.payload.id ? action.payload : m)
            };
        case 'DELETE_MEAL':
            return { ...state, meals: state.meals.filter(m => m.id !== action.payload) };
        case 'SET_WEIGHT_LOGS':
            return { ...state, weightLogs: action.payload };
        case 'ADD_WEIGHT_LOG':
            return { ...state, weightLogs: [...state.weightLogs, action.payload] };
        case 'SET_SELECTED_DATE':
            return { ...state, selectedDate: action.payload };
        case 'LOAD_ALL_DATA':
            return {
                ...state,
                isLoading: false,
                userProfile: action.payload.userProfile,
                meals: action.payload.meals,
                weightLogs: action.payload.weightLogs,
                onboardingComplete: action.payload.onboardingComplete,
            };
        case 'RESET_STATE':
            return { ...initialState, isLoading: false };
        default:
            return state;
    }
}

// Context
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    // Helper functions
    completeOnboarding: (profile: StoredUserProfile) => Promise<void>;
    addMeal: (name: string, calories: number) => Promise<void>;
    updateMeal: (meal: FoodEntry) => Promise<void>;
    deleteMeal: (id: string) => Promise<void>;
    logWeight: (weight: number) => Promise<void>;
    setSelectedDate: (date: string) => void;
    updateProfile: (updates: Partial<StoredUserProfile>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const { user } = useAuth();

    // Load data when user changes (login/logout)
    useEffect(() => {
        if (!user) {
            // User logged out — reset state
            dispatch({ type: 'RESET_STATE' });
            return;
        }

        const userId = user.uid;
        let cancelled = false;

        // Initial data load
        async function loadData() {
            const [userProfile, meals, weightLogs, onboardingDone] = await Promise.all([
                loadUserProfile(userId),
                loadMeals(userId),
                loadWeightLogs(userId),
                isOnboardingComplete(userId),
            ]);

            if (!cancelled) {
                dispatch({
                    type: 'LOAD_ALL_DATA',
                    payload: {
                        userProfile,
                        meals,
                        weightLogs,
                        onboardingComplete: onboardingDone,
                    },
                });
            }
        }
        loadData();

        // Set up real-time listeners for live sync
        const unsubProfile = onProfileSnapshot(userId, (profile) => {
            if (!cancelled) {
                dispatch({ type: 'SET_USER_PROFILE', payload: profile });
            }
        });

        const unsubMeals = onMealsSnapshot(userId, (meals) => {
            if (!cancelled) {
                dispatch({ type: 'SET_MEALS', payload: meals });
            }
        });

        const unsubWeightLogs = onWeightLogsSnapshot(userId, (logs) => {
            if (!cancelled) {
                dispatch({ type: 'SET_WEIGHT_LOGS', payload: logs });
            }
        });

        // Cleanup: unsubscribe listeners when user changes
        return () => {
            cancelled = true;
            unsubProfile();
            unsubMeals();
            unsubWeightLogs();
        };
    }, [user]);

    // Helper functions
    const getUid = () => {
        if (!user) throw new Error('User not authenticated');
        return user.uid;
    };

    const completeOnboarding = async (profile: StoredUserProfile) => {
        const uid = getUid();
        await saveUserProfile(uid, profile);
        await setOnboardingComplete(uid, true);
        dispatch({ type: 'SET_USER_PROFILE', payload: profile });
        dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: true });
    };

    const addMeal = async (name: string, calories: number) => {
        const uid = getUid();
        const now = new Date();
        const newMeal: FoodEntry = {
            id: Date.now().toString(),
            foodName: name,
            calories,
            mealType: 'snack',
            time: now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
            date: state.selectedDate,
        };
        await addMealToFirestore(uid, newMeal);
    };

    const updateMeal = async (meal: FoodEntry) => {
        const uid = getUid();
        await updateMealInFirestore(uid, meal);
    };

    const deleteMeal = async (id: string) => {
        const uid = getUid();
        await deleteMealDoc(uid, id);
    };

    const logWeight = async (weight: number) => {
        const uid = getUid();
        const today = formatDateISO(new Date());
        const newLog: WeightEntry = { date: today, weight };

        await saveWeightLog(uid, newLog);

        // Also update user profile weight
        if (state.userProfile) {
            const updatedProfile = { ...state.userProfile, currentWeight: weight };
            await saveUserProfile(uid, updatedProfile);
        }
    };

    const setSelectedDate = (date: string) => {
        dispatch({ type: 'SET_SELECTED_DATE', payload: date });
    };

    const updateProfile = async (updates: Partial<StoredUserProfile>) => {
        const uid = getUid();
        if (state.userProfile) {
            const updatedProfile = { ...state.userProfile, ...updates };
            await saveUserProfile(uid, updatedProfile);
        }
    };

    return (
        <AppContext.Provider value={{
            state,
            dispatch,
            completeOnboarding,
            addMeal,
            updateMeal,
            deleteMeal,
            logWeight,
            setSelectedDate,
            updateProfile,
        }}>
            {children}
        </AppContext.Provider>
    );
}

// Hook
export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
