import { operationDeptInstance } from "../../axios/operationDeptInstance";

// Email Verification
export const employeeEmailVerification = async (email) => {
  const response = await operationDeptInstance.post("/email-verification", { email });
  return response.data;
};

// Password Verification
export const operationPasswordVerification = async (password) => {
  const response = await operationDeptInstance.post("/password-verification", { password });
  return response.data;
};

// Create Enquiry
export const createEnquiry = async (formData) => {
  const response = await operationDeptInstance.post("/enquiry-form", formData);
  return response.data;
};

// Get All Enquiries
export const fetchAllEnquiries = async () => {
  const response = await operationDeptInstance.get("/enquiry-form");
  return response.data;
};

// Update Enquiry
export const updateEnquiry = async (id, updatedData) => {
  const response = await operationDeptInstance.put(`/enquiry-form/${id}`, updatedData);
  return response.data;
};

// Delete Enquiry
export const deleteEnquiry = async (id) => {
  const response = await operationDeptInstance.delete(`/enquiry-form/${id}`);
  return response.data;
};
// Create Leave
export const createLeave = async (formData) => {
  const response = await operationDeptInstance.post("/leaves-form", formData);
  return response.data;
};

// Get All Leaves
export const fetchAllLeaves = async () => {
  const response = await operationDeptInstance.get("/leaves-form");
  return response.data;
};

// Update Leave
export const updateLeave = async (id, updatedData) => {
  const response = await operationDeptInstance.put(`/leaves-form/${id}`, updatedData);
  return response.data;
};

// Delete Leave
export const deleteLeave = async (id) => {
  const response = await operationDeptInstance.delete(`/leaves-form/${id}`);
  return response.data;
};

// Update Prospect Status
export const updateProspectStatus = async (id, enquiryStatus) => {
  const response = await operationDeptInstance.put(`/prospect-status/${id}`, { enquiryStatus });
  return response.data;
};
// Update Prospect Status
export const updateEnquiryStatus = async (id, enquiryStatus) => {
  const response = await operationDeptInstance.put(`/enquiry-status/${id}`, { enquiryStatus });
  return response.data;
};
// Schedule Demo
export const scheduleDemo = async (id, scheduleData) => {
  const response = await operationDeptInstance.put(`/schedule-demo/${id}`, scheduleData);
  return response.data;
};

// Add Notes
export const addNotes = async (id, notes) => {
  const response = await operationDeptInstance.put(`/add-notes/${id}`, { notes });
  return response.data;
};

// Refer to Friend
export const referToFriend = async (id, referralData) => {
  const response = await operationDeptInstance.put(`/refer-to-friend/${id}`, referralData);
  return response.data;
};

export const markAttendance = async (formData) => {
  const response = await operationDeptInstance.post("/attendance/mark", formData);
  return response.data;
};


// Create Enquiry
export const createTasks = async (formData) => {
  const response = await operationDeptInstance.post("/enquiry-form", formData);
  return response.data;
};

// Get All Enquiries
export const fetchAllTasks = async () => {
  const response = await operationDeptInstance.get("/enquiry-form");
  return response.data;
};

// Update Enquiry
export const updateTasks = async (id, updatedData) => {
  const response = await operationDeptInstance.put(`/enquiry-form/${id}`, updatedData);
  return response.data;
};

// Delete Enquiry
export const deleteTasks = async (id) => {
  const response = await operationDeptInstance.delete(`/enquiry-form/${id}`);
  return response.data;
};




