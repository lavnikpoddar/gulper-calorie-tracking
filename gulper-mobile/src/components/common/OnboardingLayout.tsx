// Shared Onboarding Layout
// Used by all 9 onboarding screens for consistent structure
import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Typography, Spacing } from '../../utils/theme';
import { ProgressBar } from './ProgressBar';
import { PrimaryButton } from './PrimaryButton';

interface OnboardingLayoutProps {
    step: number;
    totalSteps: number;
    heading: string;
    subtext?: string;
    children: ReactNode;
    onBack?: () => void;
    onContinue: () => void;
    continueDisabled?: boolean;
    continueLabel?: string;
    scrollable?: boolean;
    showBackButton?: boolean;
}

export function OnboardingLayout({
    step,
    totalSteps,
    heading,
    subtext,
    children,
    onBack,
    onContinue,
    continueDisabled = false,
    continueLabel = 'Continue',
    scrollable = true,
    showBackButton = true,
}: OnboardingLayoutProps) {
    const content = (
        <>
            {/* Header with Progress Bar and Back Button */}
            <View style={styles.header}>
                {showBackButton && step > 1 && onBack ? (
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.backPlaceholder} />
                )}
                <View style={styles.progressContainer}>
                    <ProgressBar current={step} total={totalSteps} />
                </View>
            </View>

            {/* Heading */}
            <Text style={styles.heading}>{heading}</Text>

            {/* Subtext */}
            {subtext && <Text style={styles.subtext}>{subtext}</Text>}

            {/* Content */}
            <View style={styles.content}>
                {children}
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            {scrollable ? (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {content}
                </ScrollView>
            ) : (
                <View style={styles.staticContent}>
                    {content}
                </View>
            )}

            {/* Continue Button - Fixed at bottom */}
            <View style={styles.footer}>
                <PrimaryButton
                    title={continueLabel}
                    onPress={onContinue}
                    disabled={continueDisabled}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xl,
    },
    staticContent: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.lg,
        marginBottom: Spacing.xxl,
    },
    backButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.sm,
    },
    backIcon: {
        fontSize: 28,
        fontWeight: '300',
        color: Colors.textPrimary,
    },
    backPlaceholder: {
        width: 32,
        height: 32,
        marginRight: Spacing.sm,
    },
    progressContainer: {
        flex: 1,
        height: 4,
    },
    heading: {
        fontSize: Typography.h1.fontSize,
        lineHeight: Typography.h1.lineHeight,
        fontWeight: Typography.h1.fontWeight,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    subtext: {
        fontSize: Typography.body.fontSize,
        lineHeight: Typography.body.lineHeight,
        color: Colors.textSecondary,
        marginBottom: Spacing.xl,
    },
    content: {
        flex: 1,
    },
    footer: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xl,
        backgroundColor: Colors.background,
    },
});
