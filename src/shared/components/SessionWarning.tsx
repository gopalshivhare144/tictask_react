import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
} from "@mui/material";
import { Warning } from "@mui/icons-material";
import { useEffect, useState } from "react";

interface SessionWarningProps {
  open: boolean;
  onDismiss: () => void;
  onLogout: () => void;
  timeUntilExpiry: number | null;
}

export default function SessionWarning({
  open,
  onDismiss,
  onLogout,
  timeUntilExpiry,
}: SessionWarningProps) {
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    if (open && timeUntilExpiry) {
      const secondsLeft = Math.floor(timeUntilExpiry / 1000);
      setCountdown(secondsLeft);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [open, timeUntilExpiry]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (countdown / 300) * 100;

  return (
    <Dialog open={open} onClose={onDismiss} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning color="warning" />
          Session Expiring Soon
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your session will expire in <strong>{formatTime(countdown)}</strong>.
          You will be automatically logged out for security reasons.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please save your work. You'll need to log in again after the session
          expires.
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          color={countdown < 60 ? "error" : "warning"}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onDismiss}>OK</Button>
        <Button onClick={onLogout} color="error" variant="contained">
          Logout Now
        </Button>
      </DialogActions>
    </Dialog>
  );
}
