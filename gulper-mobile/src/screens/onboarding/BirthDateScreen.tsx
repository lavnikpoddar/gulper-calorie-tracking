// Screen 4: Birth Date with triple scroll wheel picker
import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';
import { GulperCard } from '../../components/common/GulperCard';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Typography, Spacing } from '../../utils/theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'BirthDate'>;

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => currentYear - 15 - i); // 15 to 95 years old

interface WheelPickerProps {
    items: (string | number)[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

function WheelPicker({ items, selectedIndex, onSelect }: WheelPickerProps) {
    const scrollViewRef = useRef<ScrollView>(null);
    const containerHeight = ITEM_HEIGHT * VISIBLE_ITEMS;
    const paddingVertical = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

    const handleMomentumEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        if (index >= 0 && index < items.length) {
            onSelect(index);
            scrollViewRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
        }
    }, [items.length, onSelect]);

    React.useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: selectedIndex * ITEM_HEIGHT, animated: false });
        }, 100);
    }, []);

    return (
        <View style={[styles.wheelContainer, { height: containerHeight }]}>
            <View style={[styles.selectionIndicator, { top: paddingVertical, height: ITEM_HEIGHT }]} />
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                onMomentumScrollEnd={handleMomentumEnd}
                contentContainerStyle={{ paddingVertical }}
            >
                {items.map((item, index) => (
                    <View key={index} style={[styles.wheelItem, { height: ITEM_HEIGHT }]}>
                        <Text style={[
                            styles.wheelItemText,
                            index === selectedIndex && styles.wheelItemTextSelected,
                        ]}>
                            {item}
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

export function BirthDateScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { data, updateData } = useOnboarding();

    // Default to 30 years old if not set
    const birthDate = data.dateOfBirth || new Date(currentYear - 30, 5, 15);

    const monthIndex = birthDate.getMonth();
    const dayIndex = birthDate.getDate() - 1;
    const yearIndex = YEARS.indexOf(birthDate.getFullYear());

    const handleMonthSelect = (index: number) => {
        const newDate = new Date(birthDate);
        newDate.setMonth(index);
        updateData({ dateOfBirth: newDate });
    };

    const handleDaySelect = (index: number) => {
        const newDate = new Date(birthDate);
        newDate.setDate(index + 1);
        updateData({ dateOfBirth: newDate });
    };

    const handleYearSelect = (index: number) => {
        const newDate = new Date(birthDate);
        newDate.setFullYear(YEARS[index]);
        updateData({ dateOfBirth: newDate });
    };

    const handleBack = () => navigation.goBack();
    const handleContinue = () => {
        if (!data.dateOfBirth) {
            updateData({ dateOfBirth: birthDate });
        }
        navigation.navigate('GoalWeight');
    };

    return (
        <OnboardingLayout
            step={5}
            totalSteps={10}
            heading="Birth date"
            subtext="This will be used to calibrate your custom plan."
            onBack={handleBack}
            onContinue={handleContinue}
            scrollable={false}
        >
            <GulperCard style={styles.pickerCard}>
                <View style={styles.pickerHeaders}>
                    <Text style={styles.pickerHeader}>MONTH</Text>
                    <Text style={styles.pickerHeader}>DAY</Text>
                    <Text style={styles.pickerHeader}>YEAR</Text>
                </View>

                <View style={styles.pickersRow}>
                    <WheelPicker
                        items={MONTHS}
                        selectedIndex={monthIndex}
                        onSelect={handleMonthSelect}
                    />
                    <WheelPicker
                        items={DAYS}
                        selectedIndex={dayIndex}
                        onSelect={handleDaySelect}
                    />
                    <WheelPicker
                        items={YEARS}
                        selectedIndex={yearIndex >= 0 ? yearIndex : 15}
                        onSelect={handleYearSelect}
                    />
                </View>
            </GulperCard>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    pickerCard: {
        flex: 1,
    },
    pickerHeaders: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Spacing.md,
    },
    pickerHeader: {
        fontSize: Typography.caption.fontSize,
        fontWeight: '600',
        color: Colors.textSecondary,
        letterSpacing: 0.5,
    },
    pickersRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1,
    },
    wheelContainer: {
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
    },
    selectionIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: Colors.green,
        zIndex: 1,
        pointerEvents: 'none',
    },
    wheelItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    wheelItemText: {
        fontSize: Typography.body.fontSize,
        color: Colors.textSecondary,
    },
    wheelItemTextSelected: {
        fontSize: Typography.h2.fontSize,
        fontWeight: '700',
        color: Colors.textPrimary,
    },
});
