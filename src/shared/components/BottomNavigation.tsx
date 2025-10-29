import {
  BottomNavigation as MuiBottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import {
  CheckBox,
  CalendarMonth,
  FitnessCenter,
  Bolt,
  Settings,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

export default function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const getPathValue = (path: string) => {
    if (path.startsWith("/tasks")) return "/tasks";
    if (path.startsWith("/calendar")) return "/calendar";
    if (path.startsWith("/habit")) return "/habit";
    if (path.startsWith("/focus")) return "/focus";
    if (path.startsWith("/settings")) return "/settings";
    return "/tasks";
  };

  const value = getPathValue(location.pathname);

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}
    >
      <MuiBottomNavigation
        value={value}
        onChange={(_, newValue) => {
          navigate(newValue);
        }}
        showLabels
      >
        <BottomNavigationAction
          label="Tasks"
          value="/tasks"
          icon={<CheckBox />}
        />
        <BottomNavigationAction
          label="Calendar"
          value="/calendar"
          icon={<CalendarMonth />}
        />
        <BottomNavigationAction
          label="Habit"
          value="/habit"
          icon={<FitnessCenter />}
          disabled
        />
        <BottomNavigationAction
          label="Focus"
          value="/focus"
          icon={<Bolt />}
        />
        <BottomNavigationAction
          label="Settings"
          value="/settings"
          icon={<Settings />}
        />
      </MuiBottomNavigation>
    </Paper>
  );
}
