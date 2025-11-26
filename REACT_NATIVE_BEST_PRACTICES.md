# React Native Development Best Practices Guide

## Core Principles

### 1. **Component Philosophy**
- **Update, Don't Create**: Always refactor existing components before creating new ones
- **Single Responsibility**: Each component should have one clear purpose
- **Composition over Inheritance**: Use composition to build complex UIs
- **Keep Components Small**: Target <150 lines per component
- **Pure Components**: Prefer stateless, predictable components

### 2. **Code Organization**
```
src/
├── components/          # Reusable UI components
├── screens/            # Screen-level components
├── hooks/              # Custom hooks for business logic
├── utils/              # Pure utility functions
├── constants/          # Theme, styles, static data
└── services/           # API calls and external services
```

## Performance Best Practices

### 1. **React Hooks Optimization**
```javascript
// ✅ Good: Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ Good: Memoize callbacks to prevent re-renders
const handlePress = useCallback(() => {
  onPress(item.id);
}, [onPress, item.id]);

// ❌ Bad: Creating new objects in render
const style = { width: width * 0.8 }; // Creates new object every render
```

### 2. **Component Memoization**
```javascript
// ✅ Good: Memoize pure components
const FormField = React.memo(({ label, value, onChange }) => {
  return (
    <View>
      <Text>{label}</Text>
      <TextInput value={value} onChangeText={onChange} />
    </View>
  );
});

// ✅ Good: Custom comparison for complex props
const ListItem = React.memo(({ item, onPress }) => {
  // Component implementation
}, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id;
});
```

### 3. **FlatList Optimization**
```javascript
// ✅ Good: Optimized FlatList
<FlatList
  data={data}
  renderItem={renderItem}
  keyExtractor={keyExtractor}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={10}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

## State Management

### 1. **Custom Hooks for Business Logic**
```javascript
// ✅ Good: Extract complex logic to custom hooks
const useProfileForm = (initialData) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = useCallback(() => {
    // Validation logic
  }, [formData]);

  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    try {
      // Submit logic
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    validateForm,
    submitForm,
  };
};
```

### 2. **API Hooks Pattern**
```javascript
// ✅ Good: Dedicated hooks for API operations
const useProfileAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.updateProfile(profileData);
      showSuccessMessage('Profile Updated', 'Your profile has been updated successfully');
      return response;
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Failed to update profile';
      showErrorMessage('Update Failed', errorMessage);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    updateProfile,
    loading,
    error,
  };
};
```

## Responsive Design

### 1. **Use Custom Hooks for Dimensions**
```javascript
// ✅ Good: Centralized responsive logic
const { formFieldWidths, twoColumnLayout, spacing } = useResponsiveDimensions();

// ✅ Good: Responsive component styling
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.containerHorizontal,
    paddingVertical: spacing.sectionVertical,
  },
  twoColumnRow: {
    flexDirection: twoColumnLayout.direction,
    gap: twoColumnLayout.gap,
  },
  halfWidth: {
    width: twoColumnLayout.itemWidth,
    marginBottom: twoColumnLayout.marginBottom,
  },
});
```

### 2. **Platform-Specific Styling**
```javascript
// ✅ Good: Platform-specific styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
```

## Component Patterns

### 1. **Compound Components Pattern**
```javascript
// ✅ Good: Compound component for complex UI
const FormSection = ({ children, title, icon }) => (
  <View style={styles.sectionCard}>
    <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.sectionHeader}>
      <Icon name={icon} size={24} color={COLORS.white} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </LinearGradient>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

// Usage
<FormSection title="Personal Details" icon="person">
  <CustomDropdown label="Age" name="age" data={ageData} />
  <CustomTextInput label="Name" name="name" />
</FormSection>
```

### 2. **Render Props Pattern**
```javascript
// ✅ Good: Flexible component with render props
const ResponsiveLayout = ({ children }) => {
  const { isSmallPhone, twoColumnLayout } = useResponsiveDimensions();

  return children({ isSmallPhone, twoColumnLayout });
};

// Usage
<ResponsiveLayout>
  {({ isSmallPhone, twoColumnLayout }) => (
    <View style={{ flexDirection: twoColumnLayout.direction }}>
      {/* Conditional rendering based on screen size */}
    </View>
  )}
</ResponsiveLayout>
```

## Error Handling

### 1. **Consistent Error Handling**
```javascript
// ✅ Good: Centralized error handling
const handleAPIError = (error, operation = 'operation') => {
  const { showErrorMessage, showNetworkError } = require('../utils/messageHelpers');

  if (error?.code === 'NETWORK_ERROR' || !error?.response) {
    showNetworkError();
  } else if (error?.response?.status === 400) {
    const message = error?.response?.data?.message || `Failed to ${operation}`;
    showErrorMessage('Validation Error', message);
  } else if (error?.response?.status >= 500) {
    showErrorMessage('Server Error', 'Please try again later');
  } else {
    const message = error?.response?.data?.message || `Failed to ${operation}`;
    showErrorMessage('Error', message);
  }
};

