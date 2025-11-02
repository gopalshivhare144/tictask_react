import type { HabitIcon } from "../types/habitTypes";

const STORAGE_KEY = "habit_icons";

interface HabitIconMap {
  [habitId: number]: HabitIcon;
}

export const saveHabitIcon = (habitId: number, icon: HabitIcon) => {
  const icons = getHabitIcons();
  icons[habitId] = icon;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(icons));
};

export const getHabitIcon = (habitId: number): HabitIcon => {
  const icons = getHabitIcons();
  return icons[habitId] || "OTHER";
};

export const getHabitIcons = (): HabitIconMap => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const deleteHabitIcon = (habitId: number) => {
  const icons = getHabitIcons();
  delete icons[habitId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(icons));
};
