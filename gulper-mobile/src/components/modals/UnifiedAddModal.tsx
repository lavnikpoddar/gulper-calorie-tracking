// Unified Add Modal - Meal/Weight tabs with validation
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../../utils/theme';
import { PrimaryButton } from '../common/PrimaryButton';
import { Meal } from '../../utils/storage';

// Validation constants
const VALIDATION = {
    mealName: { minLength: 1, maxLength: 100 },
    calories: { min: 1, max: 10000 },
    weight: { minKg: 20, maxKg: 500 },
};

interface UnifiedAddModalProps {
    visible: boolean;
    onClose: () => void;
    onAddMeal: (name: string, calories: number) => void;
    onLogWeight: (weight_kg: number) => void;
    currentWeight: number;
    units: 'metric' | 'imperial';
    // Edit mode props
    editMeal?: Meal | null;
    onUpdateMeal?: (meal: Meal) => void;
}

type Tab = 'meal' | 'weight';

export function UnifiedAddModal({
    visible,
    onClose,
    onAddMeal,
    onLogWeight,
    currentWeight,
    units,
    editMeal,
    onUpdateMeal,
}: UnifiedAddModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('meal');
    const [mealName, setMealName] = useState('');
    const [mealCalories, setMealCalories] = useState('');
    const [weight, setWeight] = useState('');
    const [error, setError] = useState<string | null>(null);

    const isMetric = units === 'metric';
    const displayWeight = isMetric ? currentWeight : currentWeight * 2.20462;
    const isEditMode = !!editMeal;

    // Pre-fill values when editing
    useEffect(() => {
        if (editMeal) {
            setMealName(editMeal.foodName);
            setMealCalories(editMeal.calories.toString());
            setActiveTab('meal');
        }
    }, [editMeal]);

    const validateMeal = (): string | null => {
        const name = mealName.trim();
        const calories = parseInt(mealCalories);

        if (!name) return 'Please enter a food name';
        if (name.length > VALIDATION.mealName.maxLength) {
            return `Food name must be under ${VALIDATION.mealName.maxLength} characters`;
        }
        if (!mealCalories.trim() || isNaN(calories)) {
            return 'Please enter a valid calorie amount';
        }
        if (calories < VALIDATION.calories.min || calories > VALIDATION.calories.max) {
            return `Calories must be between ${VALIDATION.calories.min} and ${VALIDATION.calories.max}`;
        }
        return null;
    };

    const validateWeight = (): string | null => {
        const weightValue = parseFloat(weight);
        if (!weight.trim() || isNaN(weightValue)) {
            return 'Please enter a valid weight';
        }

        const weight_kg = isMetric ? weightValue : weightValue / 2.20462;
        if (weight_kg < VALIDATION.weight.minKg || weight_kg > VALIDATION.weight.maxKg) {
            const minDisplay = isMetric ? VALIDATION.weight.minKg : Math.round(VALIDATION.weight.minKg * 2.20462);
            const maxDisplay = isMetric ? VALIDATION.weight.maxKg : Math.round(VALIDATION.weight.maxKg * 2.20462);
            return `Weight must be between ${minDisplay} and ${maxDisplay} ${isMetric ? 'kg' : 'lb'}`;
        }
        return null;
    };

    const handleSave = () => {
        setError(null);

        if (activeTab === 'meal') {
            const validationError = validateMeal();
            if (validationError) {
                setError(validationError);
                return;
            }

            if (isEditMode && editMeal && onUpdateMeal) {
                onUpdateMeal({
                    ...editMeal,
                    foodName: mealName.trim(),
                    calories: parseInt(mealCalories),
                });
            } else {
                onAddMeal(mealName.trim(), parseInt(mealCalories));
            }
            resetAndClose();
        } else {
            const validationError = validateWeight();
            if (validationError) {
                setError(validationError);
                return;
            }

            const weightValue = parseFloat(weight);
            const weight_kg = isMetric ? weightValue : weightValue / 2.20462;
            onLogWeight(weight_kg);
            resetAndClose();
        }
    };

    const resetAndClose = () => {
        setMealName('');
        setMealCalories('');
        setWeight('');
        setError(null);
        onClose();
    };

    const handleClose = () => {
        resetAndClose();
    };

    const isSaveDisabled = activeTab === 'meal'
        ? !mealName.trim() || !mealCalories.trim()
        : !weight.trim();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                {/* Background overlay - tap to close */}
                <Pressable style={styles.overlayDismiss} onPress={handleClose} />

                {/* Modal content - doesn't dismiss on tap */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={styles.modalContainer}
                >
                    <View style={styles.modal}>
                        {/* Header */}
                        <View style={styles.header}>
                            {/* Tab Switcher (hidden in edit mode) */}
                            {!isEditMode ? (
                                <View style={styles.tabContainer}>
                                    <TouchableOpacity
                                        style={[styles.tab, activeTab === 'meal' && styles.tabActive]}
                                        onPress={() => { setActiveTab('meal'); setError(null); }}
                                    >
                                        <Text style={[styles.tabText, activeTab === 'meal' && styles.tabTextActive]}>
                                            Meal
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.tab, activeTab === 'weight' && styles.tabActive]}
                                        onPress={() => { setActiveTab('weight'); setError(null); }}
                                    >
                                        <Text style={[styles.tabText, activeTab === 'weight' && styles.tabTextActive]}>
                                            Weight
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text style={styles.editTitle}>Edit Meal</Text>
                            )}

                            {/* Close Button */}
                            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                                <Ionicons name="close" size={20} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Error Message */}
                        {error && (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={16} color="#EF4444" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

                        {/* Content */}
                        {activeTab === 'meal' ? (
                            <View style={styles.formContent}>
                                <Text style={styles.inputLabel}>FOOD NAME</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., Chicken Salad"
                                    placeholderTextColor={Colors.textDisabled}
                                    value={mealName}
                                    onChangeText={(text) => { setMealName(text); setError(null); }}
                                    maxLength={VALIDATION.mealName.maxLength}
                                    autoFocus
                                />

                                <Text style={styles.inputLabel}>CALORIES</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g., 450"
                                    placeholderTextColor={Colors.textDisabled}
                                    value={mealCalories}
                                    onChangeText={(text) => {
                                        // Only allow numbers
                                        const cleaned = text.replace(/[^0-9]/g, '');
                                        setMealCalories(cleaned);
                                        setError(null);
                                    }}
                                    keyboardType="number-pad"
                                    maxLength={5}
                                />
                            </View>
                        ) : (
                            <View style={styles.formContent}>
                                <Text style={styles.inputLabel}>
                                    WEIGHT ({isMetric ? 'kg' : 'lb'})
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={displayWeight.toFixed(0)}
                                    placeholderTextColor={Colors.textDisabled}
                                    value={weight}
                                    onChangeText={(text) => {
                                        // Allow numbers and decimal point
                                        const cleaned = text.replace(/[^0-9.]/g, '');
                                        setWeight(cleaned);
                                        setError(null);
                                    }}
                                    keyboardType="decimal-pad"
                                    autoFocus
                                />
                            </View>
                        )}

                        {/* Save Button */}
                        <PrimaryButton
                            title={isEditMode ? "Update" : "Save"}
                            onPress={handleSave}
                            disabled={isSaveDisabled}
                        />
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.overlay,
        justifyContent: 'flex-end',
    },
    overlayDismiss: {
        flex: 1,
    },
    modalContainer: {
        justifyContent: 'flex-end',
    },
    modal: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        padding: Spacing.xl,
        paddingBottom: Spacing.xxxl,
        ...Shadows.modal,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    editTitle: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.full,
        padding: 4,
    },
    tab: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.full,
    },
    tabActive: {
        backgroundColor: Colors.surface,
    },
    tabText: {
        fontSize: Typography.body.fontSize,
        fontWeight: '500',
        color: Colors.textSecondary,
    },
    tabTextActive: {
        color: Colors.textPrimary,
        fontWeight: '600',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.lg,
        gap: 8,
    },
    errorText: {
        fontSize: Typography.caption.fontSize,
        color: '#EF4444',
        flex: 1,
    },
    formContent: {
        marginBottom: Spacing.xl,
    },
    inputLabel: {
        fontSize: Typography.captionSmall.fontSize,
        fontWeight: '600',
        color: Colors.textSecondary,
        letterSpacing: 0.5,
        marginBottom: Spacing.sm,
    },
    input: {
        height: 48,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.lg,
        fontSize: Typography.body.fontSize,
        color: Colors.textPrimary,
        marginBottom: Spacing.lg,
    },
});
