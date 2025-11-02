import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { logout } from "../../auth/store/authSlice";
import ThemeToggle from "../../../shared/components/ThemeToggle";
import { useAuth } from "../../../shared/hooks/useAuth";

export default function SettingsPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const themeMode = useAppSelector((state) => state.theme.mode);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Box sx={{ px: 8, py: 2, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        ⚙️ Settings
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Account Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Email" secondary={user?.email} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Role" secondary={user?.roles} />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Appearance
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Theme"
                secondary={`Current: ${
                  themeMode === "dark" ? "Dark Mode" : "Light Mode"
                }`}
              />
              <ListItemSecondaryAction>
                <ThemeToggle />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Account Actions
          </Typography>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
