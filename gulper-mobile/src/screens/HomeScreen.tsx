// Home Screen with edit meal support
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { GulperCard } from '../components/common/GulperCard';
import { CalendarStrip, CalorieRing, JourneyBar, MealRow } from '../components/home';
import { Colors, Typography, Spacing } from '../utils/theme';
import { calculateGoalDate, formatDateISO } from '../utils/calculations';
import { Meal } from '../utils/storage';

interface HomeScreenProps {
    onAddPress: () => void;
    onCalendarPress: () => void;
    onEditMeal: (meal: Meal) => void;
}

export function HomeScreen({ onAddPress, onCalendarPress, onEditMeal }: HomeScreenProps) {
    const { state, deleteMeal, setSelectedDate } = useApp();
    const { userProfile, meals, selectedDate } = state;

    if (!userProfile) return null;

    const targetCalories = userProfile.dailyCalorieTarget;
    const startDate = userProfile.createdAt ? new Date(userProfile.createdAt) : new Date();
    const goalDate = calculateGoalDate(
        userProfile.currentWeight,
        userProfile.targetWeight,
        userProfile.progressRate
    );

    // Filter meals for selected date
    const selectedDateMeals = meals.filter(m => m.date === selectedDate);
    const consumedCalories = selectedDateMeals.reduce((sum, m) => sum + m.calories, 0);

    const handleDateSelect = (date: Date) => {
        setSelectedDate(formatDateISO(date));
    };

    const handleDeleteMeal = (meal: Meal) => {
        Alert.alert(
            'Delete Meal',
            `Are you sure you want to delete "${meal.foodName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteMeal(meal.id)
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Calendar Strip */}
                <CalendarStrip
                    selectedDate={new Date(selectedDate)}
                    onDateSelect={handleDateSelect}
                    onCalendarPress={onCalendarPress}
                    meals={meals}
                    targetCalories={targetCalories}
                />

                {/* Main Calorie Ring Card */}
                <GulperCard style={styles.calorieCard}>
                    <View style={styles.ringContainer}>
                        <CalorieRing
                            consumed={consumedCalories}
                            target={targetCalories}
                        />
                    </View>
                    <JourneyBar
                        startDate={startDate}
                        goalDate={goalDate}
                    />
                </GulperCard>

                {/* Meals Section */}
                <View style={styles.mealsSection}>
                    <View style={styles.mealsHeader}>
                        <Text style={styles.mealsTitle}>Meals</Text>
                        <TouchableOpacity onPress={onAddPress}>
                            <Text style={styles.addMealButton}>+ Add Meal</Text>
                        </TouchableOpacity>
                    </View>

                    <GulperCard padding="none">
                        {selectedDateMeals.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No meals logged today</Text>
                            </View>
                        ) : (
                            selectedDateMeals.map((meal) => (
                                <MealRow
                                    key={meal.id}
                                    meal={meal}
                                    onEdit={() => onEditMeal(meal)}
                                    onDelete={() => handleDeleteMeal(meal)}
                                />
                            ))
                        )}
                    </GulperCard>
                </View>
            </ScrollView>
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
        paddingTop: Spacing.lg,
        paddingBottom: 120, // Space for bottom nav
    },
    calorieCard: {
        marginHorizontal: Spacing.xl,
        paddingVertical: Spacing.xxl,
        alignItems: 'center',
    },
    ringContainer: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    mealsSection: {
        marginTop: Spacing.xl,
        paddingHorizontal: Spacing.xl,
    },
    mealsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    mealsTitle: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    addMealButton: {
        fontSize: Typography.body.fontSize,
        fontWeight: '600',
        color: Colors.green,
    },
    emptyState: {
        paddingVertical: Spacing.xxl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: Typography.body.fontSize,
        color: Colors.textSecondary,
    },
});
