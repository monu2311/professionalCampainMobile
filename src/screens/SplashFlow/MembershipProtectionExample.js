import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { withMembershipProtection } from '../../hoc/withMembershipProtection';
import { COLORS, TYPOGRAPHY, PADDING } from '../../constants/theme';

// Example screen component that would be protected
const ExampleScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Protected Content</Text>
        <Text style={styles.description}>
          This content is only visible to Companions with active memberships.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Premium Features</Text>
          <Text style={styles.cardText}>
            • Access to all user profiles
            • Unlimited messaging
            • Advanced search filters
            • Priority support
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Export the protected version of the screen
export default withMembershipProtection(ExampleScreen);

// Alternative usage: You can also use it as a component wrapper
export const AlternativeUsage = () => {
  return withMembershipProtection(ExampleScreen)();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    padding: PADDING.medium,
  },
  title: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.textColor,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.placeHolderColor,
    marginBottom: 20,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: PADDING.medium,
    marginTop: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.QUICKBLOD,
    color: COLORS.specialTextColor,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.QUICKREGULAR,
    color: COLORS.textColor,
    lineHeight: 20,
  },
});

// USAGE EXAMPLES IN COMMENTS:

/*
// 1. BASIC USAGE IN NAVIGATION:
import ExampleScreen from './ExampleScreen';

// In your stack navigator:
<Stack.Screen
  name="Example"
  component={withMembershipProtection(ExampleScreen)}
/>

// 2. WITH CUSTOM NAVIGATION OPTIONS:
<Stack.Screen
  name="Example"
  component={withMembershipProtection(ExampleScreen)}
  options={{
    title: 'Protected Screen',
    headerShown: true,
  }}
/>

// 3. IN TAB NAVIGATOR:
<Tab.Screen
  name="Example"
  component={withMembershipProtection(ExampleScreen)}
  options={{
    tabBarLabel: 'Protected',
    tabBarIcon: ({ color, size }) => (
      <Icon name="lock" color={color} size={size} />
    ),
  }}
/>

// 4. CONDITIONAL PROTECTION (if needed):
const ConditionalScreen = () => {
  const { userData } = useSelector(state => state.auth);
  const ScreenComponent = userData?.profile_type === '1'
    ? withMembershipProtection(ExampleScreen)
    : ExampleScreen;

  return <ScreenComponent />;
};

// 5. TESTING THE PROTECTION:
// To test as a Companion without membership:
// - Set profile_type to "1" in user data
// - Set has_active_membership to false
//
// To test as a Companion with membership:
// - Set profile_type to "1" in user data
// - Set has_active_membership to true
//
// To test as a Member (no protection):
// - Set profile_type to "2" in user data

*/