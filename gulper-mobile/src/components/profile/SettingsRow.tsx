// SettingsRow component - reusable row for profile settings
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../utils/theme';

interface SettingsRowProps {
    label: string;
    value: string;
    onPress?: () => void;
    isFirst?: boolean;
    isLast?: boolean;
}

export function SettingsRow({ label, value, onPress, isFirst, isLast }: SettingsRowProps) {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                isFirst && styles.firstRow,
                isLast && styles.lastRow,
                !isLast && styles.borderBottom,
            ]}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <Text style={styles.label}>{label}</Text>
            <View style={styles.valueContainer}>
                <Text style={styles.value}>{value}</Text>
                {onPress && (
                    <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.lg,
        backgroundColor: Colors.surface,
    },
    firstRow: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    lastRow: {
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    label: {
        fontSize: Typography.body.fontSize,
        fontWeight: '500',
        color: Colors.textPrimary,
        flex: 1,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    value: {
        fontSize: Typography.body.fontSize,
        color: Colors.textSecondary,
        textAlign: 'right',
    },
});
