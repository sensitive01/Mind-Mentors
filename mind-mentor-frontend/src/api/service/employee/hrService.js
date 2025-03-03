import { hrInstance } from "../../axios/hrInstance";

export const addNewEmployee = async (formData) => {
  const response = await hrInstance.post(`/hr/add-new-employee`, { formData });
  return response;
};


export const getAllPhysicalcenters = async () => {
    const response = await hrInstance.get(`/hr/get-all-physicalcenters`);
    return response;
  };
