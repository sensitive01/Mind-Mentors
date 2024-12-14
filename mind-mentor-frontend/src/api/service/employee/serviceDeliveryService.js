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