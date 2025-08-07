import { hrInstance } from "../../axios/hrInstance";
import { operationDeptInstance } from "../../axios/operationDeptInstance";
import { userInstance } from "../../axios/userInstance";

export const employeeEmailVerification = async (email) => {
  const response = await operationDeptInstance.post("/email-verification", {
    email,
  });
  return response;
};

export const operationPasswordVerification = async (email, password) => {
  const response = await operationDeptInstance.post("/password-verification", {
    email,
    password,
  });
  return response;
};
// ..........................................Add New Programme.........................................................................

export const adminAddNewProgramme = async (programmeData) => {
  const response = await userInstance.post("/add-new-programme", programmeData);

  return response;
};

export const getAllProgrameData = async () => {
  const response = await userInstance.get("/get-programme-data-table");

  return response;
};

export const adminDeleteProgramme = async (id) => {
  const response = await userInstance.delete(`/delete-programData/${id}`);

  return response.data;
};

export const adminUpdateProgramme = async (programData) => {
  const response = await userInstance.put("/update-programData", programData);

  return response.data;
};

export const getAllProgrameDataEnquiry = async () => {
  const response = await userInstance.get("/get-programme-data");

  return response;
};

// ..........................................Add New Programme.........................................................................

// ..........................................Add Physical Center.........................................................................

export const savePhysicalCenterData = async (formData) => {
  const response = await userInstance.post(
    `/save-physcical-center-data`,
    formData
  );
  return response;
};
export const fetchPhycicalCenterData = async () => {
  const response = await userInstance.get(`/get-physcical-center-data`);
  return response;
};
export const updatePhysicalCenterData = async (id, formData) => {
  const response = await userInstance.put(
    `/update-individual-physcical-center-data/${id}`,
    { formData }
  );
  return response;
};
export const deletePhysicalCenters = async (centerId) => {
  const response = await userInstance.delete(
    `/delete-physcical-center-data/${centerId}`
  );
  return response;
};

// ..........................................Add Physical Center.........................................................................
// ..........................................Add Package Data.........................................................................

export const saveNewPackage = async (formData) => {
  const response = await userInstance.post(`/add-new-package-data`, {
    formData,
  });
  return response;
};
export const getPackageData = async () => {
  const response = await userInstance.get(`/get-package-data`);
  return response;
};
export const updatePackageData = async (editPackage) => {
  const response = await userInstance.post(`/edit-package-data`, {
    editPackage,
  });
  return response;
};
export const deletePackageData = async (deletePackage) => {
  const response = await userInstance.put(`/delete-package-data`, {
    deletePackage,
  });
  return response;
};

// ..........................................Add Package Data.......................................................................
// ..........................................Add Voucher/Discount Data.......................................................................

export const addNewVoucher = async (formData) => {
  const response = await userInstance.post(`/add-new-voucher`, { formData });
  return response;
};
export const fetchAllVouchers = async () => {
  const response = await userInstance.get(`/get-all-vouchers`);
  return response;
};
export const getVoucherData = async (voucherId) => {
  const response = await userInstance.get(`/get-voucher-data/${voucherId}`);
  return response;
};
export const updateVoucherData = async (voucherId, data) => {
  const response = await userInstance.put(`/update-voucher-data/${voucherId}`, {
    data,
  });
  return response;
};
export const deleteTheVoucherData = async (voucherId) => {
  const response = await userInstance.delete(
    `/delete-voucher-data/${voucherId}`
  );
  return response;
};

// ..........................................Add Voucher/Discount Data.......................................................................

// ..........................................Add Employee Data.......................................................................

export const updateEmployeeData = async (empId, formData) => {
  const response = await userInstance.put(`/update-employee-data/${empId}`, {
    formData,
  });
  return response;
};
export const createEmployee = async (userData) => {
  const response = await userInstance.post("employee", userData);
  return response.data;
};
export const fetchAllEmployees = async () => {
  const response = await userInstance.get("/employees");
  return response.data;
};
export const fetchEmployeeById = async (id) => {
  const response = await userInstance.get(`/employees/${id}`);
  return response.data;
};
export const updateEmployee = async (id, updatedData) => {
  const response = await userInstance.put(`/employees/${id}`, updatedData);
  return response.data;
};

