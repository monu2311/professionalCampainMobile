# Professional Companionship App - UI Component Specifications

## Table of Contents
1. [Design System](#design-system)
2. [Form Components](#form-components)
3. [Navigation Components](#navigation-components)
4. [Card Components](#card-components)
5. [Modal Components](#modal-components)
6. [Button Components](#button-components)
7. [List Components](#list-components)
8. [Animation Patterns](#animation-patterns)
9. [Platform Guidelines](#platform-guidelines)

## Design System

### Color Palette
```javascript
const COLORS = {
  // Primary Colors
  primary: '#5B5FCF',           // Deep purple-blue
  secondary: '#4a4db8',         // Medium purple
  tertiary: '#6366f1',          // Light purple

  // Accent Colors
  gold: '#FFD700',              // VIP/Premium elements
  success: '#00CB07',           // Online/Available status
  warning: '#FFC107',           // Available today
  danger: '#FF4444',            // Error states

  // Neutral Colors
  black: '#000000',
  white: '#FFFFFF',
  background: '#f8fafc',        // App background
  cardBackground: '#FFFFFF',

  // Text Colors
  textColor: '#2C3E50',         // Primary text
  labelColor: '#7F8C8D',        // Form labels
  placeHolderColor: '#95A5A6',  // Placeholder text

  // Border Colors
  borderColor: '#E0E0E0',       // Default borders
  selectBorder: '#D3D3D3',      // Select dropdowns
  focusBorder: '#5B5FCF',       // Focused inputs
  errorBorder: '#FF4444',       // Error states

  // Special Colors
  modalBackdrop: 'rgba(0,0,0,0.8)',
  glassEffect: 'rgba(255,255,255,0.1)',
  shadowColor: '#000000',
};
```

### Typography
```javascript
const TYPOGRAPHY = {
  // Font Families
  QUICKBOLD: 'Quicksand-Bold',
  QUICKREGULAR: 'Quicksand-Regular',

  // Font Sizes
  heading1: 28,
  heading2: 24,
  heading3: 20,
  heading4: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tiny: 10,

  // Line Heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,

  // Font Weights
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};
```

### Spacing System
```javascript
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const PADDING = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};

const MARGINS = {
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
};
```

### Shadow System
```javascript
// iOS Shadows
const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
};

// Android Elevation
const ELEVATION = {
  small: 3,
  medium: 6,
  large: 12,
  modal: 24,
};
```

## Form Components

### CustomTextInput
**Purpose**: Reusable text input with Formik integration

```typescript
interface CustomTextInputProps {
  name: string;                    // Formik field name
  label?: string;                  // Floating label
  placeholder?: string;            // Placeholder text
  keyboardType?: KeyboardType;    // Keyboard type
  secureTextEntry?: boolean;       // Password field
  leftIcon?: ReactNode;            // Left icon
  rightIcon?: ReactNode;           // Right icon
  editable?: boolean;              // Editable state
  multiline?: boolean;             // Multiline support
  maxLength?: number;              // Max character length
  style?: ViewStyle;               // Container style
  inputStyle?: TextStyle;          // Input style
}
```

**Features**:
- Animated floating labels
- Error state with red border
- Focus/blur visual feedback
- Clear button on filled state
- Character counter for maxLength
- Icon support (left/right)

**Usage**:
```jsx
<CustomTextInput
  name="email"
  label="Email Address"
  placeholder="Enter your email"
  keyboardType="email-address"
  leftIcon={<Icon name="email" />}
/>
```

### CustomDropdown
**Purpose**: Single selection dropdown with search

```typescript
interface CustomDropdownProps {
  name: string;                    // Formik field name
  label?: string;                  // Floating label
  placeholder?: string;            // Placeholder text
  data: Array<{                    // Data array
    item: string;
    value: string | number;
  }>;
  searchable?: boolean;            // Enable search
  onSelect?: (value: any) => void; // Selection callback
  style?: ViewStyle;               // Container style
}
```

**Features**:
- Search functionality for long lists
- Error state styling
- Smooth open/close animations
- Custom item rendering
- Loading state support
- Keyboard navigation

**Usage**:
```jsx
<CustomDropdown
  name="category"
  label="Category"
  placeholder="Select category"
  data={categories}
  searchable={true}
  onSelect={(value) => console.log(value)}
/>
```

### MultiDropDown
**Purpose**: Multiple selection dropdown with chips

```typescript
interface MultiDropDownProps {
  name: string;                    // Formik field name
  label?: string;                  // Floating label
  placeholder?: string;            // Placeholder text
  data: Array<{                    // Data array
    item: string;
    value: string | number;
  }>;
  maxSelection?: number;           // Max selections allowed
  chipDisplay?: 'inline' | 'wrap'; // Chip display mode
  style?: ViewStyle;               // Container style
}
```

**Features**:
- Chip display for selected items
- "+X more" for many selections
- Select all/Clear all buttons
- Search within dropdown
- Smooth animations
- Performance optimized for large lists

**Usage**:
```jsx
<MultiDropDown
  name="services"
  label="Services"
  placeholder="Select services"
  data={services}
  maxSelection={5}
  chipDisplay="wrap"
/>
```

### TextArea
**Purpose**: Multi-line text input with character counter

```typescript
interface TextAreaProps {
  name: string;                    // Formik field name
  label?: string;                  // Label
  placeholder?: string;            // Placeholder
  maxLength?: number;              // Max characters
  minHeight?: number;              // Min height
  maxHeight?: number;              // Max height
  autoGrow?: boolean;              // Auto resize
  style?: ViewStyle;               // Container style
}
```

**Features**:
- Character counter (X/MaxLength)
- Auto-resize option
- Error state display
- Formik integration
- Scroll when content exceeds maxHeight

**Usage**:
```jsx
<TextArea
  name="description"
  label="Description"
  placeholder="Tell us about yourself"
  maxLength={500}
  autoGrow={true}
  minHeight={100}
/>
```

### RichTextEditor
**Purpose**: Rich text editing with formatting toolbar

```typescript
interface RichTextEditorProps {
  name: string;                    // Formik field name
  placeholder?: string;            // Placeholder
  toolbar?: ToolbarAction[];      // Toolbar actions
  minHeight?: number;              // Min height
  maxHeight?: number;              // Max height
  onChange?: (html: string) => void; // Change callback
}
```

**Features**:
- Bold, Italic, Underline
- Lists (bullet, numbered)
- Alignment options
- Link insertion
- Image insertion
- HTML output
- Formik integration

**Usage**:
```jsx
<RichTextEditor
  name="bio"
  placeholder="Write your bio"
  toolbar={['bold', 'italic', 'list']}
  minHeight={200}
/>
```

## Navigation Components

### Custom Header
```jsx
const CustomHeader = {
  height: 56,
  backgroundColor: COLORS.white,
  shadowColor: COLORS.shadowColor,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 4,

  title: {
    fontFamily: TYPOGRAPHY.QUICKBOLD,
    fontSize: 18,
    color: COLORS.textColor,
  },

  backButton: {
    size: 24,
    color: COLORS.primary,
    padding: 16,
  },

  rightActions: {
    padding: 16,
    spacing: 8,
  },
};
```

### Tab Bar
```jsx
const TabBar = {
  height: 60,
  backgroundColor: COLORS.white,
  borderTopWidth: 1,
  borderTopColor: COLORS.borderColor,

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    size: 24,
    activeColor: COLORS.primary,
    inactiveColor: COLORS.placeHolderColor,
  },

  label: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontSize: 12,
    activeColor: COLORS.primary,
    inactiveColor: COLORS.placeHolderColor,
  },

  indicator: {
    height: 2,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    top: 0,
  },
};
```

## Card Components

### ProfileCard
**Purpose**: Instagram/Tinder-inspired profile card

```jsx
const ProfileCard = {
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    ...SHADOWS.medium,
  },

  image: {
    width: '100%',
    height: 400,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    colors: ['transparent', 'rgba(0,0,0,0.8)'],
  },

  content: {
    padding: 16,
  },

  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  onlineIndicator: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
};
```

### ChatCard
```jsx
const ChatCard = {
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    fontFamily: TYPOGRAPHY.QUICKBOLD,
    fontSize: 16,
    color: COLORS.textColor,
    marginBottom: 4,
  },

  message: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontSize: 14,
    color: COLORS.placeHolderColor,
    numberOfLines: 1,
  },

  time: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    fontSize: 12,
    color: COLORS.placeHolderColor,
  },

  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
```

## Modal Components

### Bottom Sheet Modal
```jsx
const BottomSheet = {
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.modalBackdrop,
    zIndex: 9999,
  },

  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 10000,
    maxHeight: '80%',
  },

  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.borderColor,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 12,
  },

  content: {
    padding: 24,
  },

  animation: {
    entering: 'slideInUp',
    exiting: 'slideOutDown',
    duration: 300,
  },
};
```

### Filter Modal
```jsx
const FilterModal = {
  container: {
    ...BottomSheet.container,
    maxHeight: '70%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },

  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },

  chip: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  activeChip: {
    backgroundColor: COLORS.primary,
  },

  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
};
```

## Button Components

### Primary Button
```jsx
const PrimaryButton = {
  container: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },

  text: {
    fontFamily: TYPOGRAPHY.QUICKBOLD,
    fontSize: 16,
    color: COLORS.white,
  },

  disabled: {
    backgroundColor: COLORS.placeHolderColor,
    opacity: 0.6,
  },

  loading: {
    opacity: 0.8,
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
};
```

### Gradient Button
```jsx
const GradientButton = {
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    ...SHADOWS.small,
  },

  gradient: {
    colors: [COLORS.primary, COLORS.secondary, COLORS.tertiary],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontFamily: TYPOGRAPHY.QUICKBOLD,
    fontSize: 16,
    color: COLORS.white,
  },
};
```

### Floating Action Button
```jsx
const FAB = {
  container: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1001,
    ...SHADOWS.large,
  },

  icon: {
    size: 24,
    color: COLORS.white,
  },

  extended: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    width: 'auto',
  },

  label: {
    marginLeft: 8,
    fontFamily: TYPOGRAPHY.QUICKBOLD,
    fontSize: 14,
    color: COLORS.white,
  },
};
```

## List Components

### FlatList Optimization
```jsx
const OptimizedList = {
  props: {
    initialNumToRender: 5,
    maxToRenderPerBatch: 5,
    windowSize: 10,
    removeClippedSubviews: true,
    updateCellsBatchingPeriod: 50,
    getItemLayout: (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.borderColor,
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },

  loadingState: {
    padding: 20,
    alignItems: 'center',
  },

  refreshControl: {
    colors: [COLORS.primary],
    tintColor: COLORS.primary,
  },
};
```

## Animation Patterns

### Entrance Animations
```javascript
// Fade In
const fadeIn = {
  from: { opacity: 0 },
  to: { opacity: 1 },
  duration: 300,
  useNativeDriver: true,
};

// Slide In
const slideIn = {
  from: {
    translateX: width,
    opacity: 0,
  },
  to: {
    translateX: 0,
    opacity: 1,
  },
  duration: 400,
  useNativeDriver: true,
};

// Scale In
const scaleIn = {
  from: {
    scale: 0.8,
    opacity: 0,
  },
  to: {
    scale: 1,
    opacity: 1,
  },
  duration: 300,
  useNativeDriver: true,
};

// Staggered List Items
const staggeredAnimation = (index) => ({
  from: {
    translateY: 50,
    opacity: 0,
  },
  to: {
    translateY: 0,
    opacity: 1,
  },
  duration: 400,
  delay: index * 100,
  useNativeDriver: true,
});
```

### Interactive Animations
```javascript
// Press Animation
const pressAnimation = {
  toValue: 0.95,
  duration: 100,
  useNativeDriver: true,
};

// Spring Animation
const springAnimation = {
  toValue: 1,
  tension: 100,
  friction: 8,
  useNativeDriver: true,
};

// Bounce Animation
const bounceAnimation = {
  toValue: 1,
  velocity: 3,
  tension: 40,
  friction: 8,
  useNativeDriver: true,
};
```

### Gesture Animations
```javascript
// Swipe to Delete
const swipeAnimation = {
  snapPoints: [-100, 0],
  overshootLeft: false,
  overshootRight: true,
  backgroundColor: COLORS.danger,
};

// Pull to Refresh
const pullToRefresh = {
  threshold: 100,
  maxPull: 150,
  springConfig: {
    damping: 15,
    mass: 1,
    stiffness: 120,
  },
};

// Drag and Drop
const dragAnimation = {
  activateAfterLongPress: 300,
  activationDistance: 10,
  itemScale: 1.1,
  itemOpacity: 0.8,
};
```

## Platform Guidelines

### iOS Specific
```javascript
const iOS = {
  // Status Bar
  statusBar: {
    barStyle: 'dark-content',
    backgroundColor: 'transparent',
    translucent: true,
  },

  // Safe Area
  safeArea: {
    top: true,
    bottom: true,
    edges: ['top', 'bottom'],
  },

  // Haptic Feedback
  haptic: {
    impactLight: 'impactLight',
    impactMedium: 'impactMedium',
    impactHeavy: 'impactHeavy',
    selection: 'selection',
    notificationSuccess: 'notificationSuccess',
  },

  // Navigation
  navigation: {
    largeTitle: true,
    headerBlurEffect: 'regular',
    gestureEnabled: true,
  },
};
```

### Android Specific
```javascript
const Android = {
  // Status Bar
  statusBar: {
    barStyle: 'dark-content',
    backgroundColor: COLORS.white,
    translucent: false,
  },

  // Navigation Bar
  navigationBar: {
    backgroundColor: COLORS.white,
    dividerColor: COLORS.borderColor,
  },

  // Material Design
  material: {
    rippleColor: 'rgba(0,0,0,0.1)',
    elevation: true,
    overScrollMode: 'always',
  },

  // Back Handler
  backHandler: {
    exitApp: true,
    gestureEnabled: false,
  },
};
```

## Component Usage Examples

### Complete Form Example
```jsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  CustomTextInput,
  CustomDropdown,
  MultiDropDown,
  TextArea,
  RichTextEditor,
  PrimaryButton,
} from '../components';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Min 8 characters').required('Required'),
  category: Yup.string().required('Required'),
  services: Yup.array().min(1, 'Select at least one'),
  bio: Yup.string().max(500, 'Max 500 characters'),
  description: Yup.string().required('Required'),
});

const FormScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          email: '',
          password: '',
          category: '',
          services: [],
          bio: '',
          description: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleSubmit, isSubmitting }) => (
          <View style={styles.form}>
            <CustomTextInput
              name="email"
              label="Email"
              placeholder="Enter email"
              keyboardType="email-address"
            />

            <CustomTextInput
              name="password"
              label="Password"
              placeholder="Enter password"
              secureTextEntry
            />

            <CustomDropdown
              name="category"
              label="Category"
              placeholder="Select category"
              data={categories}
              searchable
            />

            <MultiDropDown
              name="services"
              label="Services"
              placeholder="Select services"
              data={services}
              maxSelection={5}
            />

            <TextArea
              name="bio"
              label="Bio"
              placeholder="Tell us about yourself"
              maxLength={500}
              autoGrow
            />

            <RichTextEditor
              name="description"
              placeholder="Detailed description"
              minHeight={200}
            />

            <PrimaryButton
              title="Submit"
              onPress={handleSubmit}
              loading={isSubmitting}
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};
```

## Accessibility Guidelines

### Component Accessibility
```jsx
const AccessibleComponent = {
  // Labels
  accessibilityLabel: "Button label",
  accessibilityHint: "Tap to perform action",
  accessibilityRole: "button",

  // States
  accessibilityState: {
    disabled: false,
    selected: false,
    checked: false,
    busy: false,
    expanded: false,
  },

  // Values
  accessibilityValue: {
    min: 0,
    max: 100,
    now: 50,
    text: "50 percent",
  },

  // Actions
  accessibilityActions: [
    { name: 'activate', label: 'Activate' },
    { name: 'increment', label: 'Increment' },
    { name: 'decrement', label: 'Decrement' },
  ],

  // Live Regions
  accessibilityLiveRegion: 'polite', // 'none' | 'polite' | 'assertive'

  // Import for Screen Readers
  importantForAccessibility: 'yes', // 'auto' | 'yes' | 'no' | 'no-hide-descendants'
};
```

---

Last Updated: 2025-09-28
Version: 1.0.0