import { createContext, useEffect, useState } from "react";
import type { ChildrenProp, Theme, ToggleThemeCallback } from "../type";

export const ThemeContext = createContext<{
  theme?: Theme | null;
  toggle?: ToggleThemeCallback | null;
}>({
  theme: null,
  toggle: null,
});

export function ThemeProvider({ children }: ChildrenProp) {
  const [currentTheme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const darkModePreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const preferredTheme = darkModePreference.matches ? "dark" : "light";
    toggleTheme(preferredTheme);

    darkModePreference.addEventListener("change", (e) =>
      toggleTheme(e.matches ? "dark" : "light")
    );
  }, []);

  function toggleTheme(theme?: Theme | undefined) {
    const root = document.getElementById("html");
    if (!theme) {
      theme = currentTheme == "light" ? "dark" : "light";
    }
    setTheme(theme);
    if (root) {
      const hasTheme = root.classList.contains(theme);
      if (theme == "light") {
        root.classList.remove("dark");
      } else {
        if (!hasTheme) {
          root.classList.add("dark");
        }
      }
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        toggle: toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
