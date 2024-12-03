/* eslint-disable react-refresh/only-export-components */
import { parentInstance } from "../../axios/ParentInstance";

export const parentLogin = async (mobile) => {
  try {
    const response = await parentInstance.post(`/parent/login`, {
      mobile,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const verifyOtp = async (otp) => {
  try {
    const response = await parentInstance.post(`/parent/verify-otp`, {
      otp,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const parentKidsRegistration = async (formData, state) => {
  try {
    const response = await parentInstance.post(
      `/parent/parent-kids-registration`,
      {
        formData,
        state,
      }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const parentBookDemoClass = async (formData, state) => {
  try {
    console.log("parentBookDemoClass", formData, state);
    const response = await parentInstance.post(
      `/parent/parent-book-demo-class`,
      {
        formData,
        state,
      }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const gettingKidsData = async (parentId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-kids-data/${parentId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const ParentManageChildLogin = async (id) => {
  try {
    const response = await parentInstance.get(
      `/parent/manage-child-login/${id}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const changeChildPin = async (id, newPin) => {
  try {
    const response = await parentInstance.post(
      `/parent/manage-child-pin/${id}`,
      { newPin }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const fetchDemoClassDetails = async (kidId) => {
  try {
    console.log("kidid", kidId);
    const response = await parentInstance.get(
      `/parent/get-demo-class-data/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const parentBookNewDemoClass = async (kidId, formData) => {
  try {
    console.log("kidid", kidId);
    const response = await parentInstance.post(
      `/parent/book-new-demo-class/${kidId}`,
      formData
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const parentRegisterChampions = async (parentId, formData) => {
  try {
    console.log("parentId, formData",parentId, formData);
    const response = await parentInstance.post(
      `/parent/add-new-kid/${parentId}`,
      formData
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getParentData = async (parentId) => {
  try {
  
    const response = await parentInstance.get(
      `/parent/getprofiledata/${parentId}`,
   
    );
    return response;
  } catch (err) {
    return err;
  }
};
