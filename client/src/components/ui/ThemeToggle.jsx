import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext.jsx";
import Tooltip from "./Tooltip.jsx";

const ThemeToggle = ({ className = "" }) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Tooltip text={isDark ? "Switch to light mode" : "Switch to dark mode"} position="bottom">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={`p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${className}`}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400 animate-fade-in transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-5 h-5 text-foreground animate-fade-in transition-transform hover:-rotate-12" />
        )}
      </button>
    </Tooltip>
  );
};

export default ThemeToggle;
