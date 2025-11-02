import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { FocusProfile } from "../types/focusTypes";
import FocusTimer from "./FocusTimer";

export default function FocusCard({
  focus,
  icons,
  onStart,
  onPauseOrClear,
  onEdit,
  onDelete,
  updateLastValue,
}: {
  focus: FocusProfile;
  icons: { name: string; icon: React.ReactNode }[];
  onStart: (id: string) => void;
  onPauseOrClear: (id: string, clear?: boolean) => void;
  onEdit: (focus: FocusProfile) => void;
  onDelete: (id: string) => void;
  updateLastValue: (id: string, value: number) => void;
}) {
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        position: "relative",
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 3,
        },
        border: focus.isActive ? "2px solid" : "1px solid",
        borderColor: focus.isActive ? "primary.main" : "divider",
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Box
            sx={{
              fontSize: 40,
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 48,
            }}
          >
            {icons.find((icon) => icon.name === focus.icon)?.icon}
          </Box>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography variant="h6" fontWeight={600}>
                {capitalizeFirst(focus.name)}
              </Typography>
              {focus.mode === "pomodoro" ? (
                <Chip
                  label={`Pomo (${focus.pomoMinutes || 120} min)`}
                  color="secondary"
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              ) : (
                <Chip
                  label="Stopwatch"
                  color="info"
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              )}
            </Box>
            <FocusTimer
              focus={focus}
              onStart={onStart}
              onPauseOrClear={onPauseOrClear}
              updateLastValue={updateLastValue}
            />
          </Box>
          <Box display="flex" flexDirection="column" gap={0.5}>
            <IconButton
              size="small"
              onClick={() => onEdit(focus)}
              color="primary"
              title="Edit"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(focus.id)}
              color="error"
              title="Delete"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
