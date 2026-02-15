// BMICard component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GulperCard } from '../common/GulperCard';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { calculateBMI, getBMICategory, getBMICategoryColor } from '../../utils/calculations';

interface BMICardProps {
    weight_kg: number;
    height_cm: number;
}

export function BMICard({ weight_kg, height_cm }: BMICardProps) {
    const bmi = calculateBMI(weight_kg, height_cm);
    const category = getBMICategory(bmi);
    const categoryColor = getBMICategoryColor(bmi);

    // Calculate marker position (BMI 15-40 range)
    const minBMI = 15;
    const maxBMI = 40;
    const markerPosition = Math.min(Math.max((bmi - minBMI) / (maxBMI - minBMI), 0), 1) * 100;

    return (
        <GulperCard>
            <Text style={styles.title}>Your BMI</Text>

            <View style={styles.valueRow}>
                <Text style={styles.bmiValue}>{bmi.toFixed(1)}</Text>
                <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
                    <Text style={[styles.categoryText, { color: categoryColor }]}>
                        {category.toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* BMI Gradient Bar */}
            <View style={styles.barContainer}>
                <View style={styles.gradientBar}>
                    <View style={[styles.barSection, { backgroundColor: Colors.bmiUnder, flex: 3.5 }]} />
                    <View style={[styles.barSection, { backgroundColor: Colors.bmiHealthy, flex: 6.5 }]} />
                    <View style={[styles.barSection, { backgroundColor: Colors.bmiOver, flex: 5 }]} />
                    <View style={[styles.barSection, { backgroundColor: Colors.bmiObese, flex: 10 }]} />
                </View>

                {/* Marker */}
                <View style={[styles.marker, { left: `${markerPosition}%` }]} />
            </View>

            {/* Labels */}
            <View style={styles.labelsRow}>
                <Text style={[styles.label, { color: Colors.bmiUnder }]}>Under</Text>
                <Text style={[styles.label, { color: Colors.bmiHealthy }]}>Healthy</Text>
                <Text style={[styles.label, { color: Colors.bmiOver }]}>Over</Text>
                <Text style={[styles.label, { color: Colors.bmiObese }]}>Obese</Text>
            </View>
        </GulperCard>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    bmiValue: {
        fontSize: 48,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginRight: Spacing.md,
    },
    categoryBadge: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    categoryText: {
        fontSize: Typography.caption.fontSize,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    barContainer: {
        height: 12,
        position: 'relative',
        marginBottom: Spacing.sm,
    },
    gradientBar: {
        flexDirection: 'row',
        height: 8,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    barSection: {
        height: '100%',
    },
    marker: {
        position: 'absolute',
        top: 0,
        width: 3,
        height: 12,
        backgroundColor: Colors.textPrimary,
        borderRadius: 1.5,
        marginLeft: -1.5,
    },
    labelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xs,
    },
    label: {
        fontSize: Typography.captionSmall.fontSize,
        fontWeight: '500',
    },
});
