// Screen 1: Name Input - First onboarding screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';
import { GulperCard } from '../../components/common/GulperCard';
import { useOnboarding } from '../../context/OnboardingContext';
import { useAuth } from '../../context/AuthContext';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'Name'>;

export function NameScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { data, updateData } = useOnboarding();
    const { user } = useAuth();

    // Pre-fill with Firebase Auth display name if available
    const [name, setName] = useState(data.displayName || user?.displayName || '');

    const handleNameChange = (text: string) => {
        setName(text);
        updateData({ displayName: text.trim() });
    };

    const handleContinue = () => {
        updateData({ displayName: name.trim() });
        navigation.navigate('Gender');
    };

    return (
        <OnboardingLayout
            step={1}
            totalSteps={10}
            heading="What's your name?"
            subtext="We'd love to know what to call you."
            onContinue={handleContinue}
            continueDisabled={!name.trim()}
            showBackButton={false}
        >
            <GulperCard>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor={Colors.textDisabled}
                    value={name}
                    onChangeText={handleNameChange}
                    autoFocus
                    autoCapitalize="words"
                    autoCorrect={false}
                    maxLength={50}
                    returnKeyType="next"
                    onSubmitEditing={name.trim() ? handleContinue : undefined}
                />
            </GulperCard>

            {user?.displayName && name !== user.displayName && (
                <Text style={styles.hint}>
                    Signed in as {user.displayName}
                </Text>
            )}
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    input: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '600',
        color: Colors.textPrimary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
        textAlign: 'center',
    },
    hint: {
        fontSize: Typography.caption.fontSize,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.lg,
    },
});
