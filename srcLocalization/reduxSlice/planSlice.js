import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  planManagemetData: []
};

const planSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    setPlans: (state, action) => {
      return {...state,...action.payload}
      // state.planManagemetData = action.payload.planManagemetData;
    },
  },
});

export const { setPlans } = planSlice.actions;
export default planSlice.reducer;
