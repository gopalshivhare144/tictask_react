import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { logger } from "../utils/logger";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
    }
    logger.log("API Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: AxiosError) => {
    logger.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.log("API Response:", response.status, response.config.url);
    return response;
  },
  (error: AxiosError) => {
    logger.error("Response Error:", error.response?.status, error.message);

    if (error.response?.status === 401) {
      logger.warn("Unauthorized - clearing auth");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
