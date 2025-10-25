import { Component, type ErrorInfo, type ReactNode } from "react";
import { logger } from "../utils/logger";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error("Error caught by boundary:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Box className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
          <Paper className="p-8 max-w-md text-center">
            <Typography variant="h4" className="mb-4 text-red-600">
              Oops! Something went wrong
            </Typography>
            <Typography
              variant="body1"
              className="mb-4 text-gray-600 dark:text-gray-400"
            >
              {this.state.error?.message || "An unexpected error occurred"}
            </Typography>
            <Button variant="contained" onClick={this.handleReset}>
              Go to Home
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
