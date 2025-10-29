import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import type { Task, TaskCreateRequest } from "../types/taskTypes";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  completed: z.boolean(),
  taskDate: z.string().min(1, "Task date is required"),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (_:TaskCreateRequest) => void;
  task?: Task;
  isLoading: boolean;
}

export default function TaskModal({
  open,
  onClose,
  onSubmit,
  task,
  isLoading,
}: TaskModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "LOW",
      completed: false,
      taskDate: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: task.completed,
        taskDate: task.taskDate,
      });
    } else {
      reset({
        title: "",
        description: "",
        priority: "LOW",
        completed: false,
        taskDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [task, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            {...register("title")}
            label="Title"
            fullWidth
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={isLoading}
            autoFocus
          />

          <TextField
            {...register("description")}
            label="Description"
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
            disabled={isLoading}
          />

          <TextField
            {...register("taskDate")}
            label="Task Date"
            type="date"
            fullWidth
            error={!!errors.taskDate}
            helperText={errors.taskDate?.message}
            disabled={isLoading}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            {...register("priority")}
            label="Priority"
            select
            fullWidth
            error={!!errors.priority}
            helperText={errors.priority?.message}
            disabled={isLoading}
            defaultValue="LOW"
          >
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
          </TextField>

          <FormControlLabel
            control={
              <Checkbox {...register("completed")} disabled={isLoading} />
            }
            label="Mark as completed"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleFormSubmit)}
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
