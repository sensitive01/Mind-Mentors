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