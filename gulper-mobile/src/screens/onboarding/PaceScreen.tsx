// Screen 6: Pace selection with slider
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';
import { GulperCard } from '../../components/common/GulperCard';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { calculateWeeksToGoal, calculateGoalDate, formatDateLong, kgToLbs } from '../../utils/calculations';
import Slider from '@react-native-community/slider';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'Pace'>;

export function PaceScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { data, updateData } = useOnboarding();

    const isMetric = data.units === 'metric';
    const pace = data.progressRate;
    const displayPace = isMetric ? pace.toFixed(1) : kgToLbs(pace).toFixed(1);
    const unit = isMetric ? 'kg/week' : 'lb/week';

    const weeksToGoal = calculateWeeksToGoal(data.currentWeight, data.targetWeight, pace);
    const goalDate = calculateGoalDate(data.currentWeight, data.targetWeight, pace);

    const handleSliderChange = (value: number) => {
        updateData({ progressRate: value });
    };

    const handleBack = () => navigation.goBack();
    const handleContinue = () => navigation.navigate('Motivation');

    return (
        <OnboardingLayout
            step={7}
            totalSteps={10}
            heading="Choose your pace"
            subtext="How fast do you want to reach your goal?"
            onBack={handleBack}
            onContinue={handleContinue}
        >
            <View style={styles.container}>
                {/* Large Pace Display */}
                <View style={styles.paceDisplay}>
                    <Text style={styles.paceNumber}>{displayPace}</Text>
                    <Text style={styles.paceUnit}>{unit}</Text>
                </View>

                {/* Weeks to goal */}
                <Text style={styles.weeksLabel}>
                    {weeksToGoal} weeks to goal
                </Text>

                {/* Slider with emojis */}
                <View style={styles.sliderContainer}>
                    <Slider
                        style={styles.slider}
                        minimumValue={0.1}
                        maximumValue={1.0}
                        value={pace}
                        onValueChange={handleSliderChange}
                        minimumTrackTintColor={Colors.green}
                        maximumTrackTintColor={Colors.border}
                        thumbTintColor={Colors.green}
                        step={0.1}
                    />
                    <View style={styles.emojiRow}>
                        <Text style={styles.emoji}>🐢</Text>
                        <Text style={styles.emoji}>🐰</Text>
                    </View>
                </View>

                {/* Goal Date Card */}
                <GulperCard style={styles.goalCard}>
                    <View style={styles.goalCardContent}>
                        <View style={styles.calendarIcon}>
                            <Text style={styles.calendarEmoji}>📅</Text>
                        </View>
                        <View>
                            <Text style={styles.goalLabel}>GOAL REACHED BY</Text>
                            <Text style={styles.goalDate}>{formatDateLong(goalDate)}</Text>
                        </View>
                    </View>
                </GulperCard>
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: Spacing.xl,
    },
    paceDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: Spacing.xs,
    },
    paceNumber: {
        fontSize: 72,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    paceUnit: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginLeft: Spacing.sm,
    },
    weeksLabel: {
        fontSize: Typography.body.fontSize,
        color: Colors.textSecondary,
        marginBottom: Spacing.xxl,
    },
    sliderContainer: {
        width: '100%',
        marginBottom: Spacing.xxl,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    emojiRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xs,
    },
    emoji: {
        fontSize: 24,
    },
    goalCard: {
        width: '100%',
    },
    goalCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    calendarIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.greenTint,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    calendarEmoji: {
        fontSize: 20,
    },
    goalLabel: {
        fontSize: Typography.captionSmall.fontSize,
        fontWeight: '600',
        color: Colors.textSecondary,
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    goalDate: {
        fontSize: Typography.body.fontSize,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
});
