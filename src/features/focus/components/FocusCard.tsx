import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
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
  return (
    <Paper
      elevation={focus.isActive ? 8 : 2}
      sx={{
        borderRadius: 4,
        p: 3,
        display: "flex",
        alignItems: "center",
        gap: 4,
        bgcolor: focus.isActive ? "primary.lighter" : "background.paper",
        boxShadow: focus.isActive ? 8 : 2,
        minHeight: 110,
        width: "100%",
        position: "relative",
      }}
    >
      <Box fontSize={48} color="primary.main" minWidth={64} mr={2}>
        {icons.find((icon) => icon.name === focus.icon)?.icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="h5" fontWeight={700}>
          {focus.name}
        </Typography>
        {focus.mode === "pomodoro" ? (
          <Chip
            label={`Pomodoro (${focus.pomoMinutes || 120} min)`}
            color="secondary"
            size="small"
            sx={{ mt: 1, fontWeight: 500 }}
          />
        ) : (
          <Chip
            label="Stopwatch"
            color="info"
            size="small"
            sx={{ mt: 1, fontWeight: 500 }}
          />
        )}
        <FocusTimer
          focus={focus}
          onStart={onStart}
          onPauseOrClear={onPauseOrClear}
          updateLastValue={updateLastValue}
        />
      </Box>
      {!focus.id?.startsWith("default-") && (
        <Stack
          direction="row"
          spacing={1}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <Button
            size="small"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => onEdit(focus)}
            sx={{ textTransform: "none" }}
          >
            Edit
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(focus.id)}
            sx={{ textTransform: "none" }}
          >
            Delete
          </Button>
        </Stack>
      )}
    </Paper>
  );
}
