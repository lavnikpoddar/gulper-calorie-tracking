// Screen 3: Height and Weight with dual scroll wheel picker
import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OnboardingLayout } from '../../components/common/OnboardingLayout';
import { GulperCard } from '../../components/common/GulperCard';
import { useOnboarding } from '../../context/OnboardingContext';
import { Colors, Typography, Spacing, BorderRadius } from '../../utils/theme';
import { OnboardingStackParamList } from '../../navigation/OnboardingNavigator';
import { cmToFeetInches, feetInchesToCm, kgToLbs, lbsToKg } from '../../utils/calculations';

type NavigationProp = StackNavigationProp<OnboardingStackParamList, 'HeightWeight'>;

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

// Generate height options
const METRIC_HEIGHTS = Array.from({ length: 81 }, (_, i) => 140 + i); // 140-220 cm
const IMPERIAL_HEIGHTS: string[] = [];
for (let ft = 4; ft <= 7; ft++) {
    for (let inch = 0; inch < 12; inch++) {
        if (ft === 4 && inch < 6) continue; // Start at 4'6"
        if (ft === 7 && inch > 2) break; // End at 7'2"
        IMPERIAL_HEIGHTS.push(`${ft}' ${inch}"`);
    }
}

// Generate weight options
const METRIC_WEIGHTS = Array.from({ length: 161 }, (_, i) => 40 + i); // 40-200 kg
const IMPERIAL_WEIGHTS = Array.from({ length: 353 }, (_, i) => 88 + i); // 88-440 lb

interface WheelPickerProps {
    items: (string | number)[];
    selectedIndex: number;
    onSelect: (index: number) => void;
    itemHeight?: number;
    formatItem?: (item: string | number) => string;
}

function WheelPicker({ items, selectedIndex, onSelect, itemHeight = ITEM_HEIGHT, formatItem }: WheelPickerProps) {
    const scrollViewRef = useRef<ScrollView>(null);
    const containerHeight = itemHeight * VISIBLE_ITEMS;
    const paddingVertical = itemHeight * Math.floor(VISIBLE_ITEMS / 2);

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / itemHeight);
        if (index >= 0 && index < items.length && index !== selectedIndex) {
            onSelect(index);
        }
    }, [items.length, itemHeight, onSelect, selectedIndex]);

    const handleMomentumEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / itemHeight);
        scrollViewRef.current?.scrollTo({ y: index * itemHeight, animated: true });
    }, [itemHeight]);

    // Scroll to initial position
    React.useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({ y: selectedIndex * itemHeight, animated: false });
        }, 100);
    }, []);

    return (
        <View style={[styles.wheelContainer, { height: containerHeight }]}>
            {/* Selection indicator */}
            <View style={[styles.selectionIndicator, { top: paddingVertical, height: itemHeight }]} />

            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={itemHeight}
                decelerationRate="fast"
                onScroll={handleScroll}
                onMomentumScrollEnd={handleMomentumEnd}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingVertical }}
            >
                {items.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                        <View key={index} style={[styles.wheelItem, { height: itemHeight }]}>
                            <Text style={[
                                styles.wheelItemText,
                                isSelected && styles.wheelItemTextSelected,
                            ]}>
                                {formatItem ? formatItem(item) : String(item)}
                            </Text>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

export function HeightWeightScreen() {
    const navigation = useNavigation<NavigationProp>();
    const { data, updateData } = useOnboarding();

    const isMetric = data.units === 'metric';

    // Calculate current indices
    const heightIndex = isMetric
        ? METRIC_HEIGHTS.indexOf(Math.round(data.height))
        : IMPERIAL_HEIGHTS.findIndex(h => {
            const { feet, inches } = cmToFeetInches(data.height);
            return h === `${feet}' ${inches}"`;
        });

    const weightIndex = isMetric
        ? METRIC_WEIGHTS.indexOf(Math.round(data.currentWeight))
        : IMPERIAL_WEIGHTS.indexOf(Math.round(kgToLbs(data.currentWeight)));

    const handleHeightSelect = (index: number) => {
        if (isMetric) {
            updateData({ height: METRIC_HEIGHTS[index] });
        } else {
            const match = IMPERIAL_HEIGHTS[index].match(/(\d+)' (\d+)"/);
            if (match) {
                updateData({ height: feetInchesToCm(parseInt(match[1]), parseInt(match[2])) });
            }
        }
    };

    const handleWeightSelect = (index: number) => {
        if (isMetric) {
            updateData({ currentWeight: METRIC_WEIGHTS[index] });
        } else {
            updateData({ currentWeight: lbsToKg(IMPERIAL_WEIGHTS[index]) });
        }
    };

    const handleBack = () => navigation.goBack();
    const handleContinue = () => navigation.navigate('BirthDate');

    return (
        <OnboardingLayout
            step={4}
            totalSteps={10}
            heading="Height & weight"
            subtext="This will be used to calibrate your custom plan."
            onBack={handleBack}
            onContinue={handleContinue}
            scrollable={false}
        >
            {/* Unit Toggle */}
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, data.units === 'imperial' && styles.toggleButtonActive]}
                    onPress={() => updateData({ units: 'imperial' })}
                >
                    <Text style={[styles.toggleText, data.units === 'imperial' && styles.toggleTextActive]}>
                        Imperial
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, data.units === 'metric' && styles.toggleButtonActive]}
                    onPress={() => updateData({ units: 'metric' })}
                >
                    <Text style={[styles.toggleText, data.units === 'metric' && styles.toggleTextActive]}>
                        Metric
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Dual Picker */}
            <GulperCard style={styles.pickerCard}>
                <View style={styles.pickerHeaders}>
                    <Text style={styles.pickerHeader}>Height</Text>
                    <Text style={styles.pickerHeader}>Weight</Text>
                </View>

                <View style={styles.pickersRow}>
                    <WheelPicker
                        items={isMetric ? METRIC_HEIGHTS : IMPERIAL_HEIGHTS}
                        selectedIndex={heightIndex >= 0 ? heightIndex : 0}
                        onSelect={handleHeightSelect}
                        formatItem={(item) => isMetric ? `${item} cm` : String(item)}
                    />
                    <WheelPicker
                        items={isMetric ? METRIC_WEIGHTS : IMPERIAL_WEIGHTS}
                        selectedIndex={weightIndex >= 0 ? weightIndex : 0}
                        onSelect={handleWeightSelect}
                        formatItem={(item) => isMetric ? `${item} kg` : `${item} lb`}
                    />
                </View>
            </GulperCard>
        </OnboardingLayout>
    );
}

const styles = StyleSheet.create({
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        gap: Spacing.sm,
    },
    toggleButton: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.border,
    },
    toggleButtonActive: {
        backgroundColor: Colors.textPrimary,
    },
    toggleText: {
        fontSize: Typography.body.fontSize,
        fontWeight: '500',
        color: Colors.textSecondary,
    },
    toggleTextActive: {
        color: Colors.white,
    },
    pickerCard: {
        flex: 1,
    },
    pickerHeaders: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: Spacing.md,
    },
    pickerHeader: {
        fontSize: Typography.body.fontSize,
        fontWeight: '600',
        color: Colors.textSecondary,
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
