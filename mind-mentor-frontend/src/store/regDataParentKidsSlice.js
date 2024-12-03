import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mobile: '',
  email: '',
  name: '',
  childName: '',
  isMobileWhatsapp: false,
};

const regDataParentKidsSlice = createSlice({
  name: 'formData',
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.mobile = action.payload.mobile;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.childName = action.payload.childName;
      state.isMobileWhatsapp = action.payload.isMobileWhatsapp;
    },
    resetFormData: () => initialState, 
  },
});

export const { setFormData, resetFormData } = regDataParentKidsSlice.actions;
export default regDataParentKidsSlice.reducer;
