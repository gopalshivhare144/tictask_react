import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import type { FocusProfile } from "../types/focusTypes";

function beep() {
  try {
    const Ctx = window.AudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    o.frequency.value = 523.25;
    o.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.14);
    setTimeout(() => ctx.close(), 200);
  } catch {
    return null;
  }
}

export default function FocusTimer({
  focus,
  onStart,
  onPauseOrClear,
  updateLastValue,
}: {
  focus: FocusProfile;
  onStart: (id: string) => void;
  onPauseOrClear: (id: string, clear?: boolean) => void;
  updateLastValue: (id: string, value: number) => void;
}) {
  const [ms, setMs] = useState<number>(
    focus.lastValue ?? (focus.pomoMinutes || 120) * 60000
  );
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setMs(focus.lastValue ?? (focus.pomoMinutes || 120) * 60000);
  }, [focus.lastValue, focus.pomoMinutes]);

  useEffect(() => {
    if (focus.isActive) {
      timerRef.current = window.setInterval(() => {
        setMs((old) =>
          focus.mode === "pomodoro" ? Math.max(0, old - 1000) : old + 1000
        );
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [focus.isActive, focus.mode]);

  useEffect(() => {
    updateLastValue(focus.id, ms);
    if (focus.isActive && focus.mode === "pomodoro" && ms === 0) {
      beep();
      onPauseOrClear(focus.id);
    }
  }, [ms]); // eslint-disable-line

  function format(ms: number) {
    const mm = Math.floor(ms / 60000);
    const ss = Math.floor((ms % 60000) / 1000);
    return `${mm.toString().padStart(2, "0")}:${ss
      .toString()
      .padStart(2, "0")}`;
  }

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight={700}
        color={focus.isActive ? "primary.main" : "text.secondary"}
        style={{ fontVariantNumeric: "tabular-nums" }}
        mb={1}
      >
        {format(ms)}
      </Typography>
      <Stack direction="row" spacing={1}>
        {!focus.isActive ? (
          <Button
            onClick={() => onStart(focus.id)}
            variant="contained"
            size="small"
            color="primary"
            sx={{
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              py: 0.75,
              fontSize: 14,
              textTransform: "none",
            }}
          >
            Start
          </Button>
        ) : (
          <>
            <Button
              onClick={() => onPauseOrClear(focus.id)}
              variant="contained"
              size="small"
              color="warning"
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                py: 0.75,
                fontSize: 14,
                textTransform: "none",
              }}
            >
              Pause
            </Button>
            <Button
              onClick={() => onPauseOrClear(focus.id, true)}
              variant="outlined"
              size="small"
              color="secondary"
              sx={{
                borderRadius: 2,
                px: 3,
                py: 0.75,
                fontSize: 14,
                textTransform: "none",
              }}
            >
              Reset
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}
