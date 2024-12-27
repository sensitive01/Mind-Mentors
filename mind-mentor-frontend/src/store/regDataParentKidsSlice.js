import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mobile: '',
  email: '',
  name: '',
  childName: '',
  isMobileWhatsapp: false,
  age: '',
  gender: '',
  intention: '',
  schoolName: '',
  address: '',
  pincode: '',
  programs: [],
  usePredefineSlot:false
};

const regDataParentKidsSlice = createSlice({
  name: 'formData',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      return { ...state, ...action.payload }; // Merge new data with existing state
    },
    resetFormData: () => initialState, // Reset state to initial
  },
});

export const { setFormData, resetFormData } = regDataParentKidsSlice.actions;
export default regDataParentKidsSlice.reducer;
