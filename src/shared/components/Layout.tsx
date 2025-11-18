import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import BottomNavigation from "./BottomNavigation";
import SessionWarning from "./SessionWarning";
import { useAuth } from "../hooks/useAuth";
import { useTokenExpiration } from "../hooks/useTokenExpiration";
import { useAppDispatch } from "../../store/store";
import { logout } from "../../features/auth/store/authSlice";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { token } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showWarning, timeUntilExpiry, dismissWarning } =
    useTokenExpiration(token);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "background.default",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h4"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            TicTask
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
        {children}
      </Container>

      <BottomNavigation />

      <SessionWarning
        open={showWarning}
        onDismiss={dismissWarning}
        onLogout={handleLogout}
        timeUntilExpiry={timeUntilExpiry}
      />
    </Box>
  );
}