// ..........................................Add Employee Data.......................................................................
// ..........................................Create Enquiry Data.......................................................................

export const createEnquiry = async (formData) => {
  const response = await operationDeptInstance.post("/enquiry-form", formData);
  return response.data;
};
export const fetchAllEnquiries = async () => {
  const response = await operationDeptInstance.get("/enquiry-form");
  return response.data;
};
export const updateEnquiry = async (updatedData,empId) => {
  const response = await operationDeptInstance.put(
    `/enquiry-form/${updatedData._id}/${empId}`,
    updatedData
  );
  return response;
};
export const deleteEnquiry = async (id) => {
  const response = await operationDeptInstance.delete(`/enquiry-form/${id}`);
  return response.data;
};

// ..........................................Create Enquiry Data.......................................................................

export const getClassRecodingsLink = async (meetingIDs) => {
  const response = await hrInstance.post("/api/new-class/get-recordings-link", {
    meetingIDs,
  });
  return response;
};

export const getLearningDashboardAttandanceData = async (meetingID) => {
  const response = await hrInstance.get(
    `/api/new-class/get-learning-statistic-data/${meetingID}`
  );
  return response;
};
export const getAttandanceReport = async () => {
  const response = await hrInstance.get(`/api/new-class/get-attandance-report`);
  return response;
};

export const getInvoiceData = async () => {
  const response = await userInstance.get("/get-invoice-data");
  return response;
};

export const generateClassMeetingLink = async (
  classId,
  className,
  coachName
) => {
  const response = await hrInstance.post(
    `/api/new-class/create-new-class-link-admin/${classId}`,
    { coachName, className }
  );
  return response;
};

export const createLeave = async (formData) => {
  const response = await operationDeptInstance.post("/leaves-form", formData);
  return response;
};

export const fetchMyLeaves = async (empId) => {
  const response = await operationDeptInstance.get(`/get-my-leaves/${empId}`);
  return response.data;
};

export const fetchLeaveById = async (levId) => {
  const response = await operationDeptInstance.get(`/get-leaves/${levId}`);
  return response;
};

export const fetchAllLeavesSuperAdmin = async () => {
  const response = await userInstance.get(`/super-admin-get-all-leaves`);
  return response;
};

export const getEmployeeAttandanceRecord = async (empId) => {
  const response = await userInstance.get(
    `/super-admin-get-individial-employee-attandance/${empId}`
  );
  return response;
};

export const updateLeaveStatus = async (leaveId, status) => {
  const response = await userInstance.put(
    `/super-admin-update-leave-status/${leaveId}`,
    { status }
  );
  return response;
};

// Get All Leaves
export const fetchAllLeaves = async (empEmail) => {
  const response = await operationDeptInstance.get(
    `/leaves-form?email=${empEmail}`
  );
  return response.data;
};

// Update Leave
export const updateLeave = async (updatedData, id) => {
  console.log(id, updatedData);
  const response = await operationDeptInstance.put(`/leaves-form/${id}`, {
    updatedData,
  });
  return response.data;
};

// Delete Leave
export const deleteLeave = async (id) => {
  const response = await operationDeptInstance.delete(`/leaves-form/${id}`);
  return response.data;
};

// Update Prospect Status
export const updateProspectStatus = async (id, enquiryStatus) => {
  const response = await operationDeptInstance.put(`/prospect-status/${id}`, {
    enquiryStatus,
  });
  return response.data;
};
// Update Prospect Status
export const updateEnquiryStatus = async (id, enquiryStatus, empId) => {
  const response = await operationDeptInstance.put(`/enquiry-status/${id}`, {
    enquiryStatus,
    empId,
  });
  return response.data;
};
// Schedule Demo
export const scheduleDemo = async (id, scheduleData) => {
  const response = await operationDeptInstance.put(
    `/schedule-demo/${id}`,
    scheduleData
  );
  return response.data;
};

// Add Notes
export const addNotes = async (id, empId, notes) => {
  const response = await operationDeptInstance.put(`/add-notes/${id}`, {
    notes,
    empId,
  });
  return response;
};

// Refer to Friend
export const referToFriend = async (id, referralData) => {
  const response = await operationDeptInstance.put(
    `/refer-to-friend/${id}`,
    referralData
  );
  return response.data;
};

