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
import type { Task } from "../../tasks/types/taskTypes";
import { useGetActiveHabitsByDateQuery } from "@/features/habit/services/habitApi";
import type { Habit } from "@/features/habit/types/habitTypes";
import { getHabitIcon } from "@/features/habit/utils/habitIconStorage";
import HabitCard from "@/features/habit/components/HabitCard";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Fetch tasks
  const {
    data:tasksData,
    isLoading: tasksLoading,
    refetch: refetchTasks,
  } = useGetTasksByDateQuery(formattedDate);

  // Fetch habits
  const {
   data: habitsData,
    isLoading: habitsLoading,
    refetch: refetchHabits,
  } = useGetActiveHabitsByDateQuery(formattedDate);

  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const tasks: Task[] = tasksData?.data || [];
  const habitsFromApi: Habit[] = habitsData?.data || [];

  // Add icons from localStorage
  const habits: Habit[] = habitsFromApi.map((habit) => ({
    ...habit,
    icon: getHabitIcon(habit.id),
  }));

  useEffect(() => {
    refetchTasks();
    refetchHabits();
  }, [selectedDate, refetchTasks, refetchHabits]);

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
      refetchTasks();
    } catch (error) {
      logger.error("Failed to toggle task", error);
    }
  };

  const handleEdit = (task: Task) => {
    logger.log("Edit task", task);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id).unwrap();
      refetchTasks();
    } catch (error) {
      logger.error("Failed to delete task", error);
    }
  };

  const isLoading = tasksLoading || habitsLoading;

  return (
    <Box sx={{ px: 8, py: 2, mx: "auto" }}>
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
        variant="h5"
        fontWeight={700}
        sx={{ my: 3, color: "primary.dark", letterSpacing: 0.1 }}
      >
        {format(selectedDate, "MMMM dd, yyyy")}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Tasks Section */}
          <Box mb={4}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 2, color: "text.primary" }}
            >
              Tasks ({tasks.length})
            </Typography>
            {tasks.length === 0 ? (
              <Card>
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
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
                sx={{ background: "#fbfbfd", borderRadius: 3, py: 2, px: 1 }}
              >
                {tasks.map((task) => (
                  <Box
                    key={task.id}
                    flex="1 1 30%"
                    maxWidth="32%"
                    minWidth={260}
                  >
                    <TaskCard
                      task={task}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onToggleComplete={handleToggleComplete}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Habits Section */}
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 2, color: "text.primary" }}
            >
              Habits ({habits.length})
            </Typography>
            {habits.length === 0 ? (
              <Card>
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", py: 2 }}
                  >
                    No habits for this date
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{ background: "#fbfbfd", borderRadius: 3, py: 2, px: 1 }}
              >
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onToggleComplete={() => {}}
                  />
                ))}
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
