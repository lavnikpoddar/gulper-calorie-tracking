// WeightTrendChart - Clean layout matching reference design
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Circle, G, Text as SvgText, Rect } from 'react-native-svg';
import { GulperCard } from '../common/GulperCard';
import { Colors, Typography, Spacing } from '../../utils/theme';
import { WeightLog } from '../../utils/storage';

interface WeightTrendChartProps {
    weightLogs: WeightLog[];
    currentWeight: number;
    startWeight: number;
    goalWeight: number;
    units: 'metric' | 'imperial';
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HORIZONTAL_MARGIN = 20;
const CARD_PADDING = 16;
const CHART_HEIGHT = 200;
const LINE_EXTENSION = 30; // How much lines extend beyond visible card

export function WeightTrendChart({ weightLogs, currentWeight, startWeight, goalWeight, units }: WeightTrendChartProps) {
    const displayUnit = units === 'metric' ? 'kg' : 'lb';
    const weightMultiplier = units === 'metric' ? 1 : 2.20462;

    // Sort logs by date
    const sortedLogs = [...weightLogs].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Determine if gaining or losing weight
    const isGaining = goalWeight > startWeight;

    // Convert weights for display
    const startWeightDisplay = Math.round(startWeight * weightMultiplier);
    const goalWeightDisplay = Math.round(goalWeight * weightMultiplier);

    // Get current weight from latest log or startWeight
    const latestWeight = sortedLogs.length > 0
        ? sortedLogs[sortedLogs.length - 1].weight
        : startWeight;
    const currentWeightDisplay = Math.round(latestWeight * weightMultiplier);

    // Calculate Y bounds based on all weights
    const allWeights = [startWeight, latestWeight, goalWeight, ...sortedLogs.map(l => l.weight)];
    const minWeight = Math.min(...allWeights) - 3;
    const maxWeight = Math.max(...allWeights) + 3;
    const range = maxWeight - minWeight;

    // Card inner width
    const cardInnerWidth = SCREEN_WIDTH - (CARD_HORIZONTAL_MARGIN * 2);

    // SVG dimensions (wider than visible for line extension)
    const svgWidth = cardInnerWidth + (LINE_EXTENSION * 2);

    // Graph area within padding
    const graphLeft = CARD_PADDING + LINE_EXTENSION;
    const graphRight = svgWidth - CARD_PADDING - LINE_EXTENSION;
    const graphWidth = graphRight - graphLeft;

    // Vertical spacing
    const graphTop = 15;
    const graphBottom = CHART_HEIGHT - 45; // Space for target pill at bottom
    const graphHeight = graphBottom - graphTop;

    // Convert weight to Y position
    const getY = (weight_kg: number) => {
        const normalized = (weight_kg - minWeight) / range;
        return graphBottom - (normalized * graphHeight);
    };

    // Target line Y position
    const targetY = getY(goalWeight);

    // Start position
    const startX = graphLeft;
    const startY = getY(startWeight);

    // Current position (at ~75% of width to leave room for label)
    const currentX = graphLeft + graphWidth * 0.7;
    const currentY = getY(latestWeight);

    // Build path
    let pathD = '';

    if (sortedLogs.length === 0) {
        // No logs - just a flat line from start
        pathD = `M ${-LINE_EXTENSION} ${startY} L ${svgWidth + LINE_EXTENSION} ${startY}`;
    } else if (sortedLogs.length === 1) {
        // One log - curve from start to current
        const midX = (startX + currentX) / 2;
        pathD = `M ${-LINE_EXTENSION} ${startY} L ${startX} ${startY}`;
        pathD += ` C ${midX} ${startY}, ${midX} ${currentY}, ${currentX} ${currentY}`;
        pathD += ` L ${svgWidth + LINE_EXTENSION} ${currentY}`;
    } else {
        // Multiple logs - connect all points
        const step = graphWidth * 0.7 / (sortedLogs.length);

        pathD = `M ${-LINE_EXTENSION} ${startY} L ${startX} ${startY}`;

        let prevX = startX;
        let prevY = startY;

        sortedLogs.forEach((log, index) => {
            const x = startX + step * (index + 1);
            const y = getY(log.weight);
            const midX = (prevX + x) / 2;
            pathD += ` C ${midX} ${prevY}, ${midX} ${y}, ${x} ${y}`;
            prevX = x;
            prevY = y;
        });

        pathD += ` L ${svgWidth + LINE_EXTENSION} ${prevY}`;
    }

    const hasLogs = sortedLogs.length > 0;

    return (
        <GulperCard padding="none">
            <View style={styles.container}>
                {/* Title */}
                <Text style={styles.title}>Weight Trend</Text>

                {/* Starting Weight Label (above chart, follows padding) */}
                <Text style={styles.startingWeightLabel}>
                    Starting Weight : {startWeightDisplay} {displayUnit}
                </Text>

                {/* Chart Area - overflow hidden to clip extended lines */}
                <View style={styles.chartWrapper}>
                    <Svg
                        width={svgWidth}
                        height={CHART_HEIGHT}
                        style={{ marginLeft: -LINE_EXTENSION }}
                    >
                        {/* Target dashed line - extends beyond edges */}
                        <Line
                            x1={0}
                            y1={targetY}
                            x2={svgWidth}
                            y2={targetY}
                            stroke="#D1D5DB"
                            strokeWidth={1.5}
                            strokeDasharray="6,4"
                        />

                        {/* Trend line */}
                        <Path
                            d={pathD}
                            stroke={Colors.green}
                            strokeWidth={5}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Start dot with white outline */}
                        <Circle
                            cx={startX}
                            cy={startY}
                            r={8}
                            fill={Colors.green}
                            stroke={Colors.white}
                            strokeWidth={3}
                        />

                        {/* Current weight dot (only if we have logs) */}
                        {hasLogs && (
                            <Circle
                                cx={currentX}
                                cy={currentY}
                                r={8}
                                fill={Colors.green}
                                stroke={Colors.white}
                                strokeWidth={3}
                            />
                        )}
                    </Svg>
                </View>

                {/* Current Weight Label (positioned relative to dot, follows padding) */}
                {hasLogs && (
                    <View style={[
                        styles.currentWeightContainer,
                        { top: 50 + (currentY / CHART_HEIGHT) * 80 }
                    ]}>
                        <Text style={styles.currentWeightLabel}>
                            Current Weight : {currentWeightDisplay} {displayUnit}
                        </Text>
                    </View>
                )}

                {/* Target Pill (at bottom, follows padding) */}
                <View style={[
                    styles.targetPill,
                    isGaining && styles.targetPillTop
                ]}>
                    <Text style={styles.targetPillText}>
                        Target : {goalWeightDisplay} {displayUnit}
                    </Text>
                </View>
            </View>
        </GulperCard>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.lg,
        position: 'relative',
    },
    title: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
        paddingHorizontal: CARD_PADDING,
    },
    startingWeightLabel: {
        fontSize: Typography.caption.fontSize,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
        paddingHorizontal: CARD_PADDING,
    },
    chartWrapper: {
        overflow: 'hidden',
        height: CHART_HEIGHT,
    },
    currentWeightContainer: {
        position: 'absolute',
        right: CARD_PADDING,
    },
    currentWeightLabel: {
        fontSize: Typography.caption.fontSize,
        color: Colors.textSecondary,
    },
    targetPill: {
        position: 'absolute',
        bottom: Spacing.lg + 15,
        left: CARD_PADDING,
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 12,
    },
    targetPillTop: {
        bottom: undefined,
        top: 80,
    },
    targetPillText: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.textSecondary,
    },
});
