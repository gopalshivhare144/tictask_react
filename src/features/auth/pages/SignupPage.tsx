
import { Link, useNavigate } from "react-router-dom";
import type { SignupRequest } from "../types/authTypes";
import { useState } from "react";
import { logger } from "@/shared/utils/logger";
import type { SerializedError } from "@reduxjs/toolkit";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Link as MuiLink,
  Snackbar,
  Alert,
} from "@mui/material";
import { useSignupMutation } from "../services/authApi";
import SignupForm from "../components/SignupForm";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";


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

export default function SignupPage() {
  const navigate = useNavigate();
  const [signup, { isLoading, error }] = useSignupMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSignup = async (data: SignupRequest) => {
    try {
      logger.log("Attempting signup", { email: data.email });
      const response = await signup(data).unwrap();

      logger.log("Signup successful", response);
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      logger.error("Signup failed", err);
    }
  };

  const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError | undefined
  ): string => {
    if (!error) return "";

    if (isFetchBaseQueryError(error)) {
      const errorData = error.data as { message?: string } | undefined;
      return errorData?.message || "Signup failed";
    }

    if (isErrorWithMessage(error)) {
      return error.message;
    }

    return "An error occurred";
  };

  const errorMessage = getErrorMessage(error);

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <Typography
            variant="h4"
            component="h1"
            className="text-center mb-2 font-bold"
          >
            Create Account
          </Typography>
          <Typography
            variant="body2"
            className="text-center mb-6 text-gray-600 dark:text-gray-400"
          >
            Sign up to get started
          </Typography>

          <SignupForm
            onSubmit={handleSignup}
            error={errorMessage}
            isLoading={isLoading}
          />

          <Box className="mt-6 text-center">
            <Typography variant="body2">
              Already have an account?{" "}
              <MuiLink component={Link} to="/login" className="font-semibold">
                Sign in
              </MuiLink>
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          Registration successful! Redirecting to login...
        </Alert>
      </Snackbar>
    </Box>
  );
}
