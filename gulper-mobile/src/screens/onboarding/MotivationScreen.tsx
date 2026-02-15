// Screen 7: Motivation selection - multi-select grid
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'Motivation'>;

interface MotivationOption {
    id: string;
    emoji: string;
    label: string;
}

const MOTIVATION_OPTIONS: MotivationOption[] = [
    { id: 'health', emoji: '❤️', label: 'Improve my health' },
    { id: 'confident', emoji: '✨', label: 'Feel more confident' },
    { id: 'fitter', emoji: '💪', label: 'Get fitter' },
    { id: 'energy', emoji: '⚡', label: 'Have more energy' },
    { id: 'clothes', emoji: '👕', label: 'Fit into my clothes' },
    { id: 'lifestyle', emoji: '🌟', label: 'Build a healthy lifestyle' },
];

export function MotivationScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { data, updateData } = useOnboarding();

    const toggleMotivation = (id: string) => {
        const current = data.motivations;
        if (current.includes(id)) {
            updateData({ motivations: current.filter(m => m !== id) });
        } else {
            updateData({ motivations: [...current, id] });
        }
    };

    const handleBack = () => navigation.goBack();
    const handleContinue = () => navigation.navigate('BuildingPlan');

    return (
        <OnboardingLayout
            step={8}
            totalSteps={10}
            heading="Why do you want to do this?"
            subtext="We'll use this to keep you motivated."
            onBack={handleBack}
            onContinue={handleContinue}
            continueDisabled={data.motivations.length === 0}
        >
            <View style={styles.grid}>
                {MOTIVATION_OPTIONS.map((option) => {
                    const isSelected = data.motivations.includes(option.id);
                    return (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionCard,
                                isSelected && styles.optionCardSelected,
                            ]}
                            onPress={() => toggleMotivation(option.id)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.emoji}>{option.emoji}</Text>
                            <Text style={[
                                styles.label,
                                isSelected && styles.labelSelected,
                            ]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: Spacing.md,
    },
    optionCard: {
        width: '47%',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        padding: Spacing.lg,
        minHeight: 100,
    },
    optionCardSelected: {
        backgroundColor: Colors.textPrimary,
        borderColor: Colors.textPrimary,
    },
    emoji: {
        fontSize: 24,
        marginBottom: Spacing.sm,
    },
    label: {
        fontSize: Typography.body.fontSize,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    labelSelected: {
        color: Colors.white,
    },
});
