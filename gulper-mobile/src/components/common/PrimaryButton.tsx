// Primary CTA Button
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Colors, BorderRadius, ComponentSizes, Typography, Spacing } from '../../utils/theme';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    style?: ViewStyle;
}

export function PrimaryButton({ title, onPress, disabled = false, loading = false, style }: PrimaryButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.9}
        >
            {loading ? (
                <ActivityIndicator color={Colors.white} />
            ) : (
                <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: ComponentSizes.buttonHeight,
        backgroundColor: Colors.ctaBlack,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
    },
    disabled: {
        backgroundColor: Colors.ctaDisabled,
    },
    text: {
        color: Colors.white,
        fontSize: Typography.body.fontSize,
        fontWeight: '600',
    },
    disabledText: {
        color: Colors.textDisabled,
    },
});
