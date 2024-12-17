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