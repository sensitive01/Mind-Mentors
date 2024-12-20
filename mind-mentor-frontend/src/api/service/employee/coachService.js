import { coachInsatance } from "../../axios/coachInstance";

export const saveAvailableDays = async (id, data) => {
  const response = await coachInsatance.post(
    `/coach/shedule-class-availability/${id}`,
    { data }
  );
  return response;
};

export const fetchCoachData = async () => {
  const response = await coachInsatance.get(
    `/coach/fetch-coach-availability`,
    
  );
  return response;
};

export const getMyClassData = async (empId) => {
  const response = await coachInsatance.get(
    `/coach/fetch-my-sheduled-class/${empId}`,
    
  );
  return response;
};


export const addFeedbackAndAttandance = async (empId,classId,submissionData) => {
  const response = await coachInsatance.post(
    `/coach/add-class-feedback-attandance/${empId}/${classId}`,{submissionData},
    
  );
  return response;
};



export const getClassData = async (classId) => {
  const response = await coachInsatance.get(
    `/coach/get-class-data/${classId}`,
    
  );
  return response;
};