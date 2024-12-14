import axios from "axios";

export const coachInsatance = axios.create({
  baseURL: import.meta.env.VITE_BASE_ROUTE,
});

coachInsatance.interceptors.request.use(
  (config) => {
    const kidAccessToken = localStorage.getItem("kidAccessToken");
    const extractedToken = kidAccessToken
      ? JSON.parse(kidAccessToken).kidAccessToken
      : null;

    if (extractedToken) {
      config.headers.Authorization = `Bearer ${extractedToken}`;
    }

    return config;
  },
  (error) => {
    console.log("Error in Axios interceptor request", error);
    return Promise.reject(error);
  }
);

coachInsatance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("Error in Axios interceptor response", error);
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem("kidAccessToken");
      } else {
        console.log("Error:", error.response.data);
      }
    } else {
      console.log("Error:", error.message);
    }
    return Promise.reject(error);
  }
);
