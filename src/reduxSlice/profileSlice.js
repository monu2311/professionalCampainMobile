import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_profile: null,
  has_active_membership: false,
  is_user_can_logged_in: null, // 'Active' | 'Expired' | 'Not Purchased'
  is_plan_purchased: false,
  user_availability: [],
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Set complete profile data
    setProfile: (state, action) => {
      return { ...state, ...action.payload };
    },

    // Update membership status for Members (profile_type = '2')
    updateMemberStatus: (state, action) => {
      state.is_user_can_logged_in = action.payload;
    },

    // Update membership status for Companions (profile_type = '1')
    updateCompanionMembership: (state, action) => {
      state.has_active_membership = action.payload;
    },

    // Update both membership fields at once
    updateMembershipStatus: (state, action) => {
      const { has_active_membership, is_user_can_logged_in } = action.payload;
      if (has_active_membership !== undefined) {
        state.has_active_membership = has_active_membership;
      }
      if (is_user_can_logged_in !== undefined) {
        state.is_user_can_logged_in = is_user_can_logged_in;
      }
    },

    // Handle membership expiration
    setMembershipExpired: (state) => {
      const profileType = state.user_profile?.profile_type;
      if (profileType === '2') {
        state.is_user_can_logged_in = 'Expired';
      } else if (profileType === '1') {
        state.has_active_membership = false;
      }
    },

    // Handle successful plan purchase
    setPlanPurchased: (state) => {
      const profileType = state.user_profile?.profile_type;
      if (profileType === '2') {
        state.is_user_can_logged_in = 'Active';
        state.is_plan_purchased = true;
      } else if (profileType === '1') {
        state.has_active_membership = true;
      }
    },

    clearProfile: () => initialState
  }
});

export const {
  setProfile,
  updateMemberStatus,
  updateCompanionMembership,
  updateMembershipStatus,
  setMembershipExpired,
  setPlanPurchased,
  clearProfile
} = profileSlice.actions;

export default profileSlice.reducer;


  