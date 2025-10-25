import { ThemeProvider } from "@mui/material/styles";
import "./App.css";
import { useMemo } from "react";
import { useAppSelector } from "./store/store";
import { createAppTheme } from "./shared/theme/theme";
import AppRouter from "./router/AppRouter";
import CssBaseline from "@mui/material/CssBaseline";
import ErrorBoundary from "./shared/components/ErrorBoundary";

function App() {
  const themeMode = useAppSelector((state) => state.theme.mode);
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <div className={themeMode === "dark" ? "dark" : ""}>
          <AppRouter />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
