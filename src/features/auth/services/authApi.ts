import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from "../types/authTypes";
import { axiosBaseQuery } from "@/shared/services/baseApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (payload) => ({
        url: "/auth/signup",
        method: "POST",
        data: payload,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (payload) => ({
        url: "/auth/login",
        method: "POST",
        data: payload,
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = authApi;