// Usage in API hooks
try {
  const response = await api.updateProfile(data);
  return response;
} catch (error) {
  handleAPIError(error, 'update profile');
  throw error;
}
```

### 2. **Error Boundaries**
```javascript
// ✅ Good: Error boundary for graceful error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }

    return this.props.children;
  }
}
```

## Styling Best Practices

### 1. **Consistent Theme Usage**
```javascript
// ✅ Good: Use theme constants
import { COLORS, TYPOGRAPHY, PADDING } from '../constants/theme';

const styles = StyleSheet.create({
  text: {
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    fontSize: 14,
  },
  container: {
    padding: PADDING.medium,
    backgroundColor: COLORS.white,
  },
});
```

### 2. **Responsive Spacing**
```javascript
// ✅ Good: Responsive spacing using hook
const Component = () => {
  const { spacing } = useResponsiveDimensions();

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: spacing.containerHorizontal,
      paddingVertical: spacing.sectionVertical,
    },
  });

  return <View style={styles.container}>{/* content */}</View>;
};
```

## Testing Considerations

### 1. **Testable Components**
```javascript
// ✅ Good: Testable component with clear props
const ProfileForm = ({
  initialData,
  onSubmit,
  onError,
  isLoading = false
}) => {
  // Component implementation
};

// ✅ Good: Extractable business logic
const useFormValidation = (formData) => {
  return useMemo(() => {
    const errors = {};
    if (!formData.name) errors.name = 'Name is required';
    return { errors, isValid: Object.keys(errors).length === 0 };
  }, [formData]);
};
```

## Code Quality

### 1. **TypeScript Integration**
```javascript
// ✅ Good: Add TypeScript gradually
interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  error,
  required
}) => {
  // Component implementation
};
```

### 2. **Documentation**
```javascript
/**
 * Custom hook for managing profile form state and validation
 * @param {Object} initialData - Initial form data
 * @param {Function} onSubmit - Callback for form submission
 * @returns {Object} Form state and handlers
 */
const useProfileForm = (initialData, onSubmit) => {
  // Hook implementation
};
```

## Performance Monitoring

### 1. **Bundle Size Optimization**
```javascript
// ✅ Good: Lazy loading for screens
const ProfileScreen = React.lazy(() => import('./ProfileScreen'));

// ✅ Good: Conditional imports
if (__DEV__) {
  const DebugTools = require('./DebugTools');
}
```

### 2. **Memory Management**
```javascript
// ✅ Good: Cleanup in useEffect
useEffect(() => {
  const subscription = Dimensions.addEventListener('change', handleChange);
  const timeout = setTimeout(delayedAction, 1000);

  return () => {
    subscription?.remove();
    clearTimeout(timeout);
  };
}, []);
```

## Refactoring Checklist

### Before Refactoring:
- [ ] Understand the current component's purpose and dependencies
- [ ] Identify repetitive patterns and logic
- [ ] Check for existing reusable components/hooks
- [ ] Plan the refactoring approach

### During Refactoring:
- [ ] Extract business logic to custom hooks
- [ ] Use responsive design patterns
- [ ] Implement consistent error handling
- [ ] Add performance optimizations (memo, callback, useMemo)
- [ ] Maintain existing functionality
- [ ] Keep components under 150 lines

### After Refactoring:
- [ ] Test all functionality works as before
- [ ] Verify responsive behavior on different screen sizes
- [ ] Check error handling scenarios
- [ ] Ensure no console warnings/errors
- [ ] Update documentation if needed

## UI Consistency & Spacing Standards

### **The 8dp Grid System**
All spacing throughout the application MUST follow the 8dp grid system for consistent visual rhythm and professional appearance.

#### **SPACING Constants Usage**
```javascript
import { SPACING } from '../constants/theme';

// ✅ Good: Use semantic spacing constants
const styles = StyleSheet.create({
  container: {
    padding: SPACING.form.containerPadding,
    gap: SPACING.form.fieldGap,
  },
  section: {
    marginBottom: SPACING.form.sectionGap,
    paddingVertical: SPACING.component.section,
  },
});

// ❌ Bad: Hardcoded spacing values
const styles = StyleSheet.create({
  container: {
    padding: 12,        // Inconsistent
    gap: 6,            // Not following 8dp grid
  },
  section: {
    marginBottom: 15,   // Random value
    paddingVertical: 9, // Not multiples of 4
  },
});
```

#### **Form Field Spacing Rules**

##### **1. Between Form Fields**
```javascript
// ✅ Good: Consistent field spacing using FormContainer
<FormContainer spacing="form">
  <CustomTextInput name="email" />
  <CustomDropdown name="country" />
  <CustomTextInput name="phone" />
</FormContainer>

// ❌ Bad: Manual marginBottom on each field
<View>
  <CustomTextInput name="email" style={{marginBottom: 8}} />
  <CustomDropdown name="country" style={{marginBottom: 12}} />
  <CustomTextInput name="phone" style={{marginBottom: 6}} />
