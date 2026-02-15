// App Navigator - Root navigation container
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { OnboardingProvider } from '../context/OnboardingContext';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainTabNavigator } from './MainTabNavigator';
import { AuthNavigator } from './AuthNavigator';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { Colors } from '../utils/theme';

export type RootStackParamList = {
    Auth: undefined;
    Onboarding: undefined;
    Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function LoadingScreen() {
    return (
        <View style={styles.loadingContainer}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>G</Text>
            </View>
            <ActivityIndicator color={Colors.green} size="large" style={styles.spinner} />
        </View>
    );
}

export function AppNavigator() {
    const { state } = useApp();
    const { user, isLoading: authLoading } = useAuth();
    const { isLoading: appLoading, onboardingComplete } = state;

    if (authLoading || appLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    // User not logged in -> Show Auth Flow
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : !onboardingComplete ? (
                    // User logged in but no onboarding -> Show Onboarding
                    <Stack.Screen name="Onboarding">
                        {() => (
                            <OnboardingProvider>
                                <OnboardingNavigator />
                            </OnboardingProvider>
                        )}
                    </Stack.Screen>
                ) : (
                    // User logged in and onboarding done -> Show Main App
                    <Stack.Screen name="Main" component={MainTabNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.greenTint,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    logoText: {
        fontSize: 36,
        fontWeight: '700',
        color: Colors.green,
    },
    spinner: {
        marginTop: 16,
    },
});
