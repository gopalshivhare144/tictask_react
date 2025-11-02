import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
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
import AddIcon from "@mui/icons-material/Add";
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

  const size = 100;
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
    <Box sx={{ px: 8,py:2, mx: "auto" }}>  
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary.dark">
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, fontWeight: 600 }}
          onClick={handleAddTask}
        >
          New Task
        </Button>
      </Box>

      <Box mb={3}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          {/* Active Tasks Section */}
          <Box mb={4}>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Active Tasks ({activeTasks.length})
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {activeTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No active tasks.
                </Typography>
              ) : (
                activeTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                  />
                ))
              )}
            </Box>
          </Box>

          {/* Completed Tasks Section */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Completed Tasks ({completedTasks.length})
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {completedTasks.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No completed tasks.
                </Typography>
              ) : (
                completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                  />
                ))
              )}
            </Box>
          </Box>
        </Box>
      )}

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
