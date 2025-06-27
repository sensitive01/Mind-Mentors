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

export const parentBookDemoClass = async (formData, state, filteredSlots) => {
  try {
    console.log("parentBookDemoClass", formData, state, filteredSlots);
    const response = await parentInstance.post(
      `/parent/parent-book-demo-class`,
      {
        formData,
        state,
        filteredSlots,
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
    console.log("parentId, formData", parentId, formData);
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
      `/parent/getprofiledata/${parentId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getDemoClass = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-kid-demo-class-details/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const addKidAvailabilities = async (kidId, data) => {
  try {
    const response = await parentInstance.post(
      `/parent/save-kid-availability/${kidId}`,
      { data }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const fetchAllAvailabileDays = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-kid-availability/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const updateKidAvailability = async (data) => {
  try {
    const response = await parentInstance.put(
      `/parent/update-kid-availability/${data._id}`,
      { data }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const pauseKidAvailability = async (availId, status) => {
  try {
    const response = await parentInstance.put(
      `/parent/update-kid-availability-status/${availId}`,
      { status }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const deleteKidAvailability = async (availId) => {
  try {
    const response = await parentInstance.delete(
      `/parent/delete-kid-availability/${availId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const fetchkidClassData = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-kid-class-data/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getKidAttendace = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-kid-attandance-data/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const fetchPaymentNotifications = async (kidId,parentId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-payment-notification-data/${kidId}/${parentId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};


export const savepaymentInfo = async (paymentData,transactionId,parentId) => {
  try {
    console.log(paymentData,transactionId,parentId)
    const response = await parentInstance.post(
      `/parent/save-payment-information-data/${parentId}`,{paymentData,transactionId}
    );
    return response;
  } catch (err) {
    return err;
  }
};


export const getPaidClassData = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-paid-payment-information/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};


export const getParentKidData = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-kid-data/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};


export const fetchEnquiryStatus = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-kid-enquiry-status/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};


export const parentBookDemoClassinProfile = async (formData, kidId) => {
  try {
    console.log(formData, kidId)
    const response = await parentInstance.put(
      `/parent/parent-book-demo-class-in-profile/${kidId}`,
      {
        formData,
      }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getMyKidData = async (parentId) => {
  try {
   
    const response = await parentInstance.get(
      `/parent/get-my-kid-data/${parentId}`,
 
    );
    return response;
  } catch (err) {
    return err;
  }
};


export const getKidLiveClass = async (kidId) => {
  try {
   
    const response = await parentInstance.get(
      `/parent/get-kid-live-class/${kidId}`,
 
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getTheEnqId = async (kidId) => {
  try {
   
    const response = await parentInstance.get(
      `/parent/get-enqId-of-kid/${kidId}`,
 
    );
    return response;
  } catch (err) {
    return err;
  }
};


export const parentSelectPackageData = async (finalData,enqId,parentId) => {
  try {
   
    const response = await parentInstance.post(
      `/parent/send-selected-package/${parentId}`,{finalData,enqId},
 
    );
    return response;
  } catch (err) {
    return err;
  }
};


export const parentAddNewKid = async (formData,parentId) => {
  try {
   
    const response = await parentInstance.post(
      `/parent/parent-add-new-kid-data/${parentId}`,{formData},
 
    );
    return response;
  } catch (err) {
    return err;
  }
};



export const registerKidData = async (formData) => {
  try {
   
    const response = await parentInstance.post(
      `/parent/parent-save-kid-name`,{formData},
 
    );
    return response;
  } catch (err) {
    return err;
  }
};