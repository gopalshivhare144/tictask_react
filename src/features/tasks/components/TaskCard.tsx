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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { type Task, type TaskPriority } from "../types/taskTypes";
import { format } from "date-fns";

function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const getPriorityColor = (
  priority: TaskPriority
): "error" | "warning" | "info" | "default" => {
  switch (priority) {
    case "HIGH":
      return "error";
    case "MEDIUM":
      return "warning";
    case "LOW":
      return "info";
    default:
      return "default";
  }
};

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (task: Task) => void;
}

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}: TaskCardProps) {
  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        position: "relative",
        opacity: task.completed ? 0.75 : 1,
        transition: "all 0.2s",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  textDecoration: task.completed ? "line-through" : "none",
                }}
              >
                {capitalize(task.title)}
              </Typography>
              {task.completed && (
                <CheckCircleIcon color="primary" sx={{ fontSize: 24 }} />
              )}
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {capitalize(task.description)}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Chip
                label={task.priority}
                color={getPriorityColor(task.priority)}
                size="small"
                sx={{ fontWeight: 500 }}
              />
              <Box display="flex" alignItems="center" gap={0.5}>
                <EventIcon fontSize="small" color="action" />
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(task.taskDate), "MMM dd, yyyy")}
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
                {task.completed ? "Completed" : "Complete"}
              </Typography>
              <Switch
                checked={task.completed}
                onChange={() => onToggleComplete(task)}
                color="primary"
              />
            </Box>
            <Box display="flex" gap={0.5}>
              <IconButton
                size="small"
                onClick={() => onEdit(task)}
                color="primary"
                title="Edit"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(task.id)}
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
