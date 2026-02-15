// CalorieBalanceCard component - fill from indicator to center
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
import { GulperCard } from '../common/GulperCard';
import { Colors, Typography, Spacing } from '../../utils/theme';
import { Meal } from '../../utils/storage';

interface CalorieBalanceCardProps {
    meals: Meal[];
    targetCalories: number;
}

// Colors for the gradient
const COLOR_CYAN = '#22D3EE';   // Eating less (left)
const COLOR_GREEN = '#22C55E';  // Balanced (center)
const COLOR_RED = '#EF4444';    // Eating more (right)

// Interpolate between two colors
function interpolateColor(color1: string, color2: string, factor: number): string {
    const hex = (c: string) => parseInt(c, 16);
    const r1 = hex(color1.slice(1, 3));
    const g1 = hex(color1.slice(3, 5));
    const b1 = hex(color1.slice(5, 7));
    const r2 = hex(color2.slice(1, 3));
    const g2 = hex(color2.slice(3, 5));
    const b2 = hex(color2.slice(5, 7));

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Get color at position (0 = left/cyan, 0.5 = center/green, 1 = right/red)
function getColorAtPosition(position: number): string {
    if (position <= 0.5) {
        return interpolateColor(COLOR_CYAN, COLOR_GREEN, position * 2);
    } else {
        return interpolateColor(COLOR_GREEN, COLOR_RED, (position - 0.5) * 2);
    }
}

const TRACK_WIDTH = 280;
const TRACK_HEIGHT = 8;
const INDICATOR_SIZE = 28;

export function CalorieBalanceCard({ meals, targetCalories }: CalorieBalanceCardProps) {
    // Calculate 7-day average
    const today = new Date();
    const last7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        last7Days.push(date.toISOString().split('T')[0]);
    }

    const dailyTotals = last7Days.map(date => {
        return meals.filter(m => m.date === date).reduce((sum, m) => sum + m.calories, 0);
    });

    const daysWithData = dailyTotals.filter(c => c > 0).length;
    const avgCalories = daysWithData > 0
        ? dailyTotals.reduce((sum, c) => sum + c, 0) / daysWithData
        : targetCalories;

    // Calculate balance (-1 to 1, where 0 is on target / perfect balance)
    const balance = (avgCalories - targetCalories) / targetCalories;
    const clampedBalance = Math.min(Math.max(balance, -1), 1);

    // Position: 0 = left (eating less), 0.5 = center (balanced), 1 = right (eating more)
    const indicatorPosition = 0.5 + (clampedBalance * 0.5);

    // Get color at the indicator position
    const indicatorColor = getColorAtPosition(indicatorPosition);

    // Pixel positions
    const indicatorX = indicatorPosition * TRACK_WIDTH;
    const centerX = TRACK_WIDTH / 2;

    // Fill goes from indicator to center
    const isLeft = indicatorPosition < 0.5;
    const fillStartX = isLeft ? indicatorX : centerX;
    const fillEndX = isLeft ? centerX : indicatorX;
    const fillWidth = fillEndX - fillStartX;

    const trackY = (INDICATOR_SIZE - TRACK_HEIGHT) / 2;

    return (
        <GulperCard>
            <Text style={styles.title}>Calorie Balance</Text>

            <View style={styles.trackContainer}>
                <Svg width={TRACK_WIDTH} height={INDICATOR_SIZE}>
                    <Defs>
                        {/* Gradient for left side fill (cyan to green) */}
                        <LinearGradient id="leftGradient" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0" stopColor={COLOR_CYAN} />
                            <Stop offset="1" stopColor={COLOR_GREEN} />
                        </LinearGradient>

                        {/* Gradient for right side fill (green to red) */}
                        <LinearGradient id="rightGradient" x1="0" y1="0" x2="1" y2="0">
                            <Stop offset="0" stopColor={COLOR_GREEN} />
                            <Stop offset="1" stopColor={COLOR_RED} />
                        </LinearGradient>
                    </Defs>

                    {/* Gray background track */}
                    <Rect
                        x={0}
                        y={trackY}
                        width={TRACK_WIDTH}
                        height={TRACK_HEIGHT}
                        rx={TRACK_HEIGHT / 2}
                        fill="#E5E7EB"
                    />

                    {/* Gradient fill (from indicator to center) */}
                    {fillWidth > 0 && (
                        <Rect
                            x={fillStartX}
                            y={trackY}
                            width={fillWidth}
                            height={TRACK_HEIGHT}
                            fill={isLeft ? 'url(#leftGradient)' : 'url(#rightGradient)'}
                        />
                    )}

                    {/* Center line marker */}
                    <Rect
                        x={centerX - 2}
                        y={0}
                        width={4}
                        height={INDICATOR_SIZE}
                        fill={Colors.textSecondary}
                    />

                    {/* Indicator Circle with shadow effect */}
                    <Circle
                        cx={indicatorX}
                        cy={INDICATOR_SIZE / 2}
                        r={INDICATOR_SIZE / 2 - 1}
                        fill={indicatorColor}
                        stroke={Colors.white}
                        strokeWidth={3}
                    />
                </Svg>
            </View>

            <View style={styles.labelsRow}>
                <Text style={styles.label}>EATING LESS</Text>
                <Text style={styles.label}>EATING MORE</Text>
            </View>

            <Text style={styles.caption}>Based on last 7 days</Text>
        </GulperCard>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.lg,
    },
    trackContainer: {
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    label: {
        fontSize: Typography.captionSmall.fontSize,
        fontWeight: '600',
        color: Colors.textSecondary,
        letterSpacing: 0.5,
    },
    caption: {
        fontSize: Typography.caption.fontSize,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
});
