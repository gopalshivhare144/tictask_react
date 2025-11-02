import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import { useState, useEffect } from "react";
import type { Habit, TimeSection, HabitIcon } from "../types/habitTypes";

interface HabitDialogProps {
  open: boolean;
  habit?: Habit | null;
  onClose: () => void;
  onSave: (habit: Partial<Habit>) => void;
}

const timeSections: TimeSection[] = [
  "MORNING",
  "AFTERNOON",
  "NIGHT",
  "OTHER",
  "ALL_DAY",
];

const habitIconOptions: {
  value: HabitIcon;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "READ", label: "Read", icon: <MenuBookIcon /> },
  { value: "WORKOUT", label: "Workout", icon: <FitnessCenterIcon /> },
  { value: "GETUP_EARLY", label: "Get Up Early", icon: <WbSunnyIcon /> },
  { value: "STUDY", label: "Study", icon: <SchoolIcon /> },
  { value: "WORK", label: "Work", icon: <WorkIcon /> },
  { value: "OTHER", label: "Other", icon: <MoreHorizIcon /> },
];

export default function HabitDialog({
  open,
  habit,
  onClose,
  onSave,
}: HabitDialogProps) {
  const [title, setTitle] = useState("");
  const [quote, setQuote] = useState("");
  const [startDate, setStartDate] = useState("");
  const [timeSection, setTimeSection] = useState<TimeSection>("MORNING");
  const [goalDays, setGoalDays] = useState("");
  const [icon, setIcon] = useState<HabitIcon>("OTHER");

  useEffect(() => {
    if (habit) {
      setTitle(habit.title);
      setQuote(habit.quote);
      setStartDate(habit.startDate);
      setTimeSection(habit.timeSection);
      setGoalDays(habit.goalDays.toString());
      setIcon(habit.icon || "OTHER");
    } else {
      setTitle("");
      setQuote("");
      setStartDate(new Date().toISOString().split("T")[0]);
      setTimeSection("MORNING");
      setGoalDays("");
      setIcon("OTHER");
    }
  }, [habit, open]);

  const handleGoalDaysChange = (value: string) => {
    // Only allow numeric characters
    const cleaned = value.replace(/\D/g, "");
    setGoalDays(cleaned);
  };

  const handleSubmit = () => {
    const goalDaysNum = parseInt(goalDays, 10) || 1;
    if (!title.trim() || !quote.trim() || !startDate || goalDaysNum < 1) {
      return;
    }

    onSave({
      ...(habit && { id: habit.id }),
      title: title.trim(),
      quote: quote.trim(),
      startDate,
      timeSection,
      goalDays: Math.max(1, Math.min(365, goalDaysNum)),
      completed: habit?.completed || false,
      icon,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{habit ? "Edit Habit" : "Create New Habit"}</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Quote / Motivation"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            fullWidth
            required
            multiline
            rows={2}
          />
          <Box>
            <Typography variant="body2" fontWeight={500} mb={1}>
              Choose Icon
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {habitIconOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={icon === option.value ? "contained" : "outlined"}
                  onClick={() => setIcon(option.value)}
                  sx={{
                    minWidth: 80,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    py: 1,
                  }}
                >
                  {option.icon}
                  <Typography variant="caption">{option.label}</Typography>
                </Button>
              ))}
            </Box>
          </Box>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Time Section"
            value={timeSection}
            onChange={(e) => setTimeSection(e.target.value as TimeSection)}
            fullWidth
            required
            select
          >
            {timeSections.map((section) => (
              <MenuItem key={section} value={section}>
                {section.replace("_", " ")}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Goal Days"
            value={goalDays}
            onChange={(e) => handleGoalDaysChange(e.target.value)}
            fullWidth
            required
            placeholder="Enter number of days"
            helperText="Number of days you want to maintain this habit (1-365)"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={
            !title.trim() ||
            !quote.trim() ||
            !startDate ||
            !goalDays ||
            parseInt(goalDays) < 1
          }
        >
          {habit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
