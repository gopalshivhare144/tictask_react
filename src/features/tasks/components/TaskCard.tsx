import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Checkbox,
} from "@mui/material";
import { Edit, Delete, CalendarMonth } from "@mui/icons-material";
import { type Task, type TaskPriority } from "../types/taskTypes";
import { format } from "date-fns";

function capitalize(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const getPriorityColor = (priority: TaskPriority) => {
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
        mb: 2,
        borderRadius: 3,
        boxShadow: 2,
        bgcolor: "background.paper",
        minWidth: 250,
        maxWidth: 370,
        opacity: task.completed ? 0.7 : 1,
        textDecoration: task.completed ? "line-through" : "none",
      }}
    >
      <CardContent sx={{ pb: 1.5, pl: 1 }}>
        <Box display="flex" alignItems="flex-start">
          <Checkbox
            color="primary"
            checked={task.completed}
            onChange={() => onToggleComplete(task)}
            sx={{ p: 0.5, mr: 1, mt: 0.5 }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              fontWeight={700}
              noWrap
              sx={{ textDecoration: task.completed ? "line-through" : "none" }}
            >
              {capitalize(task.title)}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1.5,
                mt: 0.5,
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {capitalize(task.description)}
            </Typography>
            {/* Priority - Calendar - Date Row */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={task.priority}
                  color={getPriorityColor(task.priority)}
                  size="small"
                  sx={{
                    fontWeight: 400,
                    px: 1,
                    py: 0,
                    borderRadius: 2,
                    minWidth: 56,
                    textAlign: "center",
                  }}
                />
                <CalendarMonth
                  fontSize="small"
                  sx={{ color: "action.active" }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {format(new Date(task.taskDate), "yyyy-MM-dd")}
                </Typography>
              </Box>
            </Box>
            {/* Action Row */}
            <Box display="flex" justifyContent="flex-end" mt={0.5} gap={1}>
              <IconButton
                size="small"
                sx={{
                  border: "1.5px solid #e0e0e0",
                  bgcolor: "#fff",
                  transition: "box-shadow .2s",
                  "&:hover": { boxShadow: 2, color: "primary.main" },
                }}
                onClick={() => onEdit(task)}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  border: "1.5px solid #ffe0e0",
                  bgcolor: "#fff",
                  color: "error.main",
                  transition: "box-shadow .2s",
                  "&:hover": {
                    boxShadow: 2,
                    bgcolor: "#ffeaea",
                    color: "error.dark",
                  },
                }}
                onClick={() => onDelete(task.id)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