</View>
```

##### **2. Between Form Sections**
```javascript
// ✅ Good: Section spacing using FormContainer
<View>
  <FormSection title="Personal Details">
    <FormContainer spacing="form">
      {/* fields */}
    </FormContainer>
  </FormSection>

  <FormSection title="Contact Information">
    <FormContainer spacing="form">
      {/* fields */}
    </FormContainer>
  </FormSection>
</View>

// ❌ Bad: Inconsistent section spacing
<View>
  <View style={{marginBottom: 16}}>
    {/* section 1 */}
  </View>
  <View style={{marginBottom: 10}}>
    {/* section 2 */}
  </View>
</View>
```

#### **Component Spacing Standards**

##### **1. Form Components Must Use noMargin Prop**
```javascript
// ✅ Good: Remove default margins when using FormContainer
<FormContainer spacing="form">
  <CustomTextInput name="name" noMargin={true} />
  <CustomDropdown name="category" noMargin={true} />
</FormContainer>

// ❌ Bad: Double spacing with default margins
<FormContainer spacing="form">
  <CustomTextInput name="name" />  {/* Has built-in margin */}
  <CustomDropdown name="category" /> {/* Creates double spacing */}
</FormContainer>
```

##### **2. Responsive Spacing**
```javascript
// ✅ Good: Use responsive spacing hook
const Component = () => {
  const { spacing } = useResponsiveDimensions();

  return (
    <View style={{
      paddingHorizontal: spacing.layout.screen,
      gap: spacing.form.fieldGap,
    }}>
      {/* content */}
    </View>
  );
};

// ❌ Bad: Fixed spacing values
const Component = () => {
  return (
    <View style={{
      paddingHorizontal: 16,  // Doesn't scale
      gap: 8,                // Not responsive
    }}>
      {/* content */}
    </View>
  );
};
```

#### **Layout Spacing Guidelines**

##### **1. Two-Column Layouts**
```javascript
// ✅ Good: Use TwoColumnLayout component
<TwoColumnLayout>
  <CustomDropdown name="height" noMargin={true} />
  <CustomDropdown name="weight" noMargin={true} />
</TwoColumnLayout>

// ❌ Bad: Manual two-column implementation
<View style={{flexDirection: 'row', gap: 12}}>
  <View style={{width: '48%'}}>
    <CustomDropdown name="height" />
  </View>
  <View style={{width: '48%'}}>
    <CustomDropdown name="weight" />
  </View>
</View>
```

##### **2. Screen-Level Spacing**
```javascript
// ✅ Good: Consistent screen padding
const Screen = () => {
  const { spacing } = useResponsiveDimensions();

  return (
    <ScrollView style={{
      paddingHorizontal: spacing.layout.screen,
      paddingVertical: spacing.layout.screen,
    }}>
      {/* content */}
    </ScrollView>
  );
};
```

#### **Spacing Audit Checklist**

Before submitting any form-related code, verify:

- [ ] **No hardcoded spacing values** (2px, 6px, 10px, 15px, etc.)
- [ ] **All spacing uses SPACING constants** or responsive spacing hook
- [ ] **Form fields use `noMargin={true}`** when inside FormContainer
- [ ] **Consistent gap between form fields** (8px scaled responsively)
- [ ] **Consistent spacing between sections** (16px scaled responsively)
- [ ] **Two-column layouts use TwoColumnLayout component**
- [ ] **No mixed spacing patterns** within the same form
- [ ] **Responsive scaling** on different screen sizes

#### **Common Spacing Mistakes to Avoid**

```javascript
// ❌ NEVER: Mixed spacing values
marginBottom: 6,    // Should be 8
gap: 10,           // Should be 8 or 12
padding: 14,       // Should be 12 or 16

// ❌ NEVER: Non-4-based values
spacing: 6,        // Should be 4 or 8
margin: 10,        // Should be 8 or 12
padding: 14,       // Should be 12 or 16

// ❌ NEVER: Inconsistent section spacing
sectionA: { marginBottom: 16 },
sectionB: { marginBottom: 10 },
sectionC: { marginBottom: 20 },

// ✅ ALWAYS: Use semantic constants
sectionA: { marginBottom: spacing.form.sectionGap },
sectionB: { marginBottom: spacing.form.sectionGap },
sectionC: { marginBottom: spacing.form.sectionGap },
```

#### **Spacing Validation Tools**

Create an ESLint rule to catch hardcoded spacing:
```javascript
// .eslintrc.js
rules: {
  'no-hardcoded-spacing': 'error', // Custom rule to detect hardcoded values
  'consistent-spacing': 'warn',    // Warn about non-4-based values
}
```

## Quick Reference Commands

```bash
# Lint and format code
npm run lint
npm run format

# Type checking (if TypeScript)
npm run typecheck

# Bundle analysis
npx react-native-bundle-visualizer

# Performance profiling
npx react-native run-android --variant=release
npx react-native run-ios --configuration=Release

# Spacing audit (custom command)
npm run spacing-audit
```

---

**Remember**: The goal is to write maintainable, performant, and scalable React Native code that follows consistent patterns and can be easily understood by any developer on the team. **Consistent spacing is critical for professional UI appearance.**