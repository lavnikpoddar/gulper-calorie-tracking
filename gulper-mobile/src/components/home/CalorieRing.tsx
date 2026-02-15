// CalorieRing component - main circular progress display
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography, Spacing, ComponentSizes } from '../../utils/theme';

interface CalorieRingProps {
    consumed: number;
    target: number;
}

const SIZE = ComponentSizes.calorieRingSize;
const STROKE_WIDTH = ComponentSizes.calorieRingStroke;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CalorieRing({ consumed, target }: CalorieRingProps) {
    const remaining = target - consumed;
    const isOver = remaining < 0;
    const progress = Math.min(consumed / target, 1.5); // Cap at 150% for visual

    const strokeDashoffset = CIRCUMFERENCE * (1 - Math.min(progress, 1));
    const ringColor = isOver ? '#EF4444' : Colors.green;

    return (
        <View style={styles.container}>
            <Svg width={SIZE} height={SIZE} style={styles.svg}>
                {/* Background circle */}
                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke={Colors.border}
                    strokeWidth={STROKE_WIDTH}
                    fill="transparent"
                />
                {/* Progress circle */}
                <Circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    stroke={ringColor}
                    strokeWidth={STROKE_WIDTH}
                    fill="transparent"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    rotation="-90"
                    origin={`${SIZE / 2}, ${SIZE / 2}`}
                />
            </Svg>

            {/* Center content */}
            <View style={styles.centerContent}>
                <Text style={styles.calorieNumber}>
                    {isOver ? Math.abs(remaining) : remaining}
                </Text>
                <Text style={styles.calorieLabel}>
                    {isOver ? 'KCAL OVER' : 'KCAL TO GO'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: SIZE,
        height: SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    svg: {
        position: 'absolute',
    },
    centerContent: {
        alignItems: 'center',
    },
    calorieNumber: {
        fontSize: 48,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    calorieLabel: {
        fontSize: Typography.caption.fontSize,
        fontWeight: '500',
        color: Colors.textSecondary,
        letterSpacing: 0.5,
    },
});
