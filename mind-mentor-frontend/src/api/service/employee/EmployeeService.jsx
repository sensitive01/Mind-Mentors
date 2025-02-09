import { operationDeptInstance } from "../../axios/operationDeptInstance";
import { userInstance } from "../../axios/userInstance";

// Email Verification
export const employeeEmailVerification = async (email) => {
  const response = await operationDeptInstance.post("/email-verification", {
    email,
  });
  return response;
};

// Password Verification
export const operationPasswordVerification = async (email, password) => {
  const response = await operationDeptInstance.post("/password-verification", {
    email,
    password,
  });
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
export const updateEnquiry = async (updatedData) => {
  const response = await operationDeptInstance.put(
    `/enquiry-form/${updatedData._id}`,
    updatedData
  );
  return response;
};

// Delete Enquiry
export const deleteEnquiry = async (id) => {
  const response = await operationDeptInstance.delete(`/enquiry-form/${id}`);
  return response.data;
};
// Create Leave
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

export const rescheduleDemoClass = async ( classId, selectedStudents,empId) => {
  console.log("Calliing...");
  const response = await operationDeptInstance.put(`/reshedule-demo-class-for-a-kid/${classId}/${empId}`, {
    selectedStudents,
  });
  return response;
};

export const cancelDemoClass = async (enqId,classId,empId) => {
  console.log("Calliing...");
  const response = await operationDeptInstance.put(`/cancel-demo-class-for-a-kid/${enqId}/${classId}/${empId}`);
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

// Create User
export const createUser = async (userData) => {
  const response = await userInstance.post("/users", userData);

  return response.data;
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

// Create User
export const createEmployee = async (userData) => {
  const response = await userInstance.post("employee", userData);
  return response.data;
};

// Get All employee
export const fetchAllEmployees = async () => {
  const response = await userInstance.get("/employees");
  return response.data;
};

// Get employee by ID
export const fetchEmployeeById = async (id) => {
  const response = await userInstance.get(`/employees/${id}`);
  return response.data;
};

// Update employee
export const updateEmployee = async (id, updatedData) => {
  const response = await userInstance.put(`/employees/${id}`, updatedData);
  return response.data;
};

// Delete employee
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
  const response = await userInstance.put(`/tournaments/${id}`, updatedData);
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


export const sendPaymentDetailsLink = async (link,enqId) => {
  const response = await operationDeptInstance.post(
    `/send-payment-link/${enqId}`,{link}
  );
  return response;
};


export const fetchPackageDetails = async () => {
  const response = await operationDeptInstance.get(
    `/get-package-data`,
  );
  return response;
};


export const addNewVoucher = async (formData) => {
  const response = await userInstance.post(
    `/add-new-voucher`,{formData}
  );
  return response;
};

export const fetchAllVouchers = async () => {
  const response = await userInstance.get(
    `/get-all-vouchers`,
  );
  return response;
};

export const getDiscountAmount = async (enqId) => {
  const response = await operationDeptInstance.get(
    `/get-discount-vouchers/${enqId}`,
  );
  return response;
};