import { configureStore } from '@reduxjs/toolkit';
import regDataParentKidsSlice from './regDataParentKidsSlice';

export const store = configureStore({
  reducer: {
    formData: regDataParentKidsSlice,
  },
});
