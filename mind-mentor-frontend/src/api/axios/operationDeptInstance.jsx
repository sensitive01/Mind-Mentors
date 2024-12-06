import axios from "axios";

export const operationDeptInstance = axios.create({
  baseURL: import.meta.env.VITE_EMPLOYEE_BASE_ROUTE,
});

operationDeptInstance.interceptors.request.use(
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

operationDeptInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error in OperationDept Axios response interceptor", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("operationAccessToken");
    }
    return Promise.reject(error);
  }
);
