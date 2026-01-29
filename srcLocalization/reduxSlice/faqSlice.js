import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  };

const faqSlice = createSlice({
  name: 'faq',
  initialState,
  reducers: {
    // Optional: Manually update faq from form
    setFaq: (state, action) => {
     return { ...state, ...action.payload };
    },
  }
});

export const { setFaq } = faqSlice.actions;
export default faqSlice.reducer;


  