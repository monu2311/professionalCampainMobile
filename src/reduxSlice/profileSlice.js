import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  };

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Optional: Manually update profile from form
    setProfile: (state, action) => {
     return { ...state, ...action.payload };
    },
  }
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;


  