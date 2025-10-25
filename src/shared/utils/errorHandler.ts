import { AxiosError } from "axios";
import { logger } from "./logger";


export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

export const handleApiError = (error: unknown): ApiError => {
  logger.error("API Error:", error);

  if (error instanceof AxiosError) {
    const errorData = error.response?.data as ErrorResponse | undefined;

    return {
      message: errorData?.message || errorData?.error || "An error occurred",
      status: error.response?.status,
      data: error.response?.data,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message || "An unexpected error occurred",
    };
  }

  return {
    message: "An unknown error occurred",
  };
};

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "An unknown error occurred";
};
