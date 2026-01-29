/**
 * Centralized Membership Management Service
 * Handles membership status for both Companions (profile_type='1') and Members (profile_type='2')
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

// Profile type constants
export const PROFILE_TYPES = {
  COMPANION: '1',
  MEMBER: '2',
};

// Member status constants
export const MEMBER_STATUS = {
  ACTIVE: 'Active',
  EXPIRED: 'Expired',
  NOT_PURCHASED: 'Not Purchased',
};

// Storage keys
const STORAGE_KEYS = {
  MEMBERSHIP_DATA: 'membershipData',
  LAST_CHECK: 'lastMembershipCheck',
};

class MembershipService {
  constructor() {
    this.membershipData = null;
    this.listeners = new Set();
    this.currentRoute = '';
    this.isInPaymentFlow = false;
  }

  /**
   * Initialize membership service with user data
   */
  async initialize(userData) {
    try {
      if (!userData) return false;

      const membershipData = {
        profile_type: userData.profile_type || userData.user_profile?.profile_type,
        has_active_membership: userData.has_active_membership,
        is_user_can_logged_in: userData.is_user_can_logged_in,
        user_id: userData.user_id || userData.id,
        last_checked: new Date().toISOString(),
      };

      this.membershipData = membershipData;
      await this.storeMembershipData(membershipData);
      this.notifyListeners();

      return true;
    } catch (error) {
      console.error('Error initializing membership service:', error);
      return false;
    }
  }

  /**
   * Get current membership status
   */
  getMembershipStatus() {
    if (!this.membershipData) {
      return this.loadMembershipData();
    }
    return this.membershipData;
  }

  /**
   * Check if user has active membership based on profile type
   */
  async hasActiveMembership() {
    const data = await this.getMembershipStatus();
    if (!data) return false;

    const { profile_type, has_active_membership, is_user_can_logged_in } = data;

    // For Companions - check has_active_membership
    if (profile_type === PROFILE_TYPES.COMPANION) {
      return has_active_membership === true || has_active_membership === 'true';
    }

    // For Members - check is_user_can_logged_in
    if (profile_type === PROFILE_TYPES.MEMBER) {
      return is_user_can_logged_in === MEMBER_STATUS.ACTIVE;
    }

    return false;
  }

  /**
   * Check if membership is expired
   */
  async isMembershipExpired() {
    const data = await this.getMembershipStatus();
    if (!data) return false;

    const { profile_type, is_user_can_logged_in } = data;

    // Only applicable for Members
    if (profile_type === PROFILE_TYPES.MEMBER) {
      return is_user_can_logged_in === MEMBER_STATUS.EXPIRED;
    }

    return false;
  }

  /**
   * Check if user needs to purchase plan
   */
  async needsPlanPurchase() {
    const data = await this.getMembershipStatus();
    if (!data) return false;

    const { profile_type, has_active_membership, is_user_can_logged_in } = data;

    // For Companions
    if (profile_type === PROFILE_TYPES.COMPANION) {
      return !has_active_membership;
    }

    // For Members
    if (profile_type === PROFILE_TYPES.MEMBER) {
      return is_user_can_logged_in === MEMBER_STATUS.NOT_PURCHASED ||
             is_user_can_logged_in === MEMBER_STATUS.EXPIRED;
    }

    return false;
  }

  /**
   * Update membership status after payment
   */
  async updateMembershipAfterPayment(profileType) {
    try {
      const data = await this.getMembershipStatus();
      if (!data) return false;

      if (profileType === PROFILE_TYPES.COMPANION) {
        data.has_active_membership = true;
      } else if (profileType === PROFILE_TYPES.MEMBER) {
        // Check if registration is complete before setting Active status
        // account_step >= 7 means profile setup is complete
        if (data.account_step >= 7 || data.status === true) {
          data.is_user_can_logged_in = MEMBER_STATUS.ACTIVE;
        } else {
          // Registration not complete, keep as Not Purchased but mark payment done
          data.is_user_can_logged_in = MEMBER_STATUS.NOT_PURCHASED;
          data.is_plan_paid = true; // Track that payment has been made
        }
      }

      data.last_checked = new Date().toISOString();
      this.membershipData = data;
      await this.storeMembershipData(data);

      // Clear any stored dismissal data (not used anymore since modal is non-dismissible)
      await AsyncStorage.removeItem('expiredModalDismissedAt');

      this.notifyListeners();

      return true;
    } catch (error) {
      console.error('Error updating membership after payment:', error);
      return false;
    }
  }

  /**
   * Handle expired membership
   */
  async handleExpiredMembership() {
    try {
      const data = await this.getMembershipStatus();
      if (!data) return false;

      if (data.profile_type === PROFILE_TYPES.MEMBER) {
        data.is_user_can_logged_in = MEMBER_STATUS.EXPIRED;
      } else if (data.profile_type === PROFILE_TYPES.COMPANION) {
        data.has_active_membership = false;
      }

      data.last_checked = new Date().toISOString();
      this.membershipData = data;
      await this.storeMembershipData(data);
      this.notifyListeners();

      return true;
    } catch (error) {
      console.error('Error handling expired membership:', error);
      return false;
    }
  }

  /**
   * Get navigation destination based on membership status
   */
  async getNavigationDestination(accountStep, status) {
    const membershipData = await this.getMembershipStatus();
    if (!membershipData) return 'Login';

    const { profile_type, is_user_can_logged_in, is_plan_paid } = membershipData;

    // For Members
    if (profile_type === PROFILE_TYPES.MEMBER) {
      switch (is_user_can_logged_in) {
        case MEMBER_STATUS.NOT_PURCHASED:
          // Check if they've paid but haven't completed registration
          if (is_plan_paid === true) {
            // Continue with registration flow
            return this.getNavigationByAccountStep(accountStep, status);
          }
          // No payment made, go to plan selection
          return 'SelectPlan';
        case MEMBER_STATUS.EXPIRED:
          return 'SelectPlan'; // Show plan selection for expired members
        case MEMBER_STATUS.ACTIVE:
          // Continue with normal navigation based on account step
          return this.getNavigationByAccountStep(accountStep, status);
        default:
          // If status is undefined, treat as not purchased
          return 'SelectPlan';
      }
    }

    // For Companions - use normal navigation
    return this.getNavigationByAccountStep(accountStep, status);
  }

  /**
   * Get navigation based on account step
   */
  getNavigationByAccountStep(accountStep, status) {
    // This logic matches existing navigation helper
    switch (accountStep) {
      case 1:
        return 'CreateProfile1';
      case 3:
        return 'Details';
      case 4:
      case 5:
        return 'Contact';
      case 6:
        return 'Opition';
      default:
        return status ? 'Home' : 'Final';
    }
  }


  /**
   * Set current route name for tracking
   */
  setCurrentRoute(routeName) {
    this.currentRoute = routeName;

    // Track if user is in payment flow
    const paymentRoutes = [
      'SelectPlan',
      'SelectMethod',
      'PayPalWebView',
      'StripePaymentScreen',
      'MembershipPlansScreen',
      'Subscription',
      'Payment'
    ];
    this.isInPaymentFlow = paymentRoutes.includes(routeName);
  }




  /**
   * Store membership data to AsyncStorage
   */
  async storeMembershipData(data) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MEMBERSHIP_DATA, JSON.stringify(data));
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_CHECK, new Date().toISOString());
    } catch (error) {
      console.error('Error storing membership data:', error);
    }
  }

  /**
   * Load membership data from AsyncStorage
   */
  async loadMembershipData() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MEMBERSHIP_DATA);
      if (data) {
        this.membershipData = JSON.parse(data);
        return this.membershipData;
      }
      return null;
    } catch (error) {
      console.error('Error loading membership data:', error);
      return null;
    }
  }

  /**
   * Clear membership data (for logout)
   */
  async clearMembershipData() {
    try {
      this.membershipData = null;
      await AsyncStorage.multiRemove([STORAGE_KEYS.MEMBERSHIP_DATA, STORAGE_KEYS.LAST_CHECK]);
      this.notifyListeners();
    } catch (error) {
      console.error('Error clearing membership data:', error);
    }
  }

  /**
   * Add listener for membership changes
   */
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of membership changes
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.membershipData);
      } catch (error) {
        console.error('Error notifying listener:', error);
      }
    });
  }

  /**
   * Refresh membership status from server
   */
  async refreshMembershipStatus(fetchProfileFn, dispatch) {
    try {
      const profileData = await fetchProfileFn(dispatch);
      if (profileData) {
        await this.initialize(profileData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing membership status:', error);
      return false;
    }
  }
}

// Export singleton instance
const membershipService = new MembershipService();
export default membershipService;