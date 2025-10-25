import {
  Card,
  CardContent,
  Typography,
  Box,
  Link as MuiLink,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/authApi";
import { useAppDispatch } from "../../../store/store";
import { setCredentials } from "../store/authSlice";
import { useState } from "react";
import { logger } from "../../../shared/utils/logger";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";
import LoginForm from "../components/LoginForm";
import type { LoginRequest } from "../types/authTypes";

interface ErrorWithMessage {
  message: string;
}

const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return typeof error === "object" && error !== null && "status" in error;
};

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLogin = async (data:LoginRequest) => {
    try {
      logger.log("Attempting login", { email: data.email });
      const response = await login(data).unwrap();

      logger.log("Login successful", response);

      dispatch(
        setCredentials({
          user: {
            id: response.data.id,
            email: response.data.email,
            roles: response.data.roles,
          },
          token: response.data.token,
        })
      );

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      logger.error("Login failed", err);
    }
  };

  const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError | undefined
  ): string => {
    if (!error) return "";

    if (isFetchBaseQueryError(error)) {
      const errorData = error.data as { message?: string } | undefined;
      return errorData?.message || "Login failed";
    }

    if (isErrorWithMessage(error)) {
      return error.message;
    }

    return "An error occurred";
  };

  const errorMessage = getErrorMessage(error);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        padding: 3,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 450,
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          <LoginForm
            onSubmit={handleLogin}
            error={errorMessage}
            isLoading={isLoading}
          />

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <MuiLink
                component={Link}
                to="/signup"
                sx={{ fontWeight: 600, textDecoration: "none" }}
              >
                Sign up
              </MuiLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setShowSuccess(false)}
          sx={{ width: "100%" }}
        >
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Box>
  );
}
