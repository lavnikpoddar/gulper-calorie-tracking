// Screen 2: Workout Frequency
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';
import { GulperCard } from '../../components/common/GulperCard';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'Workout'>;

interface WorkoutOption {
    value: 'sedentary' | 'light' | 'active';
    title: string;
    subtitle: string;
    icon: string;
}

const WORKOUT_OPTIONS: WorkoutOption[] = [
    { value: 'sedentary', title: '0-2', subtitle: 'Workouts now and then', icon: '●' },
    { value: 'light', title: '3-5', subtitle: 'A few workouts per week', icon: '○' },
    { value: 'active', title: '6+', subtitle: 'Dedicated athlete', icon: '⁙' },
];

export function WorkoutScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { data, updateData } = useOnboarding();

    const handleBack = () => {
        navigation.goBack();
    };

    const handleContinue = () => {
        navigation.navigate('HeightWeight');
    };

    return (
        <OnboardingLayout
            step={3}
            totalSteps={10}
            heading="How many workouts do you do per week?"
            subtext="This will be used to calibrate your custom plan."
            onBack={handleBack}
            onContinue={handleContinue}
            continueDisabled={!data.activityLevel}
        >
            <View style={styles.optionsContainer}>
                {WORKOUT_OPTIONS.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.optionCard,
                            data.activityLevel === option.value && styles.optionCardSelected,
                        ]}
                        onPress={() => updateData({ activityLevel: option.value })}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.iconContainer,
                            data.activityLevel === option.value && styles.iconContainerSelected,
                        ]}>
                            <Text style={styles.icon}>{option.icon}</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.optionTitle}>{option.title}</Text>
                            <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    optionsContainer: {
        gap: Spacing.md,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.lg,
    },
    optionCardSelected: {
        borderColor: Colors.green,
        backgroundColor: Colors.greenTint,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    iconContainerSelected: {
        backgroundColor: Colors.green,
    },
    icon: {
        fontSize: 16,
        color: Colors.textPrimary,
    },
    textContainer: {
        flex: 1,
    },
    optionTitle: {
        fontSize: Typography.body.fontSize,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    optionSubtitle: {
        fontSize: Typography.caption.fontSize,
        color: Colors.textSecondary,
    },
});
