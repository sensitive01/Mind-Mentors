import axios from "axios";

export const userInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_USER,
});

userInstance.interceptors.request.use(
  (config) => {
    const operationToken = localStorage.getItem("operationAccessToken");
    const token = operationToken
      ? JSON.parse(operationToken).accessToken
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Error in OperationDept Axios request interceptor", error);
    return Promise.reject(error);
  }
);

userInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error in OperationDept Axios response interceptor", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("operationAccessToken");
    }
    return Promise.reject(error);
  }
);
