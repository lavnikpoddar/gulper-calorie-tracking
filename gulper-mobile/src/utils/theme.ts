// Gulper Design System
// Based on Apple Fitness aesthetic with Gulper brand colors

export const Colors = {
  // Brand
  green: '#2DBE60',
  greenTint: '#EAF7EF',
  greenDark: '#25A854',
  
  // Surfaces
  background: '#F7F8FA',
  surface: '#FFFFFF',
  border: '#E6E9EF',
  
  // Text
  textPrimary: '#0B1220',
  textSecondary: '#667085',
  textDisabled: '#9CA3AF',
  
  // CTAs
  ctaBlack: '#111111',
  ctaDisabled: '#D5D9E2',
  
  // BMI Colors
  bmiUnder: '#60A5FA',
  bmiHealthy: '#5EC26A',
  bmiOver: '#FBBF24',
  bmiObese: '#EF4444',
  
  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  captionSmall: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500' as const,
  },
  large: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '700' as const,
  },
  huge: {
    fontSize: 52,
    lineHeight: 60,
    fontWeight: '700' as const,
  },
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bottomNav: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  fab: {
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 8,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 16,
  },
};

export const ComponentSizes = {
  buttonHeight: 52,
  buttonHeightSecondary: 44,
  inputHeight: 48,
  navBarHeight: 64,
  fabSize: 56,
  iconSize: 22,
  iconSizeSmall: 18,
  calendarDaySize: 48,
  calorieRingSize: 200,
  calorieRingStroke: 10,
};
