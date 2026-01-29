import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useMembershipGuard = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [isContentLocked, setIsContentLocked] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userData = useSelector(state => state?.auth?.data?.profile?.data);
  const loginData = useSelector(state => state?.auth?.data?.login?.data);

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

  const isAllowedProfileScreen = allowedProfileScreens.includes(route.name);

  const checkMembershipStatus = async () => {
    try {
      setIsLoading(true);

      const storedUserData = await AsyncStorage.getItem('userData');
      const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;

      const currentUserData = userData || loginData || parsedUserData;

      if (!currentUserData) {
        setIsContentLocked(false);
        setShowMembershipModal(false);
        return;
      }

      const profileType = currentUserData?.profile_type || currentUserData?.user?.profile_type;
      const membershipStatus = currentUserData?.has_active_membership ||
                              currentUserData?.user?.has_active_membership ||
                              false;

      const isCompanion = profileType === '1' || profileType === 1;

      if (isCompanion && !membershipStatus && !isAllowedProfileScreen) {
        setIsContentLocked(true);
        setShowMembershipModal(true);
      } else {
        setIsContentLocked(false);
        setShowMembershipModal(false);
      }
    } catch (error) {
      console.error('Error checking membership status:', error);
      setIsContentLocked(false);
      setShowMembershipModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkMembershipStatus();
  }, [route.name, userData, loginData]);

  const navigateToMembership = () => {
    navigation.navigate('SelectPlan');
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['ChapToken', 'userData', 'account_step']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const refreshMembershipStatus = () => {
    checkMembershipStatus();
  };

  return {
    isContentLocked,
    showMembershipModal,
    isAllowedProfileScreen,
    isLoading,
    navigateToMembership,
    logout,
    refreshMembershipStatus,
    userData: userData || loginData,
  };
};