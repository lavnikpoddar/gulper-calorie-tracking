// Screen 1: Gender Selection
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';
import { GulperCard } from '../../components/common/GulperCard';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Typography, Spacing } from '../../utils/theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'Gender'>;

const GENDER_OPTIONS: { value: 'male' | 'female' | 'other'; label: string }[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

export function GenderScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { data, updateData } = useOnboarding();

    const handleContinue = () => {
        navigation.navigate('Workout');
    };

    return (
        <OnboardingLayout
            step={2}
            totalSteps={10}
            heading="Choose your Gender"
            subtext="This will be used to calibrate your custom plan."
            onContinue={handleContinue}
            continueDisabled={!data.gender}
            showBackButton={false}
        >
            <GulperCard padding="none">
                {GENDER_OPTIONS.map((option, index) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.option,
                            index < GENDER_OPTIONS.length - 1 && styles.optionBorder,
                            data.gender === option.value && styles.optionSelected,
                        ]}
                        onPress={() => updateData({ gender: option.value })}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.optionText,
                            data.gender === option.value && styles.optionTextSelected,
                        ]}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </GulperCard>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    option: {
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.lg,
    },
    optionBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    optionSelected: {
        backgroundColor: Colors.greenTint,
    },
    optionText: {
        fontSize: Typography.body.fontSize,
        fontWeight: '500',
        color: Colors.textPrimary,
    },
    optionTextSelected: {
        color: Colors.green,
    },
});
