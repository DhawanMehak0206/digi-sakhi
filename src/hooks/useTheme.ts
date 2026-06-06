import { useEffect, useState } from "react";

const KEY = "digisakhi_theme";
const LEGACY_KEY = "hertech_theme";
type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem(KEY) as Theme) || (localStorage.getItem(LEGACY_KEY) as Theme) || "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(KEY, theme);
    localStorage.removeItem(LEGACY_KEY);
  }, [theme]);

  return { theme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
