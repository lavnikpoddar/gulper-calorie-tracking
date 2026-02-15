// Screen 5: Goal Weight with slider
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { kgToLbs, getGoalType } from '../../utils/calculations';
import Slider from '@react-native-community/slider';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'GoalWeight'>;

export function GoalWeightScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { data, updateData } = useOnboarding();

    const isMetric = data.units === 'metric';
    const currentWeight = data.currentWeight;
    const goalWeight = data.targetWeight;

    // Calculate difference
    const diff = currentWeight - goalWeight;
    const diffDisplay = isMetric ? diff.toFixed(1) : kgToLbs(diff).toFixed(1);
    const goalType = getGoalType(currentWeight, goalWeight);
    const diffLabel = goalType === 'lose' ? 'Lose' : goalType === 'gain' ? 'Gain' : 'Maintain';

    // Display weight
    const displayWeight = isMetric ? Math.round(goalWeight) : Math.round(kgToLbs(goalWeight));
    const unit = isMetric ? 'kg' : 'lb';

    // Slider range
    const minWeight = isMetric ? 40 : 88;
    const maxWeight = isMetric ? currentWeight + 20 : kgToLbs(currentWeight) + 44;

    const handleSliderChange = (value: number) => {
        if (isMetric) {
            updateData({ targetWeight: value });
        } else {
            updateData({ targetWeight: value / 2.20462 });
        }
    };

    const handleBack = () => navigation.goBack();
    const handleContinue = () => navigation.navigate('Pace');

    return (
        <OnboardingLayout
            step={6}
            totalSteps={10}
            heading="What's your goal weight?"
            subtext="This will help us calculate your daily calorie target."
            onBack={handleBack}
            onContinue={handleContinue}
        >
            <View style={styles.container}>
                {/* Large Weight Display */}
                <View style={styles.weightDisplay}>
                    <Text style={styles.weightNumber}>{displayWeight}</Text>
                    <Text style={styles.weightUnit}>{unit}</Text>
                </View>

                {/* Difference Label */}
                <Text style={styles.diffLabel}>
                    {Math.abs(diff) > 0.5 ? `${diffLabel} ${Math.abs(parseFloat(diffDisplay))} ${unit}` : 'Maintain weight'}
                </Text>

                {/* Slider */}
                <Slider
                    style={styles.slider}
                    minimumValue={minWeight}
                    maximumValue={maxWeight}
                    value={displayWeight}
                    onValueChange={handleSliderChange}
                    minimumTrackTintColor={Colors.green}
                    maximumTrackTintColor={Colors.border}
                    thumbTintColor={Colors.green}
                    step={1}
                />
            </View>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: Spacing.xxxl,
    },
    weightDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: Spacing.sm,
    },
    weightNumber: {
        fontSize: 72,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    weightUnit: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginLeft: Spacing.xs,
    },
    diffLabel: {
        fontSize: Typography.body.fontSize,
        color: Colors.green,
        marginBottom: Spacing.xxxl,
    },
    slider: {
        width: '100%',
        height: 40,
    },
});
