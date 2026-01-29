import AsyncStorage from '@react-native-async-storage/async-storage';

export const PROFILE_TYPES = {
  COMPANION: '1',
  MEMBER: '2',
};

export const MEMBERSHIP_STORAGE_KEY = 'membershipData';

export const ALLOWED_PROFILE_SCREENS = [
  'PersonalDetails',
  'Gallery',
  'Video',
  'EditDetails',
  'EditContact',
  'Optional',
];

export const ALWAYS_ALLOWED_SCREENS = [
  'SelectPlan',
  'SelectMethod',
  'PayPalWebView',
  'StripePaymentScreen',
  'Login',
  'singup',
  'ForgetPassword',
  'GetStarted',
  'PleaseSelect',
  'SplashScreen',
];

export const checkIsCompanion = (userData) => {
  if (!userData) return false;

  const profileType = userData?.profile_type ||
                      userData?.user?.profile_type ||
                      userData?.data?.profile_type;

  return profileType === PROFILE_TYPES.COMPANION || profileType === 1;
};

export const checkHasMembership = (userData) => {
  if (!userData) return false;

  return userData?.has_active_membership ||
         userData?.user?.has_active_membership ||
         userData?.data?.has_active_membership ||
         false;
};

export const storeMembershipStatus = async (hasActiveMembership) => {
  try {
    const membershipData = {
      has_active_membership: hasActiveMembership,
      updated_at: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      MEMBERSHIP_STORAGE_KEY,
      JSON.stringify(membershipData)
    );
    return true;
  } catch (error) {
    console.error('Error storing membership status:', error);
    return false;
  }
};

export const getMembershipStatus = async () => {
  try {
    const data = await AsyncStorage.getItem(MEMBERSHIP_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.has_active_membership;
    }
    return null;
  } catch (error) {
    console.error('Error getting membership status:', error);
    return null;
  }
};

export const clearMembershipData = async () => {
  try {
    await AsyncStorage.removeItem(MEMBERSHIP_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing membership data:', error);
    return false;
  }
};

export const shouldShowProtection = (userData, currentRoute) => {
  const isCompanion = checkIsCompanion(userData);
  const hasMembership = checkHasMembership(userData);
  const isAllowedScreen = [...ALLOWED_PROFILE_SCREENS, ...ALWAYS_ALLOWED_SCREENS].includes(currentRoute);

  return isCompanion && !hasMembership && !isAllowedScreen;
};

export const getMembershipExpiryDate = (userData) => {
  return userData?.membership_expiry ||
         userData?.user?.membership_expiry ||
         userData?.data?.membership_expiry ||
         null;
};

export const isMembershipExpired = (expiryDate) => {
  if (!expiryDate) return true;

  try {
    const expiry = new Date(expiryDate);
    const now = new Date();
    return expiry < now;
  } catch (error) {
    console.error('Error checking membership expiry:', error);
    return true;
  }
};

export const getDaysUntilExpiry = (expiryDate) => {
  if (!expiryDate) return 0;

  try {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  } catch (error) {
    console.error('Error calculating days until expiry:', error);
    return 0;
  }
};

export const formatMembershipData = (userData) => {
  if (!userData) return null;

  return {
    isCompanion: checkIsCompanion(userData),
    hasMembership: checkHasMembership(userData),
    expiryDate: getMembershipExpiryDate(userData),
    isExpired: isMembershipExpired(getMembershipExpiryDate(userData)),
    daysRemaining: getDaysUntilExpiry(getMembershipExpiryDate(userData)),
    profileType: userData?.profile_type || userData?.user?.profile_type,
    userId: userData?.id || userData?.user?.id,
  };
};