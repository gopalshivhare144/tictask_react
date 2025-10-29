import { Paper, InputBase, IconButton, useTheme, alpha } from "@mui/material";
import { Search } from "@mui/icons-material";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search tasks...",
  onClear,
}: SearchBarProps) {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        p: "2px 10px",
        display: "flex",
        alignItems: "center",
        borderRadius: 999,
        minWidth: 320,
        background: alpha(theme.palette.primary.light, 0.09),
        boxShadow: "none",
        border: `1.5px solid ${alpha(theme.palette.primary.main, 0.13)}`,
        transition: "border .2s",
        "&:focus-within": {
          border: `2px solid ${theme.palette.primary.main}`,
        },
        mb: 3,
      }}
      elevation={0}
    >
      <IconButton
        sx={{ p: "7px", color: theme.palette.primary.main }}
        disableRipple
      >
        <Search />
      </IconButton>
      <InputBase
        sx={{
          ml: 1,
          flex: 1,
          fontWeight: 500,
          letterSpacing: 0.1,
        }}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputProps={{ "aria-label": placeholder }}
      />
      {value.length > 0 && (
        <IconButton size="small" onClick={onClear} sx={{ opacity: 0.65 }}>
          <svg height="20px" width="20px" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" fill="#eee" />
            <path d="M7.5 7.5l5 5m0-5l-5 5" stroke="#555" strokeWidth="1.5" />
          </svg>
        </IconButton>
      )}
    </Paper>
  );
}
