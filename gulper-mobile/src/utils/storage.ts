// Firestore storage utilities for persisting app data
// All data is scoped under users/{uid}/ for per-user isolation
//
// Schema:
//   users/{uid}              — user document (profile map, stats map, onboardingComplete)
//   users/{uid}/foodEntries/{entryId}    — individual food/meal entries
//   users/{uid}/weightEntries/{date}     — weight logs (one per day)
//
import {
    doc, collection, setDoc, getDoc, getDocs, deleteDoc,
    query, orderBy, onSnapshot, Unsubscribe, writeBatch,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// ==================== Interfaces ====================

export interface UserProfile {
    displayName: string;
    email: string;
    photoUrl: string | null;
    gender: 'male' | 'female' | 'other';
    activityLevel: 'sedentary' | 'light' | 'active';
    height: number; // cm
    currentWeight: number; // kg
    units: 'metric' | 'imperial';
    dateOfBirth: string; // ISO string
    targetWeight: number; // kg
    progressRate: number; // kg per week
    motivations: string[];
    createdAt?: any; // Firestore timestamp
    updatedAt?: any; // Firestore timestamp
}

export interface UserStats {
    dailyCalorieGoal: number;
}

export interface FoodEntry {
    id: string;
    foodName: string;
    calories: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    time: string; // display time e.g. "2:30 PM"
    date: string; // YYYY-MM-DD
}

export interface WeightEntry {
    date: string; // YYYY-MM-DD
    weight: number; // kg
}

// Backward-compatible type aliases (to minimize changes in consumer files)
export type Meal = FoodEntry;
export type WeightLog = WeightEntry;
export type StoredUserProfile = UserProfile & { dailyCalorieTarget: number };

// ==================== Path Helpers ====================

function userDocRef(userId: string) {
    return doc(db, 'users', userId);
}

function foodEntriesCollectionRef(userId: string) {
    return collection(db, 'users', userId, 'foodEntries');
}

function foodEntryDocRef(userId: string, entryId: string) {
    return doc(db, 'users', userId, 'foodEntries', entryId);
}

function weightEntriesCollectionRef(userId: string) {
    return collection(db, 'users', userId, 'weightEntries');
}

function weightEntryDocRef(userId: string, date: string) {
    return doc(db, 'users', userId, 'weightEntries', date);
}

// ==================== User Profile & Stats ====================

export async function saveUserProfile(userId: string, profile: StoredUserProfile): Promise<void> {
    try {
        // Map StoredUserProfile to new schema
        const profileData: Record<string, any> = {
            displayName: profile.displayName || '',
            email: profile.email || '',
            photoUrl: profile.photoUrl || null,
            gender: profile.gender,
            activityLevel: profile.activityLevel,
            height: profile.height,
            currentWeight: profile.currentWeight,
            units: profile.units,
            dateOfBirth: profile.dateOfBirth,
            targetWeight: profile.targetWeight,
            progressRate: profile.progressRate,
            motivations: profile.motivations,
            updatedAt: serverTimestamp(),
        };

        const statsData: Record<string, any> = {
            dailyCalorieGoal: profile.dailyCalorieTarget,
        };

        await setDoc(userDocRef(userId), {
            profile: profileData,
            stats: statsData,
        }, { merge: true });
    } catch (error) {
        console.error('Error saving user profile:', error);
        throw error;
    }
}

export async function loadUserProfile(userId: string): Promise<StoredUserProfile | null> {
    try {
        const snap = await getDoc(userDocRef(userId));
        if (snap.exists()) {
            const data = snap.data();
            const profile = data.profile;
            const stats = data.stats;
            if (!profile) return null;

            return {
                displayName: profile.displayName || '',
                email: profile.email || '',
                photoUrl: profile.photoUrl || null,
                gender: profile.gender,
                activityLevel: profile.activityLevel,
                height: profile.height,
                currentWeight: profile.currentWeight,
                units: profile.units,
                dateOfBirth: profile.dateOfBirth,
                targetWeight: profile.targetWeight,
                progressRate: profile.progressRate,
                motivations: profile.motivations || [],
                dailyCalorieTarget: stats?.dailyCalorieGoal || 0,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
            } as StoredUserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error loading user profile:', error);
        return null;
    }
}

/**
 * Subscribe to real-time profile updates.
 */
export function onProfileSnapshot(
    userId: string,
    callback: (profile: StoredUserProfile | null) => void
): Unsubscribe {
    return onSnapshot(userDocRef(userId), (snap) => {
        if (snap.exists()) {
            const data = snap.data();
            const profile = data.profile;
            const stats = data.stats;
            if (!profile) {
                callback(null);
                return;
            }
            callback({
                displayName: profile.displayName || '',
                email: profile.email || '',
                photoUrl: profile.photoUrl || null,
                gender: profile.gender,
                activityLevel: profile.activityLevel,
                height: profile.height,
                currentWeight: profile.currentWeight,
                units: profile.units,
                dateOfBirth: profile.dateOfBirth,
                targetWeight: profile.targetWeight,
                progressRate: profile.progressRate,
                motivations: profile.motivations || [],
                dailyCalorieTarget: stats?.dailyCalorieGoal || 0,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
            } as StoredUserProfile);
        } else {
            callback(null);
        }
    }, (error) => {
        console.error('Profile snapshot error:', error);
    });
}

// ==================== Food Entries (Meals) ====================

export async function addMeal(userId: string, meal: FoodEntry): Promise<void> {
    try {
        await setDoc(foodEntryDocRef(userId, meal.id), {
            ...meal,
            createdAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error adding food entry:', error);
        throw error;
    }
}

export async function updateMeal(userId: string, meal: FoodEntry): Promise<void> {
    try {
        await setDoc(foodEntryDocRef(userId, meal.id), {
            ...meal,
            updatedAt: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error('Error updating food entry:', error);
        throw error;
    }
}

export async function deleteMealDoc(userId: string, mealId: string): Promise<void> {
    try {
        await deleteDoc(foodEntryDocRef(userId, mealId));
    } catch (error) {
        console.error('Error deleting food entry:', error);
        throw error;
    }
}

export async function loadMeals(userId: string): Promise<FoodEntry[]> {
    try {
        const q = query(foodEntriesCollectionRef(userId), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => {
            const data = d.data();
            return {
                id: data.id,
                foodName: data.foodName,
                calories: data.calories,
                mealType: data.mealType || 'snack',
                time: data.time,
                date: data.date,
            } as FoodEntry;
        });
    } catch (error) {
        console.error('Error loading food entries:', error);
        return [];
    }
}

/**
 * Subscribe to real-time food entry updates.
 */
export function onMealsSnapshot(
    userId: string,
    callback: (meals: FoodEntry[]) => void
): Unsubscribe {
    const q = query(foodEntriesCollectionRef(userId), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const meals = snapshot.docs.map(d => {
            const data = d.data();
            return {
                id: data.id,
                foodName: data.foodName,
                calories: data.calories,
                mealType: data.mealType || 'snack',
                time: data.time,
                date: data.date,
            } as FoodEntry;
        });
        callback(meals);
    }, (error) => {
        console.error('Food entries snapshot error:', error);
    });
}

// ==================== Weight Entries ====================

export async function saveWeightLog(userId: string, entry: WeightEntry): Promise<void> {
    try {
        await setDoc(weightEntryDocRef(userId, entry.date), {
            ...entry,
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error('Error saving weight entry:', error);
        throw error;
    }
}

export async function loadWeightLogs(userId: string): Promise<WeightEntry[]> {
    try {
        const q = query(weightEntriesCollectionRef(userId), orderBy('date', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => {
            const data = d.data();
            return {
                date: data.date,
                weight: data.weight,
            } as WeightEntry;
        });
    } catch (error) {
        console.error('Error loading weight entries:', error);
        return [];
    }
}

/**
 * Subscribe to real-time weight entry updates.
 */
export function onWeightLogsSnapshot(
    userId: string,
    callback: (entries: WeightEntry[]) => void
): Unsubscribe {
    const q = query(weightEntriesCollectionRef(userId), orderBy('date', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const entries = snapshot.docs.map(d => {
            const data = d.data();
            return {
                date: data.date,
                weight: data.weight,
            } as WeightEntry;
        });
        callback(entries);
    }, (error) => {
        console.error('Weight entries snapshot error:', error);
    });
}

// ==================== Onboarding Status ====================

export async function setOnboardingComplete(userId: string, complete: boolean): Promise<void> {
    try {
        await setDoc(userDocRef(userId), {
            onboardingComplete: complete,
            updatedAt: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error('Error saving onboarding status:', error);
        throw error;
    }
}

export async function isOnboardingComplete(userId: string): Promise<boolean> {
    try {
        const snap = await getDoc(userDocRef(userId));
        if (snap.exists()) {
            return snap.data().onboardingComplete === true;
        }
        return false;
    } catch (error) {
        console.error('Error loading onboarding status:', error);
        return false;
    }
}

// ==================== Bulk Operations ====================

/**
 * Clear all user data (for account deletion/reset).
 */
export async function clearAllData(userId: string): Promise<void> {
    try {
        const batch = writeBatch(db);

        // Delete all food entries
        const foodSnapshot = await getDocs(foodEntriesCollectionRef(userId));
        foodSnapshot.docs.forEach(d => batch.delete(d.ref));

        // Delete all weight entries
        const weightSnapshot = await getDocs(weightEntriesCollectionRef(userId));
        weightSnapshot.docs.forEach(d => batch.delete(d.ref));

        // Delete user document (profile, stats, onboarding)
        batch.delete(userDocRef(userId));

        await batch.commit();
    } catch (error) {
        console.error('Error clearing data:', error);
        throw error;
    }
}
