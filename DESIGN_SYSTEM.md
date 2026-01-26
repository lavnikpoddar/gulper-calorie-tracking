# Gulper Design System (Wise-Inspired)

## Color Tokens

### Surface Colors
- **Background**: `#F7F8FA` - Main app background
- **Surface**: `#FFFFFF` - Card backgrounds
- **Border**: `#E6E9EF` - Borders and dividers

### Text Colors
- **Primary**: `#0B1220` - Main text
- **Secondary**: `#667085` - Supporting text, labels

### Brand Colors
- **Green**: `#2DBE60` - Primary accent
- **Green Tint**: `#EAF7EF` - Light backgrounds
- **Black CTA**: `#111111` - Primary buttons
- **Disabled**: `#D5D9E2` - Disabled states

## Spacing System (4pt base)

```
--spacing-1: 4px
--spacing-2: 8px
--spacing-3: 12px
--spacing-4: 16px
--spacing-5: 20px
--spacing-6: 24px
--spacing-8: 32px
```

### Usage Guidelines
- Horizontal margins: 20px
- Card padding: 16px (default) or 20px (large)
- Section spacing: 16-24px
- Element gaps: 4-12px

## Typography Scale

### Headings
- **H1**: 28px / 34px line-height, Bold - Screen titles
- **H2**: 20px / 26px line-height, Semibold - Section titles

### Body
- **Body**: 15px / 22px line-height, Regular - Main content
- **Caption**: 12px / 16px line-height, Medium - Labels, small text

### Font Stack
SF Pro Display (iOS) or Inter (fallback)

## Border Radius

```
--radius-sm: 12px - Small elements
--radius-md: 14px - Medium elements, buttons
--radius-lg: 16px - Cards
--radius-xl: 20px - Bottom sheets, modals
```

## Component Sizing

### Buttons
- **Primary CTA**: 52px height, 14px radius
- **Secondary**: 44px height, 12px radius
- **Padding**: 16-18px horizontal

### Inputs
- **Height**: 48px
- **Radius**: 14px
- **Border**: 1px solid

### Icons
- Standard: 20-22px
- Navigation: 22px

### Bottom Navigation
- Height: 64px
- Radius: 20px
- Icons: 22px
- Labels: 11px

### Floating Action Button (FAB)
- Size: 56px × 56px
- Radius: Full (28px)
- Position: Bottom-right, 20px from edge
- Shadow: Subtle green glow

## Cards

### Structure
- Radius: 16px
- Border: 1px solid #E6E9EF
- Padding: 16px (default) or 20px (large)
- Background: White
- Shadow: Minimal or none

### Usage
- Primary content containers
- Grouping related information
- Separating sections

## Elevation

### Shadows
Minimal shadows, prefer borders:
- **Cards**: 1px border only
- **Bottom Nav**: `0 4px 16px rgba(0,0,0,0.12)`
- **FAB**: `0 8px 24px rgba(45, 190, 96, 0.4)`
- **Modals**: `0 -4px 24px rgba(0,0,0,0.1)`

## Screen Structure

### Safe Areas
- Top padding: 48-52px
- Bottom padding: 20-24px + nav height
- Side margins: 20px

### Content Flow
- Single column layout
- Max width: 393px (iPhone)
- Centered on larger screens
- Scrollable content areas

## Interactive States

### Buttons
- **Normal**: Full opacity
- **Hover**: N/A (mobile-first)
- **Active**: `scale(0.98)`
- **Disabled**: 50% opacity

### Inputs
- **Normal**: Border visible
- **Focus**: No additional styling (clean)
- **Error**: Red border (not shown in MVP)

## Components Overview

### Navigation
- Bottom pill navigation (2 tabs)
- Floating action button (add)
- Both have clear shadows for depth

### Forms
- Scale pickers with green indicator
- Segmented controls for binary choices
- Standard inputs for text/numbers

### Data Display
- Calorie ring (200px diameter)
- Calendar day rings (44px)
- Progress charts (minimal grid)
- Metric cards with clear hierarchy

### Modals
- Bottom sheet for quick actions
- Full modals for forms
- 20px corner radius
- Backdrop overlay

## Accessibility

- Minimum touch target: 44px
- Clear contrast ratios
- Readable font sizes (15px+ for body)
- Semantic HTML structure
- Focus states (keyboard navigation ready)

## Motion

- Transitions: 200-400ms
- Easing: Ease out for exits, ease in-out for transforms
- Scale feedback: 0.98 for button press
- Splash animation: Scale + fade

## Grid System

No complex grid - single column with consistent margins:
- Container: 393px max-width
- Margins: 20px left/right
- Content: Fluid within margins
- Gaps: 4/8/12/16px between elements
