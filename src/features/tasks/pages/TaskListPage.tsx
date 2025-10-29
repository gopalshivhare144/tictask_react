import {
  Box,
  Typography,
  Fab,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import SearchBar from "../components/SearchBar";
import {
  useGetTasksQuery,
  useSearchTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../services/taskApi";
import { logger } from "../../../shared/utils/logger";
import type { Task, TaskCreateRequest } from "../types/taskTypes";

export default function TaskListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const size = 100; // fetch all, increase if you want full board
  const searchResult = useSearchTasksQuery(
    { title: searchQuery, page: 0, size },
    { skip: !searchQuery }
  );
  const allTasksResult = useGetTasksQuery(
    { page: 0, size },
    { skip: !!searchQuery }
  );
  const activeResult = searchQuery ? searchResult : allTasksResult;
  const { data, isLoading, refetch } = activeResult;

  const allTasks: Task[] = data?.data?.content || [];
  const activeTasks = allTasks.filter((t) => !t.completed);
  const completedTasks = allTasks.filter((t) => t.completed);
  const sortedTasks = [...activeTasks, ...completedTasks];

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const handleCreateTask = async (taskData: TaskCreateRequest) => {
    try {
      logger.log("Creating task", taskData);
      await createTask(taskData).unwrap();
      setIsModalOpen(false);
      setSnackbar({
        open: true,
        message: "Task created successfully!",
        severity: "success",
      });
      refetch();
    } catch (error) {
      logger.error("Failed to create task", error);
      setSnackbar({
        open: true,
        message: "Failed to create task",
        severity: "error",
      });
    }
  };

  const handleUpdateTask = async (taskData: TaskCreateRequest) => {
    if (!selectedTask) return;
    try {
      logger.log("Updating task", selectedTask.id, taskData);
      await updateTask({ id: selectedTask.id, task: taskData }).unwrap();
      setIsModalOpen(false);
      setSelectedTask(undefined);
      setSnackbar({
        open: true,
        message: "Task updated successfully!",
        severity: "success",
      });
      refetch();
    } catch (error) {
      logger.error("Failed to update task", error);
      setSnackbar({
        open: true,
        message: "Failed to update task",
        severity: "error",
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    try {
      logger.log("Deleting task", taskToDelete);
      await deleteTask(taskToDelete).unwrap();
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
      setSnackbar({
        open: true,
        message: "Task deleted successfully!",
        severity: "success",
      });
      refetch();
    } catch (error) {
      logger.error("Failed to delete task", error);
      setSnackbar({
        open: true,
        message: "Failed to delete task",
        severity: "error",
      });
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      logger.log("Toggling task completion", task.id);
      await updateTask({
        id: task.id,
        task: {
          title: task.title,
          description: task.description,
          priority: task.priority,
          taskDate: task.taskDate,
          completed: !task.completed,
        },
      }).unwrap();
      refetch();
    } catch (error) {
      logger.error("Failed to toggle task", error);
      setSnackbar({
        open: true,
        message: "Failed to update task",
        severity: "error",
      });
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleAddTask = () => {
    setSelectedTask(undefined);
    setIsModalOpen(true);
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        📝 My Tasks
      </Typography>

      <Box alignItems="center" mb={2} mt={4}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" gap={3} mx={4} overflow="auto">
          <TaskColumn
            title="All Tasks"
            tasks={allTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
          <TaskColumn
            title="Active Tasks"
            tasks={activeTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
          <TaskColumn
            title="Completed Tasks"
            tasks={completedTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add task"
        onClick={handleAddTask}
        sx={{ position: "fixed", bottom: 80, right: 24 }}
      >
        <Add />
      </Fab>

      <TaskModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(undefined);
        }}
        onSubmit={selectedTask ? handleUpdateTask : handleCreateTask}
        task={selectedTask}
        isLoading={isCreating || isUpdating}
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Task</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteTask}
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function TaskColumn({
  title,
  tasks,
  onEdit,
  onDelete,
  onToggleComplete,
}: {
  title: string;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleComplete: (task: Task) => void;
}) {
  return (
    <Paper
      elevation={1}
      sx={{
        flex: 1,
        minWidth: 320,
        maxWidth: 370,
        p: 2,
        bgcolor: "#fafbfc",
        borderRadius: 4,
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Stack spacing={2}>
        {tasks.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No tasks.
          </Typography>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))
        )}
      </Stack>
    </Paper>
  );
}
