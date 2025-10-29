import type { FocusProfile } from "../types/focusTypes";

const STORAGE_KEY = "focus_profiles_v1";

export function loadFocuses(): FocusProfile[] {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v ? JSON.parse(v) : [];
  } catch {
    return [];
  }
}

export function saveFocuses(list: FocusProfile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
