// Progress Bar component for onboarding
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../../utils/theme';

interface ProgressBarProps {
    current: number;
    total: number;
    height?: number;
}

export function ProgressBar({ current, total, height = 4 }: ProgressBarProps) {
    const progress = Math.min(current / total, 1);

    return (
        <View style={[styles.track, { height }]}>
            <View style={[styles.fill, { width: `${progress * 100}%`, height }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        flex: 1,
        backgroundColor: Colors.border,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    fill: {
        backgroundColor: Colors.textPrimary,
        borderRadius: BorderRadius.full,
    },
});
