import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import FocusCard from "../components/FocusCard";
import type { FocusProfile } from "../types/focusTypes";
import FocusModal from "../components/FocusModel";
import AddIcon from "@mui/icons-material/Add";

const ICONS = [{ name: "Watch", icon: <AccessAlarmIcon fontSize="large" /> }];

const STORAGE_KEY = "focus_profiles_v1";

function loadFocuses(): FocusProfile[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveFocuses(list: FocusProfile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

const DEFAULT_FOCUS: FocusProfile = {
  id: "default-pomo-" + Date.now(),
  name: "Pomodoro",
  icon: "Watch",
  mode: "pomodoro",
  pomoMinutes: 120,
  isActive: false,
  lastValue: 120 * 60 * 1000,
};

export default function FocusListPage() {
  const [focuses, setFocuses] = useState<FocusProfile[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editFocus, setEditFocus] = useState<FocusProfile | undefined>();

  // Load focuses on mount
  useEffect(() => {
    const loaded = loadFocuses();
    if (loaded.length === 0) {
      // If no saved focuses, create one default
      const initialFocus = { ...DEFAULT_FOCUS };
      setFocuses([initialFocus]);
      saveFocuses([initialFocus]);
    } else {
      setFocuses(loaded);
    }
  }, []);

  // Save to localStorage whenever focuses change
  useEffect(() => {
    if (focuses.length > 0) {
      saveFocuses(focuses);
    }
  }, [focuses]);

  function handleSave(focus: FocusProfile, isEdit: boolean) {
    setFocuses((list) =>
      isEdit
        ? list.map((f) => (f.id === focus.id ? focus : f))
        : [
            ...list,
            {
              ...focus,
              id: Math.random().toString(36) + Date.now(),
              lastValue:
                focus.mode === "pomodoro"
                  ? (focus.pomoMinutes || 120) * 60 * 1000
                  : 0,
              isActive: false,
            },
          ]
    );
    setModalOpen(false);
    setEditFocus(undefined);
  }

  function handleStart(id: string) {
    setFocuses((list) =>
      list.map((f) =>
        f.id === id ? { ...f, isActive: true } : { ...f, isActive: false }
      )
    );
  }

  function handlePauseOrClear(id: string, clear?: boolean) {
    setFocuses((list) =>
      list.map((f) =>
        f.id === id
          ? {
              ...f,
              isActive: false,
              lastValue: clear
                ? f.mode === "pomodoro"
                  ? (f.pomoMinutes || 120) * 60 * 1000
                  : 0
                : f.lastValue,
            }
          : f
      )
    );
  }

  function handleDelete(id: string) {
    setFocuses((list) => {
      const newList = list.filter((f) => f.id !== id);
      // If all deleted, add back a default
      if (newList.length === 0) {
        const defaultFocus = {
          ...DEFAULT_FOCUS,
          id: "default-pomo-" + Date.now(),
        };
        return [defaultFocus];
      }
      return newList;
    });
  }

  function updateLastValue(id: string, value: number) {
    setFocuses((list) =>
      list.map((f) => (f.id === id ? { ...f, lastValue: value } : f))
    );
  }

  return (
    <Box sx={{ px: 8, py: 2, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary.dark">
          🎯 Focus Mode
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ borderRadius: 2, fontWeight: 600 }}
          onClick={() => {
            setModalOpen(true);
            setEditFocus(undefined);
          }}
        >
          New Focus
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "stretch",
          width: "100%",
          mx: "auto",
          mt: 4,
        }}
      >
        {focuses.map((focus) => (
          <FocusCard
            key={focus.id}
            focus={focus}
            icons={ICONS}
            onStart={handleStart}
            onPauseOrClear={handlePauseOrClear}
            onDelete={handleDelete}
            onEdit={(focus) => {
              setModalOpen(true);
              setEditFocus(focus);
            }}
            updateLastValue={updateLastValue}
          />
        ))}
      </Box>

      <FocusModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditFocus(undefined);
        }}
        focus={editFocus}
        icons={ICONS}
        onSave={handleSave}
      />
    </Box>
  );
}
