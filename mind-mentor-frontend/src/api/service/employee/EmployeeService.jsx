import { operationDeptInstance } from "../../axios/operationDeptInstance";

// Email Verification
export const employeeEmailVerification = async (email) => {
  const response = await operationDeptInstance.post("/email-verification", { email });
  return response;
};

// Password Verification
export const operationPasswordVerification = async (email,password) => {
  const response = await operationDeptInstance.post("/password-verification", { email,password });
  return response;
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
export const fetchAllLeaves = async (empEmail) => {
  const response = await operationDeptInstance.get(`/leaves-form?email=${empEmail}`);
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
export const updateEnquiryStatus = async (id, enquiryStatus,empId) => {
  const response = await operationDeptInstance.put(`/enquiry-status/${id}`, { enquiryStatus,empId });
  return response.data;
};
// Schedule Demo
export const scheduleDemo = async (id, scheduleData) => {
  const response = await operationDeptInstance.put(`/schedule-demo/${id}`, scheduleData);
  return response.data;
};

// Add Notes
export const addNotes = async (id,empId, notes) => {
  const response = await operationDeptInstance.put(`/add-notes/${id}`, { notes,empId });
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
  const response = await operationDeptInstance.post("/tasks", formData);
  return response.data;
};

// Get All Enquiries
export const fetchAllTasks = async () => {
  const response = await operationDeptInstance.get("/tasks");
  return response.data;
};



export const fetchMyTasks = async (email) => {
  const response = await operationDeptInstance.get(`/my-tasks/${email}`);
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

export const getKidData = async () => {
  const response = await operationDeptInstance.get(`/get-kids-data`);
  return response.data;
};


export const getParentData = async () => {
  const response = await operationDeptInstance.get(`/get-parent-data`);
  return response.data;
};

export const attandaceData = async (email) => {
  const response = await operationDeptInstance.get(`/get-attandace-data/${email}`);
  return response.data;
};

export const fetchProspectsEnquiries = async () => {
  const response = await operationDeptInstance.get(`/get-prospects-data`);
  return response.data;
};


export const getProspectsStudents = async () => {
  const response = await operationDeptInstance.get(`/get-prospects-student-data`);
  return response.data;
};


export const seduleDemoClass = async (empId,data) => {
  const response = await operationDeptInstance.post(`/shedule-demo-class/${empId}`,{data});
  return response.data;
};


export const getDemoSheduleClass = async () => {
  const response = await operationDeptInstance.get(`/get-shedule-demo-class`);
  return response;
};

export const moveToProspects = async (id,empId) => {
  const response = await operationDeptInstance.put(`/move-to-prospects/${id}`,{empId});
  return response;
};


export const fetchAllLogs = async (id) => {
  const response = await operationDeptInstance.get(`/fetch-all-logs/${id}`);
  return response;
};

export const getDemoClassandStudentData = async (classId) => {
  const response = await operationDeptInstance.get(`/get-demo-class-student-data/${classId}`);
  return response;
};



export const saveDemoClassDetails = async (classId,students,empId) => {
  const response = await operationDeptInstance.post(`/save-demo-class/${empId}`,{classId,students});
  return response;
};



