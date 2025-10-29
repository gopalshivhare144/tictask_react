import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import type { FocusProfile } from "../types/focusTypes";

export default function FocusModal({
  open,
  onClose,
  focus,
  icons,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  focus?: FocusProfile;
  icons: { name: string; icon: React.ReactNode }[];
  onSave: (focus: FocusProfile, isEdit: boolean) => void;
}) {
  const [name, setName] = useState(focus?.name || "");
  const [icon, setIcon] = useState(focus?.icon || icons[0].name);
  const [mode, setMode] = useState<"pomodoro" | "stopwatch">(
    focus?.mode || "pomodoro"
  );
  const [pomoMinutes, setPomoMinutes] = useState(focus?.pomoMinutes || 120);

  useEffect(() => {
    if (focus) {
      setName(focus.name);
      setIcon(focus.icon);
      setMode(focus.mode);
      setPomoMinutes(focus.pomoMinutes || 120);
    } else {
      setName("");
      setIcon(icons[0].name);
      setMode("pomodoro");
      setPomoMinutes(120);
    }
  }, [focus, icons]);

  function handleSubmit() {
    if (!name.trim()) return;
    const validatedMinutes = Math.min(Math.max(pomoMinutes, 1), 1440);
    onSave(
      {
        id: focus?.id || "",
        name: name.trim(),
        icon,
        mode,
        pomoMinutes: mode === "pomodoro" ? validatedMinutes : undefined,
        isActive: false,
        lastValue: mode === "pomodoro" ? validatedMinutes * 60 * 1000 : 0,
      },
      Boolean(focus?.id)
    );
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        component={Paper}
        elevation={9}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 370,
          p: 4,
          borderRadius: 6,
        }}
      >
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {focus ? "Edit Focus" : "New Focus"}
        </Typography>
        <TextField
          label="Focus Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Typography fontWeight={500} mb={1}>
          Choose Icon
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 2,
            justifyContent: "center",
          }}
        >
          {icons.map((ic) => (
            <Button
              key={ic.name}
              variant={icon === ic.name ? "contained" : "outlined"}
              color={icon === ic.name ? "primary" : "inherit"}
              onClick={() => setIcon(ic.name)}
              sx={{ width: 44, height: 44, p: 0, borderRadius: 3 }}
            >
              {ic.icon}
            </Button>
          ))}
        </Box>
        <Typography fontWeight={500} mb={1}>
          Mode
        </Typography>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, val) => val && setMode(val)}
          fullWidth
          sx={{ mb: 2 }}
        >
          <ToggleButton value="pomodoro" sx={{ flex: 1 }}>
            Pomodoro
          </ToggleButton>
          <ToggleButton value="stopwatch" sx={{ flex: 1 }}>
            Stopwatch
          </ToggleButton>
        </ToggleButtonGroup>
        {mode === "pomodoro" && (
          <TextField
            label="Pomodoro Minutes"
            type="number"
            value={pomoMinutes}
            onChange={(e) =>
              setPomoMinutes(Math.min(1440, Math.max(1, +e.target.value)))
            }
            inputProps={{ min: 1, max: 1440 }}
            fullWidth
            sx={{ mb: 2 }}
          />
        )}
        <Stack direction="row" spacing={2} justifyContent="flex-end" mt={1}>
          <Button onClick={onClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!name.trim()}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
