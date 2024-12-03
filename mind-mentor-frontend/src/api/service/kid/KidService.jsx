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

export const validatePIN = async (pin,state) => {
    try {
      const response = await kidInstance.post(`/kid/verify-pin`, {
        pin,state,
      });
      return response;
    } catch (err) {
      return err;
    }
  };
