import { Home, PlusCircle, Trophy, Users, Brain, Sun, Moon, ListPlus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserMenu from "./UserMenu";

const hostDesktopLinks = [
  { to: "/",            label: "Home",       icon: Home },
  { to: "/quizzes",     label: "Quizzes",    icon: ListPlus },
  { to: "/join-room",   label: "Join",       icon: Users },
  { to: "/create-room", label: "Host",       icon: PlusCircle },
  { to: "/leaderboard", label: "Scores",     icon: Trophy },
];

const hostMobileLinks = [
  { to: "/quizzes",     label: "Quizzes",    icon: ListPlus },
  { to: "/join-room",   label: "Join",   icon: Users },
  { to: "/create-room", label: "Host",   icon: PlusCircle },
  { to: "/leaderboard", label: "Scores", icon: Trophy },
];

const guestMainLinks = [
  { to: "/",            label: "Home",       icon: Home },
  { to: "/quizzes",     label: "Quizzes",    icon: ListPlus },
  { to: "/join-room",   label: "Join",       icon: Users },
  { to: "/create-room", label: "Host",       icon: PlusCircle },
  { to: "/leaderboard", label: "Scores",     icon: Trophy },
];

const guestAuthLink = { to: "/signin", label: "Sign In", icon: Users };

export default function Navbar() {
  const { isAuthenticated, theme, setTheme } = useAuth();
  const links = isAuthenticated ? hostDesktopLinks : guestMainLinks;
  const mobileLinks = isAuthenticated ? hostMobileLinks : guestMainLinks;
  const authLink = isAuthenticated ? null : guestAuthLink;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-2 lg:py-0">

          <NavLink
            to="/"
            className="flex items-center gap-2 group shrink-0"
            aria-label="Djinn Home"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-md group-hover:shadow-purple-500/25 transition-shadow duration-300">
              <Brain size={17} className="text-white" />
            </div>
            <span className="hidden sm:inline text-base font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Djinn
            </span>
          </NavLink>

          <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto px-1">
            <div className="flex lg:hidden items-center gap-1">
              {mobileLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  title={label}
                  aria-label={label}
                  className={({ isActive }) =>
                    `group relative inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/90 p-3 text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "text-indigo-300"
                        : "text-slate-200 hover:text-white hover:border-indigo-500/60"
                    }`
                  }
                >
                  <Icon size={16} className="shrink-0" aria-hidden="true" />
                  <span className="sr-only">{label}</span>
                  <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-2 py-1 text-[11px] text-slate-200 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus:opacity-100">
                    {label}
                  </span>
                </NavLink>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2 justify-center">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "text-indigo-300"
                        : "text-slate-200 hover:text-white hover:border-indigo-500/60"
                    }`
                  }
                >
                  <Icon size={16} className="shrink-0" aria-hidden="true" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-indigo-500/60 hover:text-white"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>

            {authLink ? (
              <NavLink
                to={authLink.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold transition-all duration-200 hover:border-indigo-500/60 hover:text-white ${
                    isActive ? "text-indigo-300" : "text-slate-200"
                  }`
                }
              >
                <Users size={16} aria-hidden="true" />
                <span className="hidden sm:inline">{authLink.label}</span>
                <span className="sm:hidden text-[11px]">Sign In</span>
              </NavLink>
            ) : (
              <UserMenu />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
