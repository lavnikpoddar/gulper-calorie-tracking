// CalendarStrip component - horizontal scrolling day picker with proper icons
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CalendarDayRing } from './CalendarDayRing';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { Meal } from '../../utils/storage';
import { formatDateISO } from '../../utils/calculations';

interface CalendarStripProps {
    selectedDate: Date;
    onDateSelect: (date: Date) => void;
    onCalendarPress: () => void;
    meals: Meal[];
    targetCalories: number;
}

// Generate dates: 60 days back, 30 days forward
function generateDates(): Date[] {
    const dates: Date[] = [];
    const today = new Date();

    for (let i = -60; i <= 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
    }

    return dates;
}

export function CalendarStrip({
    selectedDate,
    onDateSelect,
    onCalendarPress,
    meals,
    targetCalories
}: CalendarStripProps) {
    const flatListRef = useRef<FlatList>(null);
    const dates = useRef(generateDates()).current;
    const today = new Date();

    // Calculate calories by date for progress rings
    const caloriesByDate = React.useMemo(() => {
        const map = new Map<string, number>();
        meals.forEach(meal => {
            const current = map.get(meal.date) || 0;
            map.set(meal.date, current + meal.calories);
        });
        return map;
    }, [meals]);

    // Scroll to selected date on mount
    useEffect(() => {
        const selectedIndex = dates.findIndex(
            d => d.toDateString() === selectedDate.toDateString()
        );
        if (selectedIndex >= 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToIndex({
                    index: selectedIndex,
                    animated: true,
                    viewPosition: 0.5,
                });
            }, 200);
        }
    }, []);

    const monthYear = selectedDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    const renderDay = ({ item: date }: { item: Date }) => {
        const dateKey = date.toDateString();
        const todayKey = today.toDateString();
        const selectedKey = selectedDate.toDateString();

        const consumed = caloriesByDate.get(formatDateISO(date)) || 0;
        const progress = targetCalories > 0 ? consumed / targetCalories : 0;

        return (
            <CalendarDayRing
                date={date}
                isToday={dateKey === todayKey}
                isSelected={dateKey === selectedKey}
                progress={progress}
                onPress={() => onDateSelect(date)}
            />
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.monthYear}>{monthYear}</Text>
                <TouchableOpacity style={styles.calendarButton} onPress={onCalendarPress}>
                    <Ionicons name="calendar-outline" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
            </View>

            {/* Day Strip */}
            <FlatList
                ref={flatListRef}
                data={dates}
                renderItem={renderDay}
                keyExtractor={(item) => item.toISOString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                getItemLayout={(_, index) => ({
                    length: 56,
                    offset: 56 * index,
                    index,
                })}
                initialScrollIndex={60} // Start at today
                onScrollToIndexFailed={() => { }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.lg,
    },
    monthYear: {
        fontSize: Typography.h1.fontSize,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    calendarButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingHorizontal: Spacing.lg,
    },
});
