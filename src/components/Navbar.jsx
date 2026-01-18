import { LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const THEMES = [
  { id: "light", label: "Light", icon: Sun, isDark: false },
  { id: "dark", label: "Dark", icon: Moon, isDark: true },
  { id: "midnight", label: "Midnight", icon: Moon, isDark: true },
  { id: "ocean", label: "Ocean", icon: Sun, isDark: false },
  { id: "sand", label: "Sand", icon: Sun, isDark: false },
];

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return THEMES[0].id;
    const stored = localStorage.getItem("theme");
    const storedTheme = THEMES.find((t) => t.id === stored);
    if (storedTheme) return storedTheme.id;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const activeTheme = THEMES.find((t) => t.id === theme) || THEMES[0];
    const root = document.documentElement;
    root.dataset.theme = activeTheme.id;
    root.classList.toggle("dark", activeTheme.isDark);
    localStorage.setItem("theme", activeTheme.id);
  }, [theme]);

  const cycleTheme = () => {
    const currentIndex = THEMES.findIndex((t) => t.id === theme);
    const nextTheme = THEMES[(currentIndex + 1) % THEMES.length];
    setTheme(nextTheme.id);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    cn(
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
    );

  const activeTheme = THEMES.find((t) => t.id === theme) || THEMES[0];
  const ThemeIcon = activeTheme.icon;

  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Task Manager
        </Link>

        <nav className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            aria-label={`Switch theme (current: ${activeTheme.label})`}
            className="h-9 gap-2 px-3"
          >
            <ThemeIcon className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-wide">
              {activeTheme.label}
            </span>
          </Button>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/tasks" className={navLinkClass}>
                Tasks
              </NavLink>
              <NavLink to="/reminders" className={navLinkClass}>
                Reminders
              </NavLink>
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Logout</span>
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
