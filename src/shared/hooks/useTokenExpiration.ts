import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/store";
import { logout } from "../../features/auth/store/authSlice";
import { useNavigate } from "react-router-dom";
import { logger } from "../utils/logger";

interface TokenPayload {
  exp: number;
  iat: number;
  sub: string;
}

export const useTokenExpiration = (token: string | null) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;

    try {
      // Decode JWT token
      const parts = token.split(".");
      if (parts.length !== 3) return;

      const payload: TokenPayload = JSON.parse(atob(parts[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeLeft = expirationTime - currentTime;

      logger.log("Token expiration check", {
        expiresAt: new Date(expirationTime).toISOString(),
        timeLeftMinutes: Math.floor(timeLeft / 60000),
      });

      // If token already expired
      if (timeLeft <= 0) {
        logger.warn("Token already expired");
        dispatch(logout());
        navigate("/login");
        return;
      }

      setTimeUntilExpiry(timeLeft);

      // Show warning 5 minutes before expiry
      const warningTime = timeLeft - 5 * 60 * 1000; // 5 minutes before
      if (warningTime > 0) {
        const warningTimeout = setTimeout(() => {
          setShowWarning(true);
          logger.warn("Token expiring soon - 5 minutes remaining");
        }, warningTime);

        // Auto-logout when token expires
        const expiryTimeout = setTimeout(() => {
          logger.warn("Token expired - logging out");
          dispatch(logout());
          navigate("/login");
        }, timeLeft);

        return () => {
          clearTimeout(warningTimeout);
          clearTimeout(expiryTimeout);
        };
      } else {
        // Less than 5 minutes remaining, show warning immediately
        setShowWarning(true);
        const expiryTimeout = setTimeout(() => {
          logger.warn("Token expired - logging out");
          dispatch(logout());
          navigate("/login");
        }, timeLeft);

        return () => clearTimeout(expiryTimeout);
      }
    } catch (error) {
      logger.error("Failed to decode token", error);
    }
  }, [token, dispatch, navigate]);

  // User dismissed the warning - they acknowledge they'll be logged out
  const dismissWarning = () => {
    setShowWarning(false);
    logger.log("User dismissed session warning");
  };

  return { showWarning, timeUntilExpiry, dismissWarning };
};
