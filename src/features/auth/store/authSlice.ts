import { logger } from "@/shared/utils/logger";
import type { AuthState, User } from "../types/authTypes";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


const getInitialState = (): AuthState => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  let user: User | null = null;

  if (userStr) {
    try {
      user = JSON.parse(userStr) as User;
    } catch (error) {
      logger.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("user");
    }
  }

  logger.log("Initializing auth state from localStorage", {
    user,
    hasToken: !!token,
  });

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;

      // Persist to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      logger.log("User credentials set", {
        userId: user.id,
        email: user.email,
      });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      logger.log("User logged out");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
