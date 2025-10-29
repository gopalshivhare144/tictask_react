export interface FocusProfile {
  id: string;
  name: string;
  icon: string;
  mode: "pomodoro" | "stopwatch";
  pomoMinutes?: number;
  isActive: boolean;
  lastValue: number;
}
