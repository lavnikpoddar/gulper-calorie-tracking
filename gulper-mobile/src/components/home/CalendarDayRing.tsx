// CalendarDayRing component - shows a single day with progress ring
// Shows proportional fill and over-limit indicator (red arc for overage)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Colors, Typography, Spacing } from '../../utils/theme';

interface CalendarDayRingProps {
    date: Date;
    isToday: boolean;
    isSelected: boolean;
    progress: number; // 0-1+ (can exceed 1 if over limit)
    onPress: () => void;
}

const SIZE = 48;
const STROKE_WIDTH = 3;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CalendarDayRing({ date, isToday, isSelected, progress, onPress }: CalendarDayRingProps) {
    const dayLetter = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()];
    const dayNumber = date.getDate();

    const hasProgress = progress > 0;
    const isOver = progress > 1;

    // Calculate fill amounts
    const normalProgress = Math.min(progress, 1); // Cap at 100%
    const overProgress = isOver ? Math.min(progress - 1, 1) : 0; // Excess amount (capped at another 100%)

    const normalOffset = CIRCUMFERENCE * (1 - normalProgress);
    const overOffset = CIRCUMFERENCE * (1 - overProgress);

    // Colors - Selected uses dark gray so green ring is visible
    const backgroundColor = isSelected
        ? Colors.textSecondary
        : isToday
            ? Colors.textPrimary
            : 'transparent';

    const textColor = (isSelected || isToday) ? Colors.white : Colors.textPrimary;

    // Ring colors - always green for progress, red for over limit
    const normalRingColor = Colors.green;
    const overRingColor = '#EF4444'; // Red for over limit

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Day Letter */}
            <Text style={[
                styles.dayLetter,
                isToday && styles.dayLetterToday,
                isSelected && styles.dayLetterSelected,
            ]}>
                {dayLetter}
            </Text>

            {/* Ring + Number */}
            <View style={styles.ringContainer}>
                <Svg width={SIZE} height={SIZE} style={styles.svg}>
                    {/* Background circle */}
                    <Circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        stroke={Colors.border}
                        strokeWidth={STROKE_WIDTH}
                        fill={backgroundColor}
                    />

                    {/* Normal progress arc (green/white) */}
                    {hasProgress && (
                        <Circle
                            cx={SIZE / 2}
                            cy={SIZE / 2}
                            r={RADIUS}
                            stroke={normalRingColor}
                            strokeWidth={STROKE_WIDTH}
                            fill="transparent"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={normalOffset}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${SIZE / 2}, ${SIZE / 2}`}
                        />
                    )}

                    {/* Over-limit arc (red) - starts where normal ends */}
                    {isOver && (
                        <Circle
                            cx={SIZE / 2}
                            cy={SIZE / 2}
                            r={RADIUS}
                            stroke={overRingColor}
                            strokeWidth={STROKE_WIDTH}
                            fill="transparent"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={overOffset}
                            strokeLinecap="round"
                            rotation={-90 + (normalProgress * 360)} // Start after the green arc
                            origin={`${SIZE / 2}, ${SIZE / 2}`}
                        />
                    )}
                </Svg>

                {/* Day Number */}
                <View style={styles.numberContainer}>
                    <Text style={[styles.dayNumber, { color: textColor }]}>
                        {dayNumber}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: 56,
    },
    dayLetter: {
        fontSize: Typography.captionSmall.fontSize,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    dayLetterToday: {
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    dayLetterSelected: {
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    ringContainer: {
        width: SIZE,
        height: SIZE,
        position: 'relative',
    },
    svg: {
        position: 'absolute',
    },
    numberContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayNumber: {
        fontSize: Typography.body.fontSize,
        fontWeight: '600',
    },
});
