import { kidInstance } from "../../axios/KidInstance";

export const validateKidChessId = async (chessId) => {
  try {
    const response = await kidInstance.post(`/kid/login`, {
      chessId,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const validatePIN = async (pin, state) => {
  try {
    const response = await kidInstance.post(`/kid/verify-pin`, {
      pin,
      state,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const getKidDemoClass = async (id) => {
  try {
    console.log("democlass",id)
    const response = await kidInstance.get(`/kid/get-democlass/${id}`);
    return response;
  } catch (err) {
    return err;
  }
};



export const getMyClassData = async (kidId) => {
  try {
    const response = await kidInstance.get(
      `/kid/get-my-class-data/${kidId}`
    );
    return response;
  } catch (err) {
    return err;
  }
};