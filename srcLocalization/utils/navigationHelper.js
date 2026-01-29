/**
 * Navigation Helper Utilities
 * Handles complex navigation logic based on user authentication state
 */

/**
 * Navigation Routes Constants
 */
export const ROUTES = {
  // Authentication Flow
  LOGIN: 'Login',
  SIGNUP: 'singup',
  FORGOT_PASSWORD: 'ForgetPassword',

  // Profile Setup Flow
  CREATE_PROFILE: 'CreateProfile',
  CREATE_PROFILE_1: 'CreateProfile1',
  DETAILS: 'Details',
  CONTACT: 'Contact',
  OPTION: 'Opition',
  FINAL: 'Final',

  // Main App
  HOME: 'Home',
  SELECT_PLAN: 'SelectPlan',
};

/**
 * Account Step Constants
 */
export const ACCOUNT_STEPS = {
  INITIAL: 0,
  PROFILE_CREATION: 1,
  BASIC_INFO: 2,
  DETAILS: 3,
  CONTACT: 4,
  ADDITIONAL_INFO: 5,
  OPTIONS: 6,
  COMPLETED: 7,
};

/**
 * Profile Type Constants
 */
export const PROFILE_TYPES = {
  COMPANION: 1,
  MEMBER: 2,
};

/**
 * Determine navigation destination based on login response
 * @param {Object} userDetails - User details from login response
 * @param {Function} navigation - Navigation object
 * @returns {string} Route to navigate to
 */
export const getPostLoginNavigation = (userDetails, navigation) => {
  try {
    if (!userDetails || !navigation) {
      throw new Error('User details and navigation are required');
    }

    const {
      account_step,
      is_plan_purchased,
      profile_type,
      status
    } = userDetails;

    // Check if member needs to purchase plan
    if (!is_plan_purchased && profile_type === PROFILE_TYPES.MEMBER) {
      return ROUTES.SELECT_PLAN;
    }

    // Navigate based on account setup step
    switch (account_step) {
      case ACCOUNT_STEPS.PROFILE_CREATION:
        return ROUTES.CREATE_PROFILE_1;

      case ACCOUNT_STEPS.DETAILS:
        return ROUTES.DETAILS;

      case ACCOUNT_STEPS.CONTACT:
      case ACCOUNT_STEPS.ADDITIONAL_INFO:
        return ROUTES.CONTACT;

      case ACCOUNT_STEPS.OPTIONS:
        return ROUTES.OPTION;

      default:
        // Check if profile is approved/active
        if (status) {
          return ROUTES.HOME;
        }

        // Profile needs final approval
        return ROUTES.FINAL;
    }
  } catch (error) {
    console.error('Error determining post-login navigation:', error);
    // Fallback to home or create profile
    return ROUTES.CREATE_PROFILE;
  }
};

/**
 * Navigate to appropriate screen after login
 * @param {Object} userDetails - User details from login response
 * @param {Function} navigation - Navigation object
 * @returns {boolean} Success status
 */
export const navigatePostLogin = (userDetails, navigation) => {
  try {
    const destination = getPostLoginNavigation(userDetails, navigation);

    // Special case for Final screen that needs parametersP
    if (destination === ROUTES.FINAL) {
      navigation.navigate(destination, {
        value: userDetails?.status || 2,
      });
    } else {
      navigation.navigate(destination);
    }

    return true;
  } catch (error) {
    console.error('Error navigating post login:', error);
    return false;
  }
};

/**
 * Get progress percentage based on account step
 * @param {number} accountStep - Current account step
 * @returns {number} Progress percentage (0-100)
 */
export const getSetupProgress = (accountStep) => {
  const maxSteps = ACCOUNT_STEPS.COMPLETED;
  const progress = Math.min(accountStep, maxSteps) / maxSteps;
  return Math.round(progress * 100);
};

/**
 * Get setup step description
 * @param {number} accountStep - Current account step
 * @returns {string} Step description
 */
export const getSetupStepDescription = (accountStep) => {
  const descriptions = {
    [ACCOUNT_STEPS.INITIAL]: 'Getting Started',
    [ACCOUNT_STEPS.PROFILE_CREATION]: 'Creating Profile',
    [ACCOUNT_STEPS.BASIC_INFO]: 'Basic Information',
    [ACCOUNT_STEPS.DETAILS]: 'Profile Details',
    [ACCOUNT_STEPS.CONTACT]: 'Contact Information',
    [ACCOUNT_STEPS.ADDITIONAL_INFO]: 'Additional Information',
    [ACCOUNT_STEPS.OPTIONS]: 'Profile Options',
    [ACCOUNT_STEPS.COMPLETED]: 'Profile Complete',
  };

  return descriptions[accountStep] || 'Unknown Step';
};

/**
 * Check if user can access a specific route
 * @param {string} route - Route to check access for
 * @param {Object} userDetails - User details
 * @returns {boolean} Access permission
 */
export const canAccessRoute = (route, userDetails) => {
  if (!userDetails) {
    return false;
  }

  const { account_step, status } = userDetails;

  // Routes that require completed profile
  const completedProfileRoutes = [ROUTES.HOME];

  if (completedProfileRoutes.includes(route)) {
    return status === true || account_step >= ACCOUNT_STEPS.COMPLETED;
  }

  // Most routes are accessible during setup
  return true;
};

/**
 * Get next step in profile setup
 * @param {number} currentStep - Current account step
 * @returns {string|null} Next route or null if completed
 */
export const getNextSetupStep = (currentStep) => {
  const stepRoutes = {
    [ACCOUNT_STEPS.INITIAL]: ROUTES.CREATE_PROFILE,
    [ACCOUNT_STEPS.PROFILE_CREATION]: ROUTES.CREATE_PROFILE_1,
    [ACCOUNT_STEPS.BASIC_INFO]: ROUTES.DETAILS,
    [ACCOUNT_STEPS.DETAILS]: ROUTES.CONTACT,
    [ACCOUNT_STEPS.CONTACT]: ROUTES.OPTION,
    [ACCOUNT_STEPS.ADDITIONAL_INFO]: ROUTES.OPTION,
    [ACCOUNT_STEPS.OPTIONS]: ROUTES.FINAL,
  };

  return stepRoutes[currentStep] || null;
};

/**
 * Reset navigation to login (used for logout)
 * @param {Function} navigation - Navigation object
 * @returns {boolean} Success status
 */
export const resetToLogin = (navigation) => {
  try {
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.LOGIN }],
    });
    return true;
  } catch (error) {
    console.error('Error resetting to login:', error);
    return false;
  }
};

/**
 * Navigate to home and clear stack
 * @param {Function} navigation - Navigation object
 * @returns {boolean} Success status
 */
export const navigateToHome = (navigation) => {
  try {
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.HOME }],
    });
    return true;
  } catch (error) {
    console.error('Error navigating to home:', error);
    return false;
  }
};