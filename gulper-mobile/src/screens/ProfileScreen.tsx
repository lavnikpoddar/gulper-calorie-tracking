// Profile Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Modal, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { GulperCard } from '../components/common/GulperCard';
import { SettingsRow } from '../components/profile';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Colors, Typography, Spacing, BorderRadius } from '../utils/theme';
import { kgToLbs, lbsToKg, calculateAge } from '../utils/calculations';
import * as ImagePicker from 'expo-image-picker';

type EditField = 'gender' | 'activity' | 'height' | 'weight' | 'age' | 'goalWeight' | 'pace' | 'units' | 'displayName' | null;

const ACTIVITY_LABELS: Record<string, string> = {
    sedentary: 'Sedentary (Little/no exercise)',
    light: 'Light (1-3 days/week)',
    active: 'Active (6-7 days/week)',
};

const PACE_OPTIONS = [
    { value: 0.25, label: 'Slow' },
    { value: 0.5, label: 'Moderate' },
    { value: 0.75, label: 'Fast' },
    { value: 1.0, label: 'Very Fast' },
];

export function ProfileScreen() {
    const { state, updateProfile } = useApp();
    const { userProfile } = state;
    const { user, signOut, deleteAccount, updateUserProfile: updateAuthProfile } = useAuth();
    const [editField, setEditField] = useState<EditField>(null);
    const [editValue, setEditValue] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    if (!userProfile) return null;

    const isMetric = userProfile.units === 'metric';
    const weightUnit = isMetric ? 'kg' : 'lb';

    // Current values for display
    const currentWeight = isMetric ? userProfile.currentWeight : kgToLbs(userProfile.currentWeight);
    const goalWeight = isMetric ? userProfile.targetWeight : kgToLbs(userProfile.targetWeight);

    // Height display
    const heightDisplay = isMetric
        ? `${userProfile.height} cm`
        : (() => {
            const totalInches = userProfile.height / 2.54;
            const feet = Math.floor(totalInches / 12);
            const inches = Math.round(totalInches % 12);
            return `${feet}' ${inches}"`;
        })();

    const age = calculateAge(new Date(userProfile.dateOfBirth));

    // Pace display
    const weeklyChange = Math.abs(userProfile.progressRate);
    const paceDisplay = isMetric
        ? `${weeklyChange.toFixed(1)} kg/week`
        : `${(weeklyChange * 2.20462).toFixed(1)} lb/week`;

    const handleEditPress = (field: EditField) => {
        setEditField(field);
        // Pre-fill edit value based on field
        switch (field) {
            case 'weight':
                setEditValue(Math.round(currentWeight).toString());
                break;
            case 'goalWeight':
                setEditValue(Math.round(goalWeight).toString());
                break;
            default:
                setEditValue('');
        }
    };

    const handlePickAvatar = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets[0]) {
            const uri = result.assets[0].uri;
            try {
                await updateAuthProfile(undefined, uri);
                await updateProfile({ photoUrl: uri });
            } catch (error) {
                Alert.alert('Error', 'Failed to update profile picture.');
            }
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure? This will permanently delete your account and all your data. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsDeleting(true);
                        try {
                            await deleteAccount();
                        } catch (error: any) {
                            setIsDeleting(false);
                            Alert.alert('Error', error.message || 'Failed to delete account.');
                        }
                    },
                },
            ]
        );
    };

    const handleSave = async () => {
        if (!editField) return;

        const updates: Partial<typeof userProfile> = {};

        switch (editField) {
            case 'weight':
                const newWeight = parseFloat(editValue);
                if (!isNaN(newWeight)) {
                    updates.currentWeight = isMetric ? newWeight : lbsToKg(newWeight);
                }
                break;
            case 'goalWeight':
                const newGoal = parseFloat(editValue);
                if (!isNaN(newGoal)) {
                    updates.targetWeight = isMetric ? newGoal : lbsToKg(newGoal);
                }
                break;
            case 'gender':
                if (editValue === 'male' || editValue === 'female' || editValue === 'other') {
                    updates.gender = editValue;
                }
                break;
            case 'activity':
                updates.activityLevel = editValue as typeof userProfile.activityLevel;
                break;
            case 'units':
                updates.units = editValue as 'metric' | 'imperial';
                break;
            case 'pace':
                const paceValue = parseFloat(editValue);
                if (!isNaN(paceValue)) {
                    const isLosing = userProfile.targetWeight < userProfile.currentWeight;
                    updates.progressRate = isLosing ? -paceValue : paceValue;
                }
                break;
            case 'displayName':
                const trimmedName = editValue.trim();
                if (trimmedName) {
                    updates.displayName = trimmedName;
                    try {
                        await updateAuthProfile(trimmedName);
                    } catch (e) {
                        // Non-critical: Firestore profile will still update
                    }
                }
                break;
        }

        if (Object.keys(updates).length > 0) {
            updateProfile(updates);
        }

        setEditField(null);
        setEditValue('');
    };

    const renderEditModal = () => {
        if (!editField) return null;

        let title = '';
        let content = null;

        switch (editField) {
            case 'gender':
                title = 'Gender';
                content = (
                    <View style={styles.optionsList}>
                        {['male', 'female', 'other'].map(option => (
                            <TouchableOpacity
                                key={option}
                                style={[styles.optionRow, editValue === option && styles.optionRowSelected]}
                                onPress={() => setEditValue(option)}
                            >
                                <Text style={styles.optionText}>{option.charAt(0).toUpperCase() + option.slice(1)}</Text>
                                {(editValue === option || (!editValue && userProfile.gender === option)) && (
                                    <Ionicons name="checkmark" size={20} color={Colors.green} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                );
                break;

            case 'activity':
                title = 'Activity Level';
                content = (
                    <View style={styles.optionsList}>
                        {Object.entries(ACTIVITY_LABELS).map(([key, label]) => (
                            <TouchableOpacity
                                key={key}
                                style={[styles.optionRow, editValue === key && styles.optionRowSelected]}
                                onPress={() => setEditValue(key)}
                            >
                                <Text style={styles.optionText}>{label}</Text>
                                {(editValue === key || (!editValue && userProfile.activityLevel === key)) && (
                                    <Ionicons name="checkmark" size={20} color={Colors.green} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                );
                break;

            case 'weight':
            case 'goalWeight':
                title = editField === 'weight' ? 'Current Weight' : 'Goal Weight';
                content = (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={editValue}
                            onChangeText={setEditValue}
                            keyboardType="decimal-pad"
                            placeholder={`Enter weight in ${weightUnit}`}
                            placeholderTextColor={Colors.textDisabled}
                            autoFocus
                        />
                        <Text style={styles.inputUnit}>{weightUnit}</Text>
                    </View>
                );
                break;

            case 'pace':
                title = 'Weekly Pace';
                content = (
                    <View style={styles.optionsList}>
                        {PACE_OPTIONS.map(option => (
                            <TouchableOpacity
                                key={option.value}
                                style={[styles.optionRow, parseFloat(editValue) === option.value && styles.optionRowSelected]}
                                onPress={() => setEditValue(option.value.toString())}
                            >
                                <Text style={styles.optionText}>
                                    {option.label} ({isMetric ? option.value.toFixed(2) : (option.value * 2.20462).toFixed(1)} {weightUnit}/week)
                                </Text>
                                {(parseFloat(editValue) === option.value ||
                                    (!editValue && Math.abs(userProfile.progressRate) === option.value)) && (
                                        <Ionicons name="checkmark" size={20} color={Colors.green} />
                                    )}
                            </TouchableOpacity>
                        ))}
                    </View>
                );
                break;

            case 'units':
                title = 'Units';
                content = (
                    <View style={styles.optionsList}>
                        {['metric', 'imperial'].map(option => (
                            <TouchableOpacity
                                key={option}
                                style={[styles.optionRow, editValue === option && styles.optionRowSelected]}
                                onPress={() => setEditValue(option)}
                            >
                                <Text style={styles.optionText}>
                                    {option === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lb, ft/in)'}
                                </Text>
                                {(editValue === option || (!editValue && userProfile.units === option)) && (
                                    <Ionicons name="checkmark" size={20} color={Colors.green} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                );
                break;

            case 'displayName':
                title = 'Edit Name';
                content = (
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={editValue}
                            onChangeText={setEditValue}
                            placeholder="Enter your name"
                            placeholderTextColor={Colors.textDisabled}
                            autoFocus
                            autoCapitalize="words"
                            maxLength={50}
                        />
                    </View>
                );
                break;

            default:
                return null;
        }

        return (
            <Modal
                visible={true}
                animationType="slide"
                transparent
                onRequestClose={() => setEditField(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <TouchableOpacity onPress={() => setEditField(null)}>
                                <Ionicons name="close" size={24} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {content}

                        <PrimaryButton
                            title="Save"
                            onPress={handleSave}
                            style={styles.saveButton}
                        />
                    </View>
                </View>
            </Modal>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Account Header */}
                <View style={styles.accountHeader}>
                    <TouchableOpacity style={styles.avatarContainer} onPress={handlePickAvatar} activeOpacity={0.7}>
                        {(userProfile.photoUrl || user?.photoURL) ? (
                            <Image source={{ uri: userProfile.photoUrl || user?.photoURL || '' }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Ionicons name="person" size={32} color={Colors.textSecondary} />
                            </View>
                        )}
                        <View style={styles.cameraBadge}>
                            <Ionicons name="camera" size={12} color={Colors.white} />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.accountInfo}>
                        <TouchableOpacity onPress={() => {
                            setEditValue(userProfile.displayName || user?.displayName || '');
                            setEditField('displayName');
                        }}>
                            <View style={styles.nameRow}>
                                <Text style={styles.accountName}>
                                    {userProfile.displayName || user?.displayName || 'Gulper User'}
                                </Text>
                                <Ionicons name="pencil-outline" size={16} color={Colors.textSecondary} style={{ marginLeft: 6 }} />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.accountEmail}>
                            {user?.email || 'No email'}
                        </Text>
                    </View>
                </View>

                {/* Daily Calorie Target Card */}
                <GulperCard style={styles.calorieCard}>
                    <Text style={styles.calorieLabel}>DAILY CALORIE TARGET</Text>
                    <View style={styles.calorieRow}>
                        <Text style={styles.calorieNumber}>{userProfile.dailyCalorieTarget}</Text>
                        <Text style={styles.calorieUnit}>cal</Text>
                    </View>
                </GulperCard>

                {/* Your Details Section */}
                <Text style={styles.sectionTitle}>Your Details</Text>
                <View style={styles.section}>
                    <SettingsRow
                        label="Gender"
                        value={userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1)}
                        onPress={() => handleEditPress('gender')}
                        isFirst
                    />
                    <SettingsRow
                        label="Activity Level"
                        value={ACTIVITY_LABELS[userProfile.activityLevel] || userProfile.activityLevel}
                        onPress={() => handleEditPress('activity')}
                    />
                    <SettingsRow
                        label="Height"
                        value={heightDisplay}
                    // Height editing would need a picker - skipping for MVP
                    />
                    <SettingsRow
                        label="Current Weight"
                        value={`${Math.round(currentWeight)} ${weightUnit}`}
                        onPress={() => handleEditPress('weight')}
                    />
                    <SettingsRow
                        label="Age"
                        value={`${age} years`}
                        isLast
                    // Age editing would need date picker - skipping for MVP
                    />
                </View>

                {/* Your Goals Section */}
                <Text style={styles.sectionTitle}>Your Goals</Text>
                <View style={styles.section}>
                    <SettingsRow
                        label="Goal Weight"
                        value={`${Math.round(goalWeight)} ${weightUnit}`}
                        onPress={() => handleEditPress('goalWeight')}
                        isFirst
                    />
                    <SettingsRow
                        label="Pace"
                        value={paceDisplay}
                        onPress={() => handleEditPress('pace')}
                        isLast
                    />
                </View>

                {/* Preferences Section */}
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.section}>
                    <SettingsRow
                        label="Units"
                        value={userProfile.units === 'metric' ? 'Metric' : 'Imperial'}
                        onPress={() => handleEditPress('units')}
                        isFirst
                        isLast
                    />
                </View>

                {/* Logout */}
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => {
                        Alert.alert(
                            'Log Out',
                            'Are you sure you want to log out?',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Log Out', style: 'destructive', onPress: signOut },
                            ]
                        );
                    }}
                >
                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                {/* Delete Account */}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteAccount}
                    disabled={isDeleting}
                >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    <Text style={styles.deleteText}>
                        {isDeleting ? 'Deleting...' : 'Delete Account'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {renderEditModal()}
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
        paddingTop: Spacing.lg,
        paddingBottom: 120,
    },
    accountHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        paddingBottom: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    avatarContainer: {
        marginRight: Spacing.lg,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    avatarPlaceholder: {
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    accountInfo: {
        flex: 1,
    },
    accountName: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    accountEmail: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.xl,
    },
    calorieCard: {
        marginBottom: Spacing.xl,
    },
    calorieLabel: {
        fontSize: Typography.captionSmall.fontSize,
        fontWeight: '600',
        color: Colors.textSecondary,
        letterSpacing: 0.5,
        marginBottom: Spacing.xs,
    },
    calorieRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    calorieNumber: {
        fontSize: 56,
        fontWeight: '700',
        color: Colors.green,
    },
    calorieUnit: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '500',
        color: Colors.textSecondary,
        marginLeft: Spacing.xs,
    },
    sectionTitle: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
        marginTop: Spacing.md,
    },
    section: {
        marginBottom: Spacing.md,
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.xl,
        paddingBottom: Spacing.xxxl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    modalTitle: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    optionsList: {
        marginBottom: Spacing.xl,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    optionRowSelected: {
        backgroundColor: Colors.greenTint,
    },
    optionText: {
        fontSize: Typography.body.fontSize,
        color: Colors.textPrimary,
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    input: {
        flex: 1,
        height: 56,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.lg,
        fontSize: Typography.h2.fontSize,
        color: Colors.textPrimary,
    },
    inputUnit: {
        fontSize: Typography.body.fontSize,
        color: Colors.textSecondary,
        marginLeft: Spacing.md,
    },
    saveButton: {
        marginTop: Spacing.md,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginTop: Spacing.xl,
        backgroundColor: '#FFF0F0',
        borderRadius: BorderRadius.md,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.green,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginTop: Spacing.md,
        backgroundColor: 'transparent',
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: '#FF3B30',
        gap: 8,
    },
    deleteText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF3B30',
    },
});
