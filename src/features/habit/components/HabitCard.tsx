import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import FlagIcon from "@mui/icons-material/Flag";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import type { Habit, HabitIcon } from "../types/habitTypes";

interface HabitCardProps {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (id: number, completed: boolean) => void;
}

const timeSectionColors: Record<
  string,
  "primary" | "secondary" | "warning" | "info" | "success"
> = {
  MORNING: "info",
  AFTERNOON: "warning",
  NIGHT: "secondary",
  OTHER: "primary",
  ALL_DAY: "success",
};

const habitIcons: Record<HabitIcon, React.ReactNode> = {
  READ: <MenuBookIcon sx={{ fontSize: 40 }} />,
  WORKOUT: <FitnessCenterIcon sx={{ fontSize: 40 }} />,
  GETUP_EARLY: <WbSunnyIcon sx={{ fontSize: 40 }} />,
  OTHER: <MoreHorizIcon sx={{ fontSize: 40 }} />,
  STUDY: <SchoolIcon sx={{ fontSize: 40 }} />,
  WORK: <WorkIcon sx={{ fontSize: 40 }} />,
};

export default function HabitCard({
  habit,
  onEdit,
  onDelete,
  onToggleComplete,
}: HabitCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        position: "relative",
        opacity: habit.completed ? 0.75 : 1,
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Box
            sx={{
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 48,
            }}
          >
            {habitIcons[habit.icon || "OTHER"]}
          </Box>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  textDecoration: habit.completed ? "line-through" : "none",
                }}
              >
                {capitalizeFirst(habit.title)}
              </Typography>
              {habit.completed && (
                <CheckCircleIcon color="primary" sx={{ fontSize: 24 }} />
              )}
            </Box>
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              flexWrap="wrap"
              mt={1}
            >
              <Chip
                label={capitalizeFirst(habit.timeSection.replace("_", " "))}
                color={timeSectionColors[habit.timeSection] || "default"}
                size="small"
                sx={{ fontWeight: 500 }}
              />
              <Box display="flex" alignItems="center" gap={0.5}>
                <EventIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {formatDate(habit.startDate)}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <FlagIcon fontSize="small" color="action" />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                >
                  {habit.goalDays} {habit.goalDays === 1 ? "day" : "days"} goal
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap={1}
          >
            <Box display="flex" alignItems="center">
              <Typography variant="caption" color="text.secondary" mr={1}>
                {habit.completed ? "Completed" : "Complete"}
              </Typography>
              <Switch
                checked={habit.completed}
                onChange={(e) => onToggleComplete(habit.id, e.target.checked)}
                color="primary"
              />
            </Box>
            <Box display="flex" gap={0.5}>
              <IconButton
                size="small"
                onClick={() => onEdit(habit)}
                color="primary"
                title="Edit"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(habit.id)}
                color="error"
                title="Delete"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
