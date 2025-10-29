import { configureStore } from "@reduxjs/toolkit";
import {useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import authReducer from "../features/auth/store/authSlice";
import themeReducer from "./themeSlice";
import { authApi } from "../features/auth/services/authApi";
import { taskApi } from "../features/tasks/services/taskApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [authApi.reducerPath]: authApi.reducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(taskApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
