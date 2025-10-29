import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  useGetTasksByDateQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "../../tasks/services/taskApi";
import TaskCard from "../../tasks/components/TaskCard";
import { format } from "date-fns";
import { logger } from "../../../shared/utils/logger";
import type { Task } from "@/features/tasks/types/taskTypes";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // FIXED: Correctly destructure 'data' (not 'tasksData')
  const { data, isLoading, refetch } = useGetTasksByDateQuery(formattedDate);
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // FIXED: Safely extract tasks array
  const tasks: Task[] = data?.data || [];

  useEffect(() => {
    refetch();
  }, [selectedDate, refetch]);

  const handleToggleComplete = async (task: Task) => {
    try {
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
    }
  };

  const handleEdit = (task: Task) => {
    logger.log("Edit task", task);
    // Implement edit modal if needed
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id).unwrap();
      refetch();
    } catch (error) {
      logger.error("Failed to delete task", error);
    }
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        📅 Calendar
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          boxShadow: "0 6px 24px rgba(50,75,100,0.10)",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateCalendar
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate || new Date())}
          />
        </LocalizationProvider>
      </Paper>

      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ my: 2, color: "primary.dark", letterSpacing: 0.1 }}
      >
        Tasks for {format(selectedDate, "MMMM dd, yyyy")}
      </Typography>

      {
        isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Card>
            <CardContent>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No tasks for this date
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            display="flex"
            flexWrap="wrap"
            gap={3}
            justifyContent="flex-start"
            sx={{ background: "#fbfbfd", borderRadius: 3, py: 2, px: 1 }} // or "space-between"/"center"
          >
            {tasks.map((task) => (
              <Box key={task.id} flex="1 1 30%" maxWidth="32%" minWidth={260}>
                <TaskCard
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                />
              </Box>
            ))}
          </Box>
        )
        //     (
        //   tasks.map((task: Task) => (
        //     <TaskCard
        //       key={task.id}
        //       task={task}
        //       onEdit={handleEdit}
        //       onDelete={handleDelete}
        //       onToggleComplete={handleToggleComplete}
        //     />
        //   ))
        // )
      }
    </Box>
  );
}
