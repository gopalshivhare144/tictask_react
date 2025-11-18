import type { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { AxiosRequestConfig, AxiosError } from "axios";
import axiosInstance from "./axiosInstance";

/**
 * Shape of arguments accepted by axiosBaseQuery
 */
export type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: Record<string, unknown>;
};

/**
 * Error returned by baseQuery
 */
export type AxiosBaseQueryError =
  | { status: number; data?: unknown }
  | { message: string };

/**
 * axiosBaseQuery - adapter so RTK Query can use axiosInstance
 */
export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const response = await axiosInstance.request({
        url,
        method,
        data,
        params,
      });
      return { data: response.data };
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return {
          error: { status: error.response.status, data: error.response.data },
        };
      }
      return { error: { status: 500, data: { message: error.message } } };
    }
  };
