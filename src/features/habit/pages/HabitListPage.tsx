import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import {
  useGetHabitsQuery,
  useCreateHabitMutation,
  useUpdateHabitMutation,
  useDeleteHabitMutation,
} from "../services/habitApi";
import HabitCard from "../components/HabitCard";
import HabitDialog from "../components/HabitDialog";
import type { Habit } from "../types/habitTypes";
import {
  saveHabitIcon,
  getHabitIcon,
  deleteHabitIcon,
} from "../utils/habitIconStorage";

export default function HabitListPage() {
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const { data, isLoading, error } = useGetHabitsQuery({ page, size: 10 });
  const [createHabit] = useCreateHabitMutation();
  const [updateHabit] = useUpdateHabitMutation();
  const [deleteHabit] = useDeleteHabitMutation();

  const handleCreate = () => {
    setEditingHabit(null);
    setDialogOpen(true);
  };

  const handleEdit = (habit: Habit) => {
    const habitWithIcon = { ...habit, icon: getHabitIcon(habit.id) };
    setEditingHabit(habitWithIcon);
    setDialogOpen(true);
  };

  const handleSave = async (habitData: Partial<Habit>) => {
    try {
      if (editingHabit) {
        await updateHabit({
          id: editingHabit.id,
          habit: {
            title: habitData.title!,
            quote: habitData.quote!,
            startDate: habitData.startDate!,
            timeSection: habitData.timeSection!,
            goalDays: habitData.goalDays!,
            completed: habitData.completed!,
          },
        }).unwrap();
        if (habitData.icon) {
          saveHabitIcon(editingHabit.id, habitData.icon);
        }
      } else {
        const result = await createHabit({
          title: habitData.title!,
          quote: habitData.quote!,
          startDate: habitData.startDate!,
          timeSection: habitData.timeSection!,
          goalDays: habitData.goalDays!,
          completed: false,
        }).unwrap();
        if (habitData.icon && result.data.id) {
          saveHabitIcon(result.data.id, habitData.icon);
        }
      }
      setDialogOpen(false);
      setEditingHabit(null);
    } catch (err) {
      console.error("Failed to save habit:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      try {
        await deleteHabit(id).unwrap();
        deleteHabitIcon(id);
      } catch (err) {
        console.error("Failed to delete habit:", err);
      }
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    const habit = data?.data.content.find((h) => h.id === id);
    if (habit) {
      try {
        await updateHabit({
          id,
          habit: {
            title: habit.title,
            quote: habit.quote,
            startDate: habit.startDate,
            timeSection: habit.timeSection,
            goalDays: habit.goalDays,
            completed,
          },
        });
      } catch (err) {
        console.error("Failed to update habit:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load habits. Please try again.</Alert>
      </Box>
    );
  }

  const habits = (data?.data.content || []).map((habit) => ({
    ...habit,
    icon: getHabitIcon(habit.id),
  }));

  const totalPages = data?.data.totalPages || 0;

  return (
    <Box sx={{ px: 8, py: 2, mx: "auto" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={700} color="primary.dark">
          🎯 Habits
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          New Habit
        </Button>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleComplete={handleToggleComplete}
          />
        ))}
      </Box>

      {habits.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No habits yet. Create your first habit!
          </Typography>
        </Box>
      )}

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={(_, value) => setPage(value - 1)}
            color="primary"
          />
        </Box>
      )}

      <HabitDialog
        open={dialogOpen}
        habit={editingHabit}
        onClose={() => {
          setDialogOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSave}
      />
    </Box>
  );
}
