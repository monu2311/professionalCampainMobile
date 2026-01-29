import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MembershipContext = createContext({
  showMembershipCard: false,
  navigateToMembership: () => {},
  logout: () => {},
  isContentLocked: false,
  checkMembershipForRoute: () => {},
  forceCheckMembership: () => {},
  membershipInfo: null,
});

export const MembershipProvider = ({ children }) => {
  const [showMembershipCard, setShowMembershipCard] = useState(false);
  const [isContentLocked, setIsContentLocked] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [membershipInfo, setMembershipInfo] = useState(null);

  const navigation = useNavigation();
  const userData = useSelector(state => state?.auth?.data?.profile?.data);
  const loginData = useSelector(state => state?.auth?.data?.login?.data);
  const profileState = useSelector(state => state?.profile);
  const profileData = profileState?.user_profile;

  const allowedProfileScreens = [
    'PersonalDetails',
    'Gallery',
    'Video',
    'EditDetails',
    'EditContact',
    'Optional',
    'SelectPlan',
    'SelectMethod',
    'PayPalWebView',
    'StripePaymentScreen',
    'Login',
    'singup',
    'ForgetPassword',
    'GetStarted',
    'PleaseSelect',
    'SplashScreen'
  ];

  // Watch for Redux state changes and re-check membership
  useEffect(() => {
    if ((userData || loginData || profileData || profileState) && currentRoute) {
      // Only log once when data first becomes available
      if (!userData && !loginData && !profileData && !profileState) {
        console.log('Redux state updated, checking membership for:', currentRoute);
      }

      // Direct call without setTimeout for better performance
      checkMembershipForRoute(currentRoute);
    }
  }, [userData, loginData, profileData, profileState]);

  const checkMembershipForRoute = async (routeName) => {
    try {
      setCurrentRoute(routeName);

      // Check Redux state FIRST (most current after login)
      let finalUserData = userData || loginData || profileData || profileState?.user_profile || profileState;

      // If we have profileState, prioritize it as it's updated by fetchProfile
      if (profileState) {
        finalUserData = profileState;
      }

      // Only fall back to AsyncStorage if Redux state is empty
      if (!finalUserData) {
        const storedUserData = await AsyncStorage.getItem('userData');
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        finalUserData = parsedUserData;
      }

      if (!finalUserData) {
        setIsContentLocked(false);
        setShowMembershipCard(false);
        return;
      }

      const profileType = finalUserData?.profile_type ||
                         finalUserData?.user?.profile_type ||
                         finalUserData?.user_profile?.profile_type;
      const membershipStatus = finalUserData?.has_active_membership ||
                              finalUserData?.user?.has_active_membership ||
                              finalUserData?.user_profile?.has_active_membership ||
                              false;
      const userCanLogin = finalUserData?.is_user_can_logged_in ||
                          finalUserData?.user?.is_user_can_logged_in ||
                          finalUserData?.user_profile?.is_user_can_logged_in;

      const isCompanion = profileType === '1' || profileType === 1;
      const isMember = profileType === '2' || profileType === 2;
      const isAllowedScreen = allowedProfileScreens.includes(routeName);

      // Check for Companion without membership
      if (isCompanion && !membershipStatus && !isAllowedScreen) {
        setIsContentLocked(true);
        setShowMembershipCard(true);
        setMembershipInfo({
          profileType: 'companion',
          isExpired: false,
        });
      }
      // Check for Member with expired membership
      else if (isMember && userCanLogin === 'Expired' && !isAllowedScreen) {
        setIsContentLocked(true);
        setShowMembershipCard(true);
        setMembershipInfo({
          profileType: 'member',
          isExpired: true,
        });
      }
      // All other cases - no restrictions
      else {
        setIsContentLocked(false);
        setShowMembershipCard(false);
        setMembershipInfo(null);
      }
    } catch (error) {
      setIsContentLocked(false);
      setShowMembershipCard(false);
    }
  };

  const navigateToMembership = () => {
    navigation.navigate('MembershipPlansScreen');
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['ChapToken', 'userData', 'account_step']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // Force membership check (useful for triggering after data updates)
  const forceCheckMembership = () => {
    if (currentRoute) {
      checkMembershipForRoute(currentRoute);
    }
  };

  const value = {
    showMembershipCard,
    navigateToMembership,
    logout,
    isContentLocked,
    checkMembershipForRoute,
    forceCheckMembership,
    membershipInfo,
  };

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
};

export const useMembershipContext = () => {
  const context = useContext(MembershipContext);
  if (context === undefined) {
    throw new Error('useMembershipContext must be used within a MembershipProvider');
  }
  return context;
};

export default MembershipContext;