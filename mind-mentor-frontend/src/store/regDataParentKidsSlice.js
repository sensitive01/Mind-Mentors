import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mobile: "",
  email: "",
  name: "",
  childName: "",
  isMobileWhatsapp: false,
  age: "",
  gender: "",
  intention: "",
  state: "",
  city: "",
  pincode: "",
  programs: [],
  enqId: "",
};



const regDataParentKidsSlice = createSlice({
  name: "formData",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      console.log("action.payload", action);
      const { payload } = action;
      return {
        ...state,
        childName: payload.childName||payload.kidsName,
        mobile: payload.mobile,
        email: payload.email,
        name: payload.name,
        isMobileWhatsapp: payload.isMobileWhatsapp,
        enqId: payload.enqId,
        parentId: payload.parentId,
        age:payload.age,
        gender: payload.gender,
        intention: payload.intention,
        state: payload.state,
        city: payload.city,
        pincode: payload.pincode,
        programs: payload.programs,

      };
    },
    resetFormData: () => initialState, // Reset state to initial
  },
});

export const { setFormData, resetFormData } = regDataParentKidsSlice.actions;
export default regDataParentKidsSlice.reducer;
