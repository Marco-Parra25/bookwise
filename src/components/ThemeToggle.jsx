import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 active:scale-95"
      aria-label="Cambiar tema"
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        <span className="text-2xl">☀️</span>
      ) : (
        <span className="text-2xl">🌙</span>
      )}
    </button>
  );
}

