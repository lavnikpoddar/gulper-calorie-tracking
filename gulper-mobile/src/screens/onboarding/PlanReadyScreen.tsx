// Screen 9: Plan Ready - Final onboarding screen
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useOnboarding } from '../../context/OnboardingContext';
import { useApp } from '../../context/AppContext';
import { PrimaryButton } from '../../components/common/PrimaryButton';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { calculateDailyCalorieTarget } from '../../utils/calculations';
import { StoredUserProfile } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';

export function PlanReadyScreen() {
    const { data } = useOnboarding();
    const { completeOnboarding } = useApp();
    const { user } = useAuth();

    // Calculate the daily calorie target
    const calorieProfile = {
        gender: data.gender!,
        activityLevel: data.activityLevel!,
        height: data.height,
        currentWeight: data.currentWeight,
        dateOfBirth: data.dateOfBirth!,
        targetWeight: data.targetWeight,
        progressRate: data.progressRate,
    };

    const dailyCalorieTarget = calculateDailyCalorieTarget(calorieProfile);

    const handleStartTracking = async () => {
        const storedProfile: StoredUserProfile = {
            displayName: data.displayName || user?.displayName || '',
            email: user?.email || '',
            photoUrl: user?.photoURL || null,
            gender: data.gender!,
            activityLevel: data.activityLevel!,
            height: data.height,
            currentWeight: data.currentWeight,
            units: data.units,
            dateOfBirth: data.dateOfBirth!.toISOString(),
            targetWeight: data.targetWeight,
            progressRate: data.progressRate,
            motivations: data.motivations,
            dailyCalorieTarget,
        };

        await completeOnboarding(storedProfile);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Success Icon */}
                <View style={styles.iconContainer}>
                    <Text style={styles.checkmark}>✓</Text>
                </View>

                {/* Heading */}
                <Text style={styles.heading}>You're all set!</Text>
                <Text style={styles.subtext}>Your personalized daily calorie target:</Text>

                {/* Calorie Card */}
                <View style={styles.calorieCard}>
                    <Text style={styles.calorieNumber}>{dailyCalorieTarget}</Text>
                    <Text style={styles.calorieUnit}>KCAL PER DAY</Text>
                </View>

                {/* Motivational text */}
                <Text style={styles.motivationalText}>
                    Track your meals daily to stay on target and reach your goals.
                </Text>
            </View>

            {/* Button */}
            <View style={styles.footer}>
                <PrimaryButton
                    title="Start Tracking"
                    onPress={handleStartTracking}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.green,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.textPrimary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    checkmark: {
        fontSize: 36,
        color: Colors.white,
        fontWeight: '700',
    },
    heading: {
        fontSize: 32,
        fontWeight: '800',
        color: Colors.white,
        marginBottom: Spacing.sm,
    },
    subtext: {
        fontSize: Typography.body.fontSize,
        color: Colors.white,
        opacity: 0.9,
        marginBottom: Spacing.xxl,
    },
    calorieCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: BorderRadius.xl,
        paddingVertical: Spacing.xxl,
        paddingHorizontal: Spacing.xxxl,
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    calorieNumber: {
        fontSize: 72,
        fontWeight: '700',
        color: Colors.white,
    },
    calorieUnit: {
        fontSize: Typography.body.fontSize,
        fontWeight: '600',
        color: Colors.white,
        letterSpacing: 1,
        marginTop: Spacing.xs,
    },
    motivationalText: {
        fontSize: Typography.body.fontSize,
        color: Colors.white,
        opacity: 0.9,
        textAlign: 'center',
        lineHeight: 22,
    },
    footer: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xl,
    },
});
