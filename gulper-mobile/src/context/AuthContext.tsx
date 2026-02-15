import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
    User,
    initializeAuth,
    getAuth,
    onAuthStateChanged,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithCredential,
    fetchSignInMethodsForEmail,
    GoogleAuthProvider,
    OAuthProvider,
    updateProfile,
    Auth
} from 'firebase/auth';
// @ts-ignore - React Native specific export
import { getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { app } from '../config/firebaseConfig';
import { clearAllData } from '../utils/storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

// Configure Google Sign-In
// The webClientId comes from your Firebase project > Authentication > Sign-in method > Google
GoogleSignin.configure({
    webClientId: '49433036460-2fd1uuqugtfqdl3ic4h04ji8f5p9hifk.apps.googleusercontent.com',
    iosClientId: '49433036460-ke0s8ia3pg3iraee7pq2jslplns97d9u.apps.googleusercontent.com',
});

// Use initializeAuth on first load, getAuth on hot reload
let auth: Auth;
try {
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
} catch (e: any) {
    if (e.code === 'auth/already-initialized') {
        auth = getAuth(app);
    } else {
        throw e;
    }
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signInWithApple: () => Promise<void>;
    checkEmailExists: (email: string) => Promise<boolean>;
    getSignInMethods: (email: string) => Promise<string[]>;
    updateUserProfile: (displayName?: string, photoURL?: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (usr) => {
            setUser(usr);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signUp = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const signInWithGoogleHandler = async () => {
        // Check if Google Play Services are available (Android)
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        // Trigger Google Sign-In UI
        const response = await GoogleSignin.signIn();

        if (response.data?.idToken) {
            // Create Firebase credential with the Google ID token
            const credential = GoogleAuthProvider.credential(response.data.idToken);
            await signInWithCredential(auth, credential);
        } else {
            throw new Error('Google Sign-In failed: no ID token returned');
        }
    };

    const signInWithAppleHandler = async () => {
        // Generate a nonce for security
        const nonce = Math.random().toString(36).substring(2, 10);
        const hashedNonce = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            nonce
        );

        // Trigger Apple Sign-In UI
        const appleCredential = await AppleAuthentication.signInAsync({
            requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
            nonce: hashedNonce,
        });

        // Create Firebase credential with Apple's identity token
        const provider = new OAuthProvider('apple.com');
        const credential = provider.credential({
            idToken: appleCredential.identityToken!,
            rawNonce: nonce,
        });

        await signInWithCredential(auth, credential);
    };

    const updateUserProfileHandler = async (displayName?: string, photoURL?: string) => {
        if (!user) throw new Error('No user logged in');
        const updates: { displayName?: string; photoURL?: string } = {};
        if (displayName !== undefined) updates.displayName = displayName;
        if (photoURL !== undefined) updates.photoURL = photoURL;
        await updateProfile(user, updates);
    };

    const deleteAccountHandler = async () => {
        if (!user) throw new Error('No user logged in');
        try {
            // 1. Delete all Firestore data first
            await clearAllData(user.uid);
            // 2. Delete the Firebase Auth account
            await user.delete();
        } catch (error: any) {
            if (error.code === 'auth/requires-recent-login') {
                throw new Error('Please sign out and sign back in, then try deleting your account again.');
            }
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            signIn,
            signUp,
            signOut,
            signInWithGoogle: signInWithGoogleHandler,
            signInWithApple: signInWithAppleHandler,
            updateUserProfile: updateUserProfileHandler,
            deleteAccount: deleteAccountHandler,
            checkEmailExists: async (email: string) => {
                const methods = await fetchSignInMethodsForEmail(auth, email);
                return methods.length > 0;
            },
            getSignInMethods: async (email: string) => {
                return await fetchSignInMethodsForEmail(auth, email);
            },
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
