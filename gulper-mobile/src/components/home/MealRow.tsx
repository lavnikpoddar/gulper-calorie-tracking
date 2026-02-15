// MealRow component with swipe-to-reveal actions - polished version
import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../utils/theme';
import { Meal } from '../../utils/storage';

interface MealRowProps {
    meal: Meal;
    onEdit: () => void;
    onDelete: () => void;
}

const ACTION_WIDTH = 70;
const SWIPE_THRESHOLD = 40;

export function MealRow({ meal, onEdit, onDelete }: MealRowProps) {
    const translateX = useRef(new Animated.Value(0)).current;
    const isOpen = useRef(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Only capture horizontal swipes
                return Math.abs(gestureState.dx) > 8 && Math.abs(gestureState.dy) < 8;
            },
            onPanResponderGrant: () => {
                // Stop any running animations
                translateX.stopAnimation();
            },
            onPanResponderMove: (_, gestureState) => {
                const baseValue = isOpen.current ? -ACTION_WIDTH * 2 : 0;
                const newValue = baseValue + gestureState.dx;
                // Clamp between -ACTION_WIDTH*2 and 0
                translateX.setValue(Math.min(0, Math.max(-ACTION_WIDTH * 2, newValue)));
            },
            onPanResponderRelease: (_, gestureState) => {
                const velocity = gestureState.vx;

                // Use velocity for smoother feel
                if (velocity < -0.5 || (gestureState.dx < -SWIPE_THRESHOLD && !isOpen.current)) {
                    // Open
                    isOpen.current = true;
                    Animated.spring(translateX, {
                        toValue: -ACTION_WIDTH * 2,
                        useNativeDriver: true,
                        tension: 100,
                        friction: 12,
                    }).start();
                } else if (velocity > 0.5 || (gestureState.dx > SWIPE_THRESHOLD && isOpen.current)) {
                    // Close
                    isOpen.current = false;
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                        tension: 100,
                        friction: 12,
                    }).start();
                } else {
                    // Snap back to current state
                    Animated.spring(translateX, {
                        toValue: isOpen.current ? -ACTION_WIDTH * 2 : 0,
                        useNativeDriver: true,
                        tension: 100,
                        friction: 12,
                    }).start();
                }
            },
        })
    ).current;

    const closeRow = () => {
        isOpen.current = false;
        Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 12,
        }).start();
    };

    const handleEdit = () => {
        closeRow();
        onEdit();
    };

    const handleDelete = () => {
        closeRow();
        onDelete();
    };

    return (
        <View style={styles.container}>
            {/* Action buttons (behind) */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={handleEdit}
                    activeOpacity={0.8}
                >
                    <Ionicons name="pencil" size={22} color={Colors.white} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={handleDelete}
                    activeOpacity={0.8}
                >
                    <Ionicons name="trash" size={22} color={Colors.white} />
                </TouchableOpacity>
            </View>

            {/* Main content (front) */}
            <Animated.View
                style={[styles.content, { transform: [{ translateX }] }]}
                {...panResponder.panHandlers}
            >
                <View style={styles.textContainer}>
                    <Text style={styles.mealName}>{meal.foodName}</Text>
                    <Text style={styles.mealTime}>{meal.time}</Text>
                </View>
                <View style={styles.calorieContainer}>
                    <Text style={styles.calorieNumber}>{meal.calories}</Text>
                    <Text style={styles.calorieUnit}>kcal</Text>
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    actionsContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        flexDirection: 'row',
    },
    actionButton: {
        width: ACTION_WIDTH,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        backgroundColor: Colors.green,
    },
    deleteButton: {
        backgroundColor: '#EF4444',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.surface,
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    textContainer: {
        flex: 1,
    },
    mealName: {
        fontSize: Typography.body.fontSize,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    mealTime: {
        fontSize: Typography.caption.fontSize,
        color: Colors.textSecondary,
    },
    calorieContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    calorieNumber: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    calorieUnit: {
        fontSize: Typography.caption.fontSize,
        color: Colors.textSecondary,
        marginLeft: 4,
    },
});
