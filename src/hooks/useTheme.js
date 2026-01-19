import { useState, useEffect } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Cargar tema guardado o usar preferencia del sistema
    const saved = localStorage.getItem("bookwise_theme");
    if (saved) return saved;
    
    // Verificar preferencia del sistema
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("bookwise_theme", theme);
    console.log("Tema actualizado:", theme, "Clase dark en html:", root.classList.contains("dark"));
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "dark" ? "light" : "dark";
      console.log("Toggle tema:", prev, "->", newTheme);
      return newTheme;
    });
  };

  return { theme, toggleTheme, isDark: theme === "dark" };
}

