// Reusable GulperCard component
import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../../utils/theme';

interface GulperCardProps {
    children: ReactNode;
    style?: ViewStyle;
    padding?: 'default' | 'large' | 'none';
}

export function GulperCard({ children, style, padding = 'default' }: GulperCardProps) {
    const paddingValue = padding === 'none' ? 0 : padding === 'large' ? Spacing.xl : Spacing.lg;

    return (
        <View style={[styles.card, { padding: paddingValue }, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
        ...Shadows.card,
    },
});