export const markAttendance = async (formData) => {
  const response = await operationDeptInstance.post(
    "/attendance/mark",
    formData
  );
  return response.data;
};

export const createTasks = async (formData) => {
  const response = await operationDeptInstance.post("/tasks", formData);
  return response.data;
};

export const fetchMyPendingTask = async (empId) => {
  try {
    const response = await operationDeptInstance.get(
      `/my-pending-tasks/${empId}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const superAdminGetAllTask = async () => {
  try {
    const response = await userInstance.get(`/get-all-task-data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const superAdminDeleteTask = async (taskId) => {
  try {
    const response = await userInstance.delete(
      `/super-admin-delete-task/${taskId}`
    );
    return response;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const fetchTaskAmAssignedToOthers = async (empId) => {
  try {
    const response = await operationDeptInstance.get(
      `/assign-task-to-others/${empId}`,
      {}
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Create Enquiry
export const fetchAllTasks = async () => {
  try {
    const response = await operationDeptInstance.get(`/all-task`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
export const getActivityLogsByTaskId = async (id) => {
  console.log("Calling API with Task ID:", id);

  try {
    const response = await operationDeptInstance.get(`/taskslogs/${id}`);
    console.log("API Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
};
// Add Notes Service Function
export const addNotesToTasks = async (id, payload) => {
  try {
    const response = await operationDeptInstance.put(
      `/tasks/notes/${id}`,
      payload
    );
    return response.data; // Return the response data directly
  } catch (error) {
    console.error("Error in addNotesToTasks service:", error.message);
    throw error; // Rethrow the error for the caller to handle
  }
};
// api.js or in the same file
export const updateTaskStatus = async (id, payload) => {
  try {
    // Get empId from localStorage (or from your app's state/context)
    const empId = localStorage.getItem("empId");
    if (!empId) {
      throw new Error("Employee ID (empId) is missing.");
    }

    // Add empId to the headers
    const response = await operationDeptInstance.put(
      `/tasks/${id}/status`,
      payload,
      {
        headers: {
          empId: empId, // Pass empId in the headers
        },
      }
    );

    return response.data; // Return the response data directly
  } catch (error) {
    console.error("Error in updateTaskStatus service:", error.message);
    throw error; // Rethrow the error for the caller to handle
  }
};
// Update Enquiry
export const updateTasks = async (id, updatedData) => {
  const response = await operationDeptInstance.put(
    `/enquiry-form/${id}`,
    updatedData
  );
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

export const attandaceData = async (empId) => {
  const response = await operationDeptInstance.get(
    `/get-attandace-data/${empId}`
  );
  return response.data;
};

export const fetchProspectsEnquiries = async () => {
  const response = await operationDeptInstance.get(`/get-prospects-data`);
  return response.data;
};

export const getProspectsStudents = async () => {
  const response = await operationDeptInstance.get(
    `/get-prospects-student-data`
  );
  return response.data;
};

export const seduleDemoClass = async (empId, data) => {
  const response = await operationDeptInstance.post(
    `/shedule-demo-class/${empId}`,
    { data }
  );
  return response.data;
};

export const getDemoSheduleClass = async () => {
  const response = await operationDeptInstance.get(`/get-shedule-demo-class`);
  return response;
};

export const moveToProspects = async (id, empId) => {
  const response = await operationDeptInstance.put(`/move-to-prospects/${id}`, {
    empId,
  });
  return response;
};

export const handleMoveToEnquiry = async (id, empId) => {
  console.log("Calliing...");
  const response = await operationDeptInstance.put(`/move-to-enquiry/${id}`, {
    empId,
  });
  return response;
};

export const saveDemoClassDetails = async (classId, students, empId) => {
  const response = await operationDeptInstance.post(
    `/save-demo-class/${empId}`,
    { classId, students }
  );
  return response;
};

export const rescheduleDemoClass = async (classId, selectedStudents, empId) => {
  console.log("Calliing...");
  const response = await operationDeptInstance.put(
    `/reshedule-demo-class-for-a-kid/${classId}/${empId}`,
    {
      selectedStudents,
    }
  );
  return response;
};

export const cancelDemoClass = async (enqId, classId, empId) => {
  console.log("Calliing...");
  const response = await operationDeptInstance.put(
    `/cancel-demo-class-for-a-kid/${enqId}/${classId}/${empId}`
  );
  return response;
};

export const fetchAllLogs = async (id) => {
  const response = await operationDeptInstance.get(`/fetch-all-logs/${id}`);
  return response;
};

export const fetchAllStatusLogs = async (id) => {
  const response = await operationDeptInstance.get(
    `/fetch-all-status-logs/${id}`
  );
  return response;
};

export const getDemoClassandStudentData = async (enqId) => {
  const response = await operationDeptInstance.get(
    `/get-demo-class-student-data/${enqId}`
  );
  return response;
};

export const getDemoClassById = async (enqId) => {
  const response = await operationDeptInstance.get(
    `/get-demo-class-for-individual-kid/${enqId}`
  );
  return response;
};

export const getDemoClassandStudentDataGroup = async (classId) => {
  const response = await operationDeptInstance.get(
    `/get-demo-class-student-data-group/${classId}`
  );
  return response;
};

export const getConductedDemo = async () => {
  const response = await operationDeptInstance.get(`/get-conducted-demo-class`);
  return response;
};

export const updateDemoStatus = async (id, empId) => {
  const response = await operationDeptInstance.put(
    `/update-conducted-enrollment-status/${empId}/${id}`
  );
  return response;
};

// ............................................................

export const fetchAllEmployeeAttandance = async () => {
  const response = await userInstance.get(`/get-all-employee-attandance`);

  return response.data;
};

// Create User
export const createUser = async (userData) => {
  const response = await userInstance.post("/users", userData);

  return response.data;
};

export const getAvailableCentersForProgram = async () => {
  const response = await userInstance.get("/get-available-programme-data");

  return response;
};

// Get All Users
export const fetchAllUsers = async () => {
  const response = await userInstance.get("/users");
  return response.data;
};

// Get All Users By Name
export const fetchUsersByName = async () => {
  const response = await userInstance.get("/usersbyname");
  return response.data;
};

// Get User by ID
export const fetchUserById = async (id) => {
  const response = await userInstance.get(`/user/${id}`);
  return response.data;
};

// Update User
export const updateUser = async (id, updatedData) => {
  const response = await userInstance.put(`/user/${id}`, updatedData);
  return response.data;
};

// Delete User
export const deleteUser = async (id) => {
  const response = await userInstance.delete(`/user/${id}`);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await userInstance.delete(`/employees/${id}`);
  return response.data;
};

// tournments
// Create Tournament
export const createTournament = async (tournamentData) => {
  const response = await userInstance.post("/tournaments", tournamentData);
  return response.data;
};

// Get All Tournaments
export const fetchAllTournaments = async () => {
  const response = await userInstance.get("/tournaments");
  return response.data;
};

// Get Tournament by ID
export const fetchTournamentById = async (id) => {
  const response = await userInstance.get(`/tournaments/${id}`);
  return response.data;
};

// Update Tournament
export const updateTournament = async (id, updatedData) => {
  const response = await userInstance.put(`/update-tournaments-data/${id}`, {
    updatedData,
  });
  return response.data;
};

// Delete Tournament
export const deleteTournament = async (id) => {
  const response = await userInstance.delete(`/tournaments/${id}`);
  return response.data;
};

// tournments
// Create Tournament
export const createHoliday = async (tournamentData) => {
  const response = await userInstance.post("/tournaments", tournamentData);
  return response.data;
};

// Get All Tournaments
export const fetchAllHoliday = async () => {
  const response = await userInstance.get("/holidays");
  return response.data;
};

// Get Tournament by ID
export const fetchHolidayById = async (id) => {
  const response = await userInstance.get(`/holidays/${id}`);
  return response.data;
};

// Update Tournament
export const updateHoliday = async (id, updatedData) => {
  const response = await userInstance.put(`/holidays/${id}`, updatedData);
  return response.data;
};

// Delete Tournament
export const deleteHoliday = async (id) => {
  const response = await userInstance.delete(`/holidays/${id}`);
  return response.data;
};

export const createChat = async (payload) => {
  try {
    const response = await userInstance.post("/chats/", payload, {
      // Use userInstance for the POST request
      headers: {
        empId: localStorage.getItem("empId"), // Pass empId from localStorage for authorization
      },
    });

    return response.data; // Return the response data
  } catch (error) {
    throw new Error(error.message || "Error submitting chat");
  }
};

export const getAllEmployeesByName = async () => {
  const response = await userInstance.get("/employeesbyname");
  return response.data;
};

export const getDropDownData = async () => {
  const response = await operationDeptInstance.get("/get-dropdown-data");
  return response.data;
};

export const assignTaskForSpecificKid = async (id) => {
  const response = await operationDeptInstance.get(
    `/specific-kid-assign-task/${id}`
  );
  return response.data;
};

export const sendPaymentDetailsLink = async (paymentData, enqId, link) => {
  const response = await operationDeptInstance.post(
    `/send-payment-package-data/${enqId}`,
    { paymentData, link }
  );
  return response;
};

export const fetchPackageDetails = async () => {
  const response = await operationDeptInstance.get(`/get-package-data`);
  return response;
};

export const getDiscountAmount = async (enqId) => {
  const response = await operationDeptInstance.get(
    `/get-discount-vouchers/${enqId}`
  );
  return response;
};

export const getPParentDiscountAmount = async (parentId, kidId) => {
  const response = await operationDeptInstance.get(
    `/get-parent-discount-vouchers/${parentId}/${kidId}`
  );
  return response;
};

export const deleteEmployeeData = async (empId, status) => {
  const response = await userInstance.put(`/delete-employee-data/${empId}`, {
    status,
  });
  return response;
};

export const fetchEditEmployeeData = async (empId) => {
  const response = await userInstance.get(`/get-employee-data/${empId}`);
  return response;
};

export const fetchPhysicalCenterTimings = async () => {
  const response = await userInstance.get(`/get-physcial-center-timings`);
  return response;
};

export const deleteSheduleClass = async (classId) => {
  const response = await userInstance.delete(
    `/delete-selected-class-data/${classId}`
  );
  return response;
};

export const editSheduledClassData = async (classId) => {
  const response = await userInstance.get(
    `/get-selected-class-data/${classId}`
  );
  return response;
};

export const editSheduleTimeTable = async (classId, shedules) => {
  const response = await userInstance.put(
    `/update-selected-class-data/${classId}`,
    { shedules }
  );
  return response;
};

export const getPhycicalCenterData = async () => {
  const response = await userInstance.get(`/get-physcical-center-data`);
  return response;
};

export const getIndividualPhysicalCenterData = async (id) => {
  const response = await userInstance.get(
    `/get-individual-physcical-center-data/${id}`
  );
  return response;
};

export const getAllParentData = async () => {
  const response = await userInstance.get(`/get-all-parent-data`);
  return response;
};

export const savepaymentInfoOperation = async (paymentData, transactionId) => {
  const response = await operationDeptInstance.post(
    `/department-paynow-option`,
    { paymentData, transactionId }
  );
  return response;
};

export const fetchThePhysicalCenters = async () => {
  const response = await operationDeptInstance.get(
    `/get-the-physical-center-name`
  );
  return response;
};

export const sendPaymentUpdations = async (data) => {
  const response = await operationDeptInstance.post(`/update-payment-data`, {
    data,
  });
  return response;
};

export const makeCallToParent = async (mobile) => {
  console.log("Calling");
  const response = await operationDeptInstance.post(`/make-a-call-to-parent`, {
    mobile,
  });
  return response;
};

export const getEmployeeData = async (empId) => {
  const response = await operationDeptInstance.get(
    `/get-employee-data/${empId}`
  );
  return response;
};

export const markEmployeeAttandance = async (empId, status) => {
  const response = await operationDeptInstance.post(
    `/save-employee-attance-data/${empId}`,
    { status }
  );
  return response;
};

export const isAttandaceMarked = async (empId) => {
  const response = await operationDeptInstance.get(
    `/is-attandance-marked/${empId}`
  );
  return response;
};

export const getMyAttandanceData = async (empId) => {
  const response = await operationDeptInstance.get(
    `/get-my-attandance-data/${empId}`
  );
  return response;
};

export const submitOnlineClassPrice = async (onlinePackage) => {
  const response = await userInstance.post(`/save-online-package-data`, {
    onlinePackage,
  });
  return response;
};

export const submitPhysicalCenterClassPrice = async (
  offlinePackageData,
  applyToAll
) => {
  const response = await userInstance.post(`/save-offline-package-data`, {
    offlinePackageData,
    applyToAll,
  });
  return response;
};

export const submitPhysicalCenterClassPriceWithCenter = async (
  centerId,
  offlinePackageData,
  applyToAll
) => {
  const response = await userInstance.post(`/save-offline-package-data`, {
    offlinePackageData,
    applyToAll,
    centerId,
  });
  return response;
};

export const saveHybridClassPricing = async (hybridPackageData, applyToAll) => {
  const response = await userInstance.post(`/save-hybrid-package-data`, {
    hybridPackageData,
    applyToAll,
  });
  return response;
};

export const submitHybridClassPriceWithCenter = async (
  centerId,
  hybridPackageData,
  applyToAll
) => {
  const response = await userInstance.post(`/save-hybrid-package-data`, {
    hybridPackageData,
    applyToAll,
    centerId,
  });
  return response;
};

export const setKitPriceData = async (quantity, kitPrice) => {
  const response = await userInstance.post(`/save-kit-price-data`, {
    quantity,
    kitPrice,
  });
  return response;
};

export const sendPackageSelection = async (packageData, enqId, empId) => {
  const response = await userInstance.post(
    `/send-selected-package-data/${enqId}`,
    { packageData, empId }
  );
  return response;
};

export const getPaymetDetails = async (paymentId) => {
  const response = await userInstance.get(`/get-payment-details/${paymentId}`);
  return response;
};

export const updatePaymentStatus = async (data) => {
  const response = await userInstance.post(`/update-payment-details`, { data });
  return response;
};

export const getThePaymentId = async (enqId) => {
  const response = await userInstance.get(`/get-Payment-id/${enqId}`);
  return response;
};

export const changePassword = async (currentPassword, newPassword, empId) => {
  const response = await userInstance.put(
    `/change-the-employee-password/${empId}`,
    { currentPassword, newPassword }
  );
  return response;
};

export const fetchParentTikets = async (empId) => {
  const response = await userInstance.get(`/get-parent-tickets-data/${empId}`);
  return response;
};

export const reponseToTickets = async (message, ticketId, empId) => {
  const response = await userInstance.put(`/response-to-ticket/${ticketId}`, {
    message,
    empId,
  });
  return response;
};

export const updateTicketPriority = async (ticketId, priorityStatus) => {
  const response = await userInstance.put(
    `/update-ticket-priority/${ticketId}`,
    { priorityStatus }
  );
  return response;
};

export const getKidProfileData = async (enqId) => {
  const response = await userInstance.get(
    `/get-enquiry-related-all-kid-data/${enqId}`
  );
  return response;
};

export const addNewTournamentData = async (tournamentData) => {
  const response = await userInstance.post(`/add-new-tournament-data`, {
    tournamentData,
  });
  return response;
};

export const getSuperAdminDashboard = async () => {
  const response = await userInstance.get(`/get-super-admin-dashboard-data`);
  return response;
};

export const getDemoClassData = async (enqId, isSheduled) => {
  const response = await userInstance.get(
    `/get-is-demo-sheduled/${enqId}/${isSheduled}`
  );
  return response;
};

export const getKidSheduleDemoDetailsEmployee = async (kidId) => {
  const response = await userInstance.get(
    `/get-is-demo-sheduled-for-kid/${kidId}`
  );
  return response;
};

export const employeeBookDemoClassData = async (kidId,bookingDetails,empId) => {
  const response = await userInstance.post(
    `/book-demo-class-data/${kidId}`,{bookingDetails,empId}
  );
  return response;
};

export const employeeCancelDemoClass = async (classId,kidId,empId) => {
  const response = await userInstance.delete(
    `/cancel-demo-sheduled-for-kid/${classId}/${kidId}/${empId}`
  );
  return response;
};


export const superAdminGetConductedClass = async () => {
  const response = await userInstance.get(
    `/get-conducted-class-details`
  );
  return response;
};

export const getMyDetailedAttandance = async (empId) => {
  const response = await userInstance.get(
    `/get-my-detailed-attandance/${empId}`
  );
  return response;
};