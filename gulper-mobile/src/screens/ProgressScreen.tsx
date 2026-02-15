// Progress Screen
import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useApp } from '../context/AppContext';
import { GulperCard } from '../components/common/GulperCard';
import { BMICard, WeightTrendChart, CalorieBalanceCard } from '../components/progress';
import { Colors, Typography, Spacing } from '../utils/theme';
import { kgToLbs } from '../utils/calculations';

export function ProgressScreen() {
    const { state } = useApp();
    const { userProfile, meals, weightLogs } = state;

    if (!userProfile) return null;

    const isMetric = userProfile.units === 'metric';
    const currentWeight = isMetric ? userProfile.currentWeight : kgToLbs(userProfile.currentWeight);
    const goalWeight = isMetric ? userProfile.targetWeight : kgToLbs(userProfile.targetWeight);
    const unit = isMetric ? 'kg' : 'lb';

    // Get start weight from first weight log or use initial profile weight
    const startWeight_kg = weightLogs.length > 0
        ? weightLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0].weight
        : userProfile.currentWeight;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <Text style={styles.title}>Progress</Text>

                {/* My Weight Card */}
                <GulperCard style={styles.card}>
                    <Text style={styles.cardLabel}>MY WEIGHT</Text>
                    <View style={styles.weightRow}>
                        <Text style={styles.weightNumber}>{Math.round(currentWeight)}</Text>
                        <Text style={styles.weightUnit}>{unit}</Text>
                    </View>
                    <Text style={styles.goalText}>Goal {Math.round(goalWeight)} {unit}</Text>
                </GulperCard>

                {/* Weight Trend Chart */}
                <View style={styles.card}>
                    <WeightTrendChart
                        weightLogs={weightLogs}
                        currentWeight={userProfile.currentWeight}
                        startWeight={startWeight_kg}
                        goalWeight={userProfile.targetWeight}
                        units={userProfile.units}
                    />
                </View>

                {/* Calorie Balance */}
                <View style={styles.card}>
                    <CalorieBalanceCard
                        meals={meals}
                        targetCalories={userProfile.dailyCalorieTarget}
                    />
                </View>

                {/* BMI Card */}
                <View style={styles.card}>
                    <BMICard
                        weight_kg={userProfile.currentWeight}
                        height_cm={userProfile.height}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg,
        paddingBottom: 120, // Space for bottom nav
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.xl,
    },
    card: {
        marginBottom: Spacing.lg,
    },
    cardLabel: {
        fontSize: Typography.captionSmall.fontSize,
        fontWeight: '600',
        color: Colors.textSecondary,
        letterSpacing: 0.5,
        marginBottom: Spacing.xs,
    },
    weightRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    weightNumber: {
        fontSize: 64,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    weightUnit: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginLeft: Spacing.xs,
    },
    goalText: {
        fontSize: Typography.caption.fontSize,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
});
