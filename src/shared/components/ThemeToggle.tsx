import { useAppDispatch, useAppSelector } from "@/store/store";
import { toggleTheme } from "@/store/themeSlice";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);

  return (
    <IconButton
      onClick={() => dispatch(toggleTheme())}
      color="inherit"
      aria-label="toggle theme"
    >
      {themeMode === "dark" ? <Brightness7 /> : <Brightness4/>}
    </IconButton>
  );
}