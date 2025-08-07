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

export const fetchPaymentNotifications = async (kidId, parentId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-payment-notification-data/${kidId}/${parentId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const savepaymentInfo = async (paymentData, transactionId, parentId) => {
  try {
    console.log(paymentData, transactionId, parentId);
    const response = await parentInstance.post(
      `/parent/save-payment-information-data/${parentId}`,
      { paymentData, transactionId }
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
    const response = await parentInstance.get(`/parent/get-kid-data/${kidId}`);
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
    console.log(formData, kidId);
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
      `/parent/get-my-kid-data/${parentId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getKidLiveClass = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-kid-live-class/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getTheEnqId = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-enqId-of-kid/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const parentSelectPackageData = async (finalData, enqId, parentId) => {
  try {
    const response = await parentInstance.post(
      `/parent/send-selected-package/${parentId}`,
      { finalData, enqId }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const parentAddNewKid = async (formData, parentId) => {
  try {
    const response = await parentInstance.post(
      `/parent/parent-add-new-kid-data/${parentId}`,
      { formData }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const registerKidData = async (formData) => {
  try {
    const response = await parentInstance.post(`/parent/parent-save-kid-name`, {
      formData,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const fetchParentPackageDetails = async () => {
  try {
    const response = await parentInstance.get(
      `/parent/get-parent-package-data`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getKidBelongsToData = async (parentId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-kid-belong-to-data-support/${parentId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const createTiketForParent = async (ticketData) => {
  try {
    const response = await parentInstance.post(
      `/parent/create-ticket-for-parent`,
      { ticketData }
    );
    return response;
  } catch (err) {
    return err;
  }
};
export const getTicketsofParents = async (parentId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-all-ticket-of-parent/${parentId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const updateTicketChats = async (message, tiketId, parentId) => {
  try {
    const response = await parentInstance.put(
      `/parent/update-ticket-chats/${tiketId}`,
      { message, parentId }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const sendReferealDeatails = async (referral, parentId) => {
  try {
    const response = await parentInstance.post(
      `/parent/send-referal-data/${parentId}`,
      { referral }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getMyReferal = async (parentId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-my-referal-data/${parentId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getMySubscriptionData = async (parentId, kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-my-selected-package-data/${parentId}/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const setProgramAndLevel = async (program, level, kidId) => {
  try {
    const response = await parentInstance.post(
      `/parent/save-program-level/${kidId}`,
      { program, level }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const submitEndChat = async (ticketId, chatRemarks, chatRating) => {
  try {
    const response = await parentInstance.put(
      `/parent/end-selected-chat/${ticketId}`,
      { chatRemarks, chatRating }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const updateParentProfile = async (parentId, parentData) => {
  try {
    const response = await parentInstance.put(
      `/parent/edit-parent-data-profile-management/${parentId}`,
      { parentData }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getKidExistProgramData = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-kid-exist-program-data/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getConductedClassDetails = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-conducted-class-details/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getParentName = async (parentId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-my-name/${parentId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const updateParentName = async (parentId, newFirstName) => {
  try {
    const response = await parentInstance.put(
      `/parent/update-my-name/${parentId}`,
      { newFirstName }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const getKidSheduleDemoDetails = async (kidId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-kid-shedule-demo-details/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const parentBookDemoClassData = async (kidId, bookingDetails) => {
  try {
    const response = await parentInstance.post(
      `/parent/book-demo-class-data/${kidId}`,
      { bookingDetails }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const checkMmIdAvailability = async (MMid) => {
  try {
    const response = await parentInstance.post(`/parent/get-mm-id-available`, {
      MMid,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const updateChildChessId = async (id, MMid) => {
  try {
    const response = await parentInstance.put(`/parent/update-mm-id/${id}`, {
      MMid,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const getIsSheduledResponse = async (id) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-reshedule-button/${id}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const parentGetSheduledClassData = async (enqId) => {
  try {
    const response = await parentInstance.get(
      `/parent/get-sheduled-class-data/${enqId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const parentSheduleWholeClasses = async (submissionData) => {
  try {
    const response = await parentInstance.post(
      `/parent/parent-shedule-whole-class`,
      { submissionData }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const parentPauseTheClass = async (
  enqId,
  updatedData,
  pauseRemarks,
  classId,
  pauseStartDate,
  pauseEndDate
) => {
  try {
    const response = await parentInstance.post(
      `/parent/parent-pause-class/${enqId}/${classId}`,
      {
        updatedData,
        pauseRemarks,
        pauseStartDate,
        pauseEndDate,
      }
    );
    return response;
  } catch (err) {
    return err;
  }
};

export const parentResumeTheClass = async (enqId, updatedData, classId) => {
  try {
    const response = await parentInstance.post(
      `/parent/parent-resume-class/${enqId}/${classId}`,
      {
        updatedData,
      }
    );
    return response;
  } catch (err) {
    return err;
  }
};
