import { serviceInstance } from "../../axios/serviceInstance";



export const sheduleTimeTable = async (empId,shedules) => {
  const response = await serviceInstance.post(
    `/service/save-class-shedule/${empId}`,{shedules},
    
  );
  return response;
};


export const getClassShedules = async () => {
  const response = await serviceInstance.get(
    `/service/get-class-shedule`,
    
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