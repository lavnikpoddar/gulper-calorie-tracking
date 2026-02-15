// JourneyBar component - shows progress from start to goal date (FULL WIDTH)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { getDaysDifference, formatDate } from '../../utils/calculations';

interface JourneyBarProps {
    startDate: Date;
    goalDate: Date;
    currentDate?: Date;
}

export function JourneyBar({ startDate, goalDate, currentDate = new Date() }: JourneyBarProps) {
    const totalDays = getDaysDifference(startDate, goalDate);
    const elapsedDays = getDaysDifference(startDate, currentDate);
    const progress = Math.min(Math.max(elapsedDays / totalDays, 0), 1);

    const dayNumber = Math.max(1, Math.min(elapsedDays + 1, totalDays));

    return (
        <View style={styles.container}>
            <Text style={styles.label}>JOURNEY</Text>

            <View style={styles.barContainer}>
                <View style={styles.track}>
                    <View style={[styles.fill, { width: `${progress * 100}%` }]} />
                </View>

                {/* Start dot */}
                <View style={[styles.dot, styles.startDot]} />
                {/* End dot */}
                <View style={[styles.dot, styles.endDot]} />
            </View>

            <View style={styles.labelsRow}>
                <Text style={styles.dateLabel}>{formatDate(startDate)}</Text>
                <Text style={styles.dayCount}>
                    Day {dayNumber} of {totalDays}
                </Text>
                <Text style={styles.dateLabel}>{formatDate(goalDate)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: Spacing.xl,
        paddingHorizontal: 0, // No horizontal padding - full width
    },
    label: {
        fontSize: Typography.captionSmall.fontSize,
        fontWeight: '600',
        color: Colors.textSecondary,
        letterSpacing: 0.5,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    barContainer: {
        height: 8,
        position: 'relative',
        marginHorizontal: 0, // Full width
    },
    track: {
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: BorderRadius.full,
        marginTop: 2,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: Colors.green,
        borderRadius: BorderRadius.full,
    },
    dot: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 4,
        top: 0,
    },
    startDot: {
        left: 0,
        backgroundColor: Colors.green,
    },
    endDot: {
        right: 0,
        backgroundColor: Colors.border,
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    dateLabel: {
        fontSize: Typography.captionSmall.fontSize,
        color: Colors.textSecondary,
    },
    dayCount: {
        fontSize: Typography.caption.fontSize,
        fontWeight: '500',
        color: Colors.green,
    },
});
