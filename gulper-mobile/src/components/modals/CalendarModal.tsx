// Calendar Modal - Full screen month calendar view with proper icons
import React, { useMemo, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { Meal } from '../../utils/storage';
import { formatDateISO } from '../../utils/calculations';
import Svg, { Circle } from 'react-native-svg';

interface CalendarModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectDate: (date: Date) => void;
    selectedDate: Date;
    meals: Meal[];
    targetCalories: number;
}

const DAY_SIZE = 44;
const RING_STROKE = 2;

function CalendarDay({
    date,
    isToday,
    isSelected,
    progress,
    isCurrentMonth,
    onPress
}: {
    date: Date;
    isToday: boolean;
    isSelected: boolean;
    progress: number;
    isCurrentMonth: boolean;
    onPress: () => void;
}) {
    const radius = (DAY_SIZE - RING_STROKE * 2) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - Math.min(progress, 1));

    // Colors - Selected uses dark gray so green ring is visible
    const bgColor = isSelected
        ? Colors.textSecondary
        : isToday
            ? Colors.textPrimary
            : 'transparent';

    const textColor = (isSelected || isToday)
        ? Colors.white
        : isCurrentMonth
            ? Colors.textPrimary
            : Colors.textDisabled;

    return (
        <TouchableOpacity
            style={styles.dayContainer}
            onPress={onPress}
            disabled={!isCurrentMonth}
        >
            <Svg width={DAY_SIZE} height={DAY_SIZE}>
                {/* Background ring */}
                <Circle
                    cx={DAY_SIZE / 2}
                    cy={DAY_SIZE / 2}
                    r={radius}
                    stroke={Colors.border}
                    strokeWidth={RING_STROKE}
                    fill={bgColor}
                />
                {/* Progress ring */}
                {progress > 0 && !isSelected && !isToday && (
                    <Circle
                        cx={DAY_SIZE / 2}
                        cy={DAY_SIZE / 2}
                        r={radius}
                        stroke={Colors.green}
                        strokeWidth={RING_STROKE}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin={`${DAY_SIZE / 2}, ${DAY_SIZE / 2}`}
                    />
                )}
            </Svg>
            <View style={styles.dayNumberContainer}>
                <Text style={[styles.dayNumber, { color: textColor }]}>
                    {date.getDate()}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

export function CalendarModal({
    visible,
    onClose,
    onSelectDate,
    selectedDate,
    meals,
    targetCalories,
}: CalendarModalProps) {
    const today = new Date();
    const scrollViewRef = useRef<ScrollView>(null);

    // Estimate height of each month section (header + day headers + ~5 weeks)
    const MONTH_HEIGHT = 280; // Approximate height of one month section
    const CURRENT_MONTH_INDEX = 3; // Index of current month (we show -3 to +3, so current is at index 3)

    // Scroll to current month when modal becomes visible
    useEffect(() => {
        if (visible) {
            // Small delay to ensure ScrollView is rendered
            setTimeout(() => {
                scrollViewRef.current?.scrollTo({
                    y: CURRENT_MONTH_INDEX * MONTH_HEIGHT - 50, // Subtract a bit to show some of previous month
                    animated: false,
                });
            }, 100);
        }
    }, [visible]);

    // Calculate calories by date
    const caloriesByDate = useMemo(() => {
        const map = new Map<string, number>();
        meals.forEach(meal => {
            const current = map.get(meal.date) || 0;
            map.set(meal.date, current + meal.calories);
        });
        return map;
    }, [meals]);

    // Generate months (-3 to +3)
    const months = useMemo(() => {
        const result: { year: number; month: number; days: Date[][] }[] = [];

        for (let offset = -3; offset <= 3; offset++) {
            const date = new Date(today.getFullYear(), today.getMonth() + offset, 1);
            const year = date.getFullYear();
            const month = date.getMonth();

            // Get first day and last day of month
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);

            // Generate weeks
            const weeks: Date[][] = [];
            let currentWeek: Date[] = [];

            // Pad beginning
            for (let i = 0; i < firstDay.getDay(); i++) {
                currentWeek.push(new Date(year, month, 1 - (firstDay.getDay() - i)));
            }

            // Add days
            for (let day = 1; day <= lastDay.getDate(); day++) {
                currentWeek.push(new Date(year, month, day));
                if (currentWeek.length === 7) {
                    weeks.push(currentWeek);
                    currentWeek = [];
                }
            }

            // Pad end
            if (currentWeek.length > 0) {
                let nextDay = 1;
                while (currentWeek.length < 7) {
                    currentWeek.push(new Date(year, month + 1, nextDay++));
                }
                weeks.push(currentWeek);
            }

            result.push({ year, month, days: weeks });
        }

        return result;
    }, [today]);

    const handleSelectDate = (date: Date) => {
        onSelectDate(date);
        onClose();
    };

    const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Calendar</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={20} color={Colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <ScrollView ref={scrollViewRef} style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {months.map(({ year, month, days }) => (
                        <View key={`${year}-${month}`} style={styles.monthContainer}>
                            <Text style={styles.monthTitle}>{monthNames[month]}</Text>

                            {/* Day headers */}
                            <View style={styles.dayHeadersRow}>
                                {dayHeaders.map((day, i) => (
                                    <Text key={i} style={styles.dayHeader}>{day}</Text>
                                ))}
                            </View>

                            {/* Weeks */}
                            {days.map((week, weekIndex) => (
                                <View key={weekIndex} style={styles.weekRow}>
                                    {week.map((date, dayIndex) => {
                                        const dateKey = date.toDateString();
                                        const isCurrentMonth = date.getMonth() === month;
                                        const consumed = caloriesByDate.get(formatDateISO(date)) || 0;
                                        const progress = targetCalories > 0 ? consumed / targetCalories : 0;

                                        return (
                                            <CalendarDay
                                                key={dayIndex}
                                                date={date}
                                                isToday={dateKey === today.toDateString()}
                                                isSelected={dateKey === selectedDate.toDateString()}
                                                progress={progress}
                                                isCurrentMonth={isCurrentMonth}
                                                onPress={() => handleSelectDate(date)}
                                            />
                                        );
                                    })}
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.lg,
    },
    title: {
        fontSize: Typography.h1.fontSize,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    monthContainer: {
        paddingHorizontal: Spacing.xl,
        marginBottom: Spacing.xxl,
    },
    monthTitle: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    dayHeadersRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Spacing.sm,
    },
    dayHeader: {
        width: DAY_SIZE,
        textAlign: 'center',
        fontSize: Typography.caption.fontSize,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    weekRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Spacing.xs,
    },
    dayContainer: {
        width: DAY_SIZE,
        height: DAY_SIZE,
        position: 'relative',
    },
    dayNumberContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayNumber: {
        fontSize: Typography.body.fontSize,
        fontWeight: '500',
    },
});
