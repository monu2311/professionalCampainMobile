import { configureStore } from "@reduxjs/toolkit";
import apiSlice from '../reduxSlice/apiSlice';
import profileSlice from '../reduxSlice/profileSlice';
import listSlice from '../reduxSlice/listSlice';
import planSlice from '../reduxSlice/planSlice';
import faqSlice from '../reduxSlice/faqSlice';


const store = configureStore({
    reducer: {
       auth:apiSlice,
       profile:profileSlice,
       dropDown:listSlice,
       planData:planSlice,
       FaqData:faqSlice,
    }
});

export default store;