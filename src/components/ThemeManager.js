// File: src/components/ThemeManager.js

import React, { createContext, useMemo, useState, useContext } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";


const ThemeModeContext = createContext();
export const useThemeMode = () => useContext(ThemeModeContext);
export default function ThemeManager({ children }) {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                background: {
                  default: "#f9f9f9",
                },
              }
            : {
                background: {
                  default: "#121212",
                },
              }),
        },
        typography: {
          fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
