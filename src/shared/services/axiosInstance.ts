import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { logger } from "../utils/logger";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    logger.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: AxiosError) => {
    logger.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    logger.error("Response Error:", error.response?.status, error.message);

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      logger.warn("Unauthorized access - clearing auth state");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
