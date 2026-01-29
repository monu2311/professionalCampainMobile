/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
} from 'react-native';
import {COLORS, PADDING, TYPOGRAPHY} from '../../constants/theme';
import LinearGradient from 'react-native-linear-gradient';
import {ICONS} from '../../constants/Icons';
import ButtonWrapper from '../../components/ButtonWrapper';
import {defaultStyles} from '../../constants/Styles';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Faq from './Faq';
import { useSelector } from 'react-redux';
import PackageScreen from './PackageScreen';
import { getUserData } from '../../utils/authHelpers';

const Tab = createMaterialTopTabNavigator();


const CustomTabBar = ({state, descriptors, navigation, position}) => {
  const isOnlyOneTab = state.routes.length === 1;

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: isOnlyOneTab ? 'flex-start' : 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.boxColor, // Bottom underline color
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;

        const isFocused = state.index === index;

        return (
          <Pressable
            key={index}
            style={{
              flex: isOnlyOneTab ? 0 : 1,
              alignItems: 'center',
              paddingVertical: 10,
              paddingHorizontal: isOnlyOneTab ? 20 : 0,
              borderBottomColor: isFocused ? COLORS.mainColor : 'transparent',
              borderBottomWidth: 1,
            }}
            onPress={() => navigation.navigate(route.name)}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: isFocused ? '#0057B7' : 'gray',
                fontFamily: TYPOGRAPHY.DMSERIF,
                // textDecorationLine: isFocused ? 'underline' : 'none',
              }}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const AdvertisingRate = () => {

  const plansData = useSelector((state)=>state.planData?.plans);

  // Get user profile data from Redux
  const profileData = useSelector(state => state.profile?.user_profile);
  const userData = useSelector(state => state.profile?.data);

  // State for stored user data fallback
  const [storedUserData, setStoredUserData] = useState(null);

  // Load stored user data on component mount
  useEffect(() => {
    const loadStoredUserData = async () => {
      try {
        const stored = await getUserData();
        console.log('AdvertisingRate: Loaded stored user data:', stored);
        setStoredUserData(stored);
      } catch (error) {
        console.error('AdvertisingRate: Error loading stored user data:', error);
      }
    };
    loadStoredUserData();
  }, []);

  // User data resolution with fallbacks
  const resolveUserData = () => {
    const fallbackData = {
      profile_type: profileData?.profile_type || userData?.profile_type || storedUserData?.profile_type,
    };

    console.log('AdvertisingRate: Resolved user data:', fallbackData);
    return fallbackData;
  };

  const resolvedUserData = resolveUserData();
  const isMember = parseInt(resolvedUserData?.profile_type) === 2;

  console.log('AdvertisingRate: User is member?', isMember, 'Profile type:', resolvedUserData?.profile_type);

  return (
    <View
      style={{backgroundColor: COLORS.white, padding: 5, flex: 1,paddingHorizontal:16}}

    >
      <Tab.Navigator tabBar={props => <CustomTabBar {...props} />}>
        {/* Conditionally render Packages tab - hide for members (profile_type: 2) */}
        {!isMember && (
          <Tab.Screen name="Packages" component={PackageScreen} />
        )}
        <Tab.Screen name="FAQ" component={Faq} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  flexstyle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: PADDING.medium,
    paddingHorizontal: PADDING.large,
  },
  circleBox: {
    backgroundColor: COLORS.mainColor,
    width: 30,
    height: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdvertisingRate;
