// Main Tab Navigator with custom bottom bar - 3 tabs + FAB + Edit support
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/HomeScreen';
import { ProgressScreen } from '../screens/ProgressScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { UnifiedAddModal, CalendarModal } from '../components/modals';
import { useApp } from '../context/AppContext';
import { Colors, Spacing, BorderRadius, Shadows, ComponentSizes } from '../utils/theme';
import { formatDateISO } from '../utils/calculations';
import { Meal } from '../utils/storage';

type Tab = 'home' | 'progress' | 'profile';

export function MainTabNavigator() {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const [editMeal, setEditMeal] = useState<Meal | null>(null);

    const { state, addMeal, updateMeal, logWeight, setSelectedDate } = useApp();
    const { userProfile, meals, selectedDate } = state;

    if (!userProfile) return null;

    const handleDateSelect = (date: Date) => {
        setSelectedDate(formatDateISO(date));
    };

    const handleAddPress = () => {
        setEditMeal(null);
        setShowAddModal(true);
    };

    const handleEditMeal = (meal: Meal) => {
        setEditMeal(meal);
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setEditMeal(null);
    };

    const renderScreen = () => {
        switch (activeTab) {
            case 'home':
                return (
                    <HomeScreen
                        onAddPress={handleAddPress}
                        onCalendarPress={() => setShowCalendarModal(true)}
                        onEditMeal={handleEditMeal}
                    />
                );
            case 'progress':
                return <ProgressScreen />;
            case 'profile':
                return <ProfileScreen />;
        }
    };

    return (
        <View style={styles.container}>
            {/* Screen Content */}
            <View style={styles.screenContainer}>
                {renderScreen()}
            </View>

            {/* Bottom Navigation */}
            <SafeAreaView style={styles.bottomNavContainer}>
                <View style={styles.bottomNavWrapper}>
                    {/* Tab Bar Pill - fills available space */}
                    <View style={styles.tabBarPill}>
                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => setActiveTab('home')}
                        >
                            <Ionicons
                                name={activeTab === 'home' ? 'home' : 'home-outline'}
                                size={22}
                                color={activeTab === 'home' ? Colors.white : 'rgba(255,255,255,0.4)'}
                            />
                            <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
                                Home
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => setActiveTab('progress')}
                        >
                            <Ionicons
                                name={activeTab === 'progress' ? 'trending-up' : 'trending-up-outline'}
                                size={22}
                                color={activeTab === 'progress' ? Colors.white : 'rgba(255,255,255,0.4)'}
                            />
                            <Text style={[styles.tabLabel, activeTab === 'progress' && styles.tabLabelActive]}>
                                Progress
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => setActiveTab('profile')}
                        >
                            <Ionicons
                                name={activeTab === 'profile' ? 'person' : 'person-outline'}
                                size={22}
                                color={activeTab === 'profile' ? Colors.white : 'rgba(255,255,255,0.4)'}
                            />
                            <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>
                                Profile
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* FAB Button */}
                    <TouchableOpacity
                        style={styles.fab}
                        onPress={handleAddPress}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={28} color={Colors.white} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            {/* Modals */}
            <UnifiedAddModal
                visible={showAddModal}
                onClose={handleCloseModal}
                onAddMeal={addMeal}
                onLogWeight={logWeight}
                currentWeight={userProfile.currentWeight}
                units={userProfile.units}
                editMeal={editMeal}
                onUpdateMeal={updateMeal}
            />

            <CalendarModal
                visible={showCalendarModal}
                onClose={() => setShowCalendarModal(false)}
                onSelectDate={handleDateSelect}
                selectedDate={new Date(selectedDate)}
                meals={meals}
                targetCalories={userProfile.dailyCalorieTarget}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    screenContainer: {
        flex: 1,
    },
    bottomNavContainer: {
        backgroundColor: Colors.background,
    },
    bottomNavWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.md,
        gap: Spacing.md,
    },
    tabBarPill: {
        flex: 1, // Fill available space
        flexDirection: 'row',
        backgroundColor: Colors.textPrimary,
        borderRadius: BorderRadius.full,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        ...Shadows.bottomNav,
    },
    tab: {
        flex: 1, // Equal width tabs
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    },
    tabLabelActive: {
        color: Colors.white,
    },
    fab: {
        width: ComponentSizes.fabSize,
        height: ComponentSizes.fabSize,
        borderRadius: ComponentSizes.fabSize / 2,
        backgroundColor: Colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        ...Shadows.fab,
    },
});
