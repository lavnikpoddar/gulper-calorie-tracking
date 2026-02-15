// Screen 8: Building Plan - Animated loading screen
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'BuildingPlan'>;

export function BuildingPlanScreen() {
    const navigation = useNavigation<NavigationProp>();
    const [progress, setProgress] = useState(0);
    const pulseAnim = React.useRef(new Animated.Value(1)).current;

    // Pulse animation for the logo
    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    // Progress simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Accelerating progress for more natural feel
                const increment = prev < 50 ? 3 : prev < 80 ? 5 : 2;
                return Math.min(prev + increment, 100);
            });
        }, 100);

        return () => clearInterval(interval);
    }, []);

    // Navigate when complete
    useEffect(() => {
        if (progress >= 100) {
            const timeout = setTimeout(() => {
                navigation.navigate('PlanReady');
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [progress, navigation]);

    return (
        <View style={styles.container}>
            {/* Animated Logo */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    { transform: [{ scale: pulseAnim }] }
                ]}
            >
                <Text style={styles.logoText}>G</Text>
            </Animated.View>

            {/* Heading */}
            <Text style={styles.heading}>Building your plan</Text>
            <Text style={styles.subtext}>Creating your custom plan...</Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.greenTint,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    logoText: {
        fontSize: 36,
        fontWeight: '700',
        color: Colors.green,
    },
    heading: {
        fontSize: Typography.h1.fontSize,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    subtext: {
        fontSize: Typography.body.fontSize,
        color: Colors.textSecondary,
        marginBottom: Spacing.xxxl,
    },
    progressContainer: {
        width: '100%',
        alignItems: 'center',
    },
    progressTrack: {
        width: '100%',
        height: 8,
        backgroundColor: Colors.border,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
        marginBottom: Spacing.sm,
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.green,
        borderRadius: BorderRadius.full,
    },
    progressText: {
        fontSize: Typography.body.fontSize,
        color: Colors.textSecondary,
    },
});
