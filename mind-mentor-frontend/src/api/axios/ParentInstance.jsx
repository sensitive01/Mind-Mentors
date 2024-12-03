import axios from "axios";

export const parentInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_ROUTE,
});

parentInstance.interceptors.request.use(
  (config) => {
    const parentToken = localStorage.getItem("parentAccessToken");
    const extractedToken = parentToken
      ? JSON.parse(parentToken).accessToken
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

parentInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("Error in Axios interceptor response", error);
      const { status } = error.response;
      if (status === 401) {
        localStorage.removeItem("accessToken");
      } else {
        console.log("Error:", error.response.data);
      }
    } else {
      console.log("Error:", error.message);
    }
    return Promise.reject(error);
  }
);
