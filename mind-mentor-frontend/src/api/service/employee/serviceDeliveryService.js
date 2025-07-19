import { serviceInstance } from "../../axios/serviceInstance";



export const sheduleTimeTable = async (empId,shedules) => {
  const response = await serviceInstance.post(
    `/service/save-class-shedule/${empId}`,{shedules},
    
  );
  return response;
};


export const getClassShedules = async (department) => {
  const response = await serviceInstance.get(
    `/service/get-class-shedule?department=${department}`,
    
  );
  return response.data.classData;
};

export const centerClassTimeTable = async (empId) => {
  const response = await serviceInstance.get(
    `/service/get-center-class-shedule?empId=${empId}`,
    
  );
  return response.data.classData;
};

export const fetchCoachData = async () => {
  const response = await serviceInstance.get(
    `/service/get-coach-data`,
    
  );
  return response;
};




export const saveAvailabletime = async (data) => {
  const response = await serviceInstance.post(
    `/service/save-coach-availabledays`,{data}
    
  );
  return response;
};


export const getCoachAvailabilityData = async () => {
  const response = await serviceInstance.get(
    `/service/get-coach-availabledata-table`
    
  );
  return response;
};


export const getClassandStudentData = async (id) => {
  const response = await serviceInstance.get(
    `/service/get-class-student-data/${id}`
    
  );
  return response;
};


export const saveClassDetails = async (classId,students,empId) => {
  const response = await serviceInstance.post(`/service/save-class-data/${empId}`,{classId,students});
  return response;
};


export const updateCoachAvailability = async (id,data) => {
  const response = await serviceInstance.put(`/service/edit-coach-availability/${id}`,{data});
  return response;
};

export const deleteCoachAvailability = async (id) => {
  const response = await serviceInstance.delete(`/service/delete-coach-availability/${id}`);
  return response;
};

export const fechAllActiveEnrolledEnquiry = async () => {
  const response = await serviceInstance.get(`/service/get-active-enquiry-data`);
  return response.data;
};

export const getActiveKidData = async (enqId) => {
  const response = await serviceInstance.get(`/service/get-active-kid-class-data/${enqId}`);
  return response.data;
};




export const assignWholeClass = async (submissionData) => {
  const response = await serviceInstance.post(`/service/assign-whole-class`,{submissionData});
  return response.data;
};


export const dispaySelectedClass = async (enqId) => {
  const response = await serviceInstance.get(`/service/display-selected-class/${enqId}`);
  return response;
};


export const getScheduledClassData = async (enqId) => {
  const response = await serviceInstance.get(`/service/get-all-scheduled-class-data/${enqId}`);
  return response;
};

export const getLastClassData = async (classId) => {
  const response = await serviceInstance.get(`/service/get-last-class-data-for-extra-class/${classId}`);
  return response;
};

export const pauseTheClass = async (enqId,updatedData,pauseRemarks,classId) => {
  const response = await serviceInstance.post(`/service/pause-class-temporary/${enqId}/${classId}`,{updatedData,pauseRemarks});
  return response;
};

export const resumeTheClass = async (enqId,updatedData,classId) => {
  const response = await serviceInstance.post(`/service/resume-the-class/${enqId}/${classId}`,{updatedData});
  return response;
};

export const getClassKidData = async (classId) => {
  const response = await serviceInstance.get(`/service/get-class-student-data/${classId}`);
  return response;
};

export const addExtraClassToKid = async (classId,data) => {
  const response = await serviceInstance.put(`/service/add-extra-class-to-kid/${classId}`,{data});
  return response;
};