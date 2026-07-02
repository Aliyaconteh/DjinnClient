import { Home, ListChecks, PlusCircle, Trophy, Users, Brain } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserMenu from "./UserMenu";

// Links shown in the navbar on both mobile (icon-only) and desktop (icon + label)
const hostLinks = [
  { to: "/",            label: "Home",    icon: Home },
  { to: "/quizzes",     label: "Quizzes", icon: ListChecks },
  { to: "/create-room", label: "Host",    icon: PlusCircle },
  { to: "/join-room",   label: "Join",    icon: Users },
  { to: "/leaderboard", label: "Scores",  icon: Trophy },
];

const guestLinks = [
  { to: "/",            label: "Home",   icon: Home },
  { to: "/join-room",   label: "Join",   icon: Users },
  { to: "/leaderboard", label: "Scores", icon: Trophy },
  { to: "/signin",      label: "Sign In", icon: Users },
];

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const links = isAuthenticated ? hostLinks : guestLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">

          {/* ── Brand ──────────────────────────────────────────────────── */}
          <NavLink
            to="/"
            className="flex items-center gap-2 group shrink-0"
            aria-label="Djinn Home"
          >
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-md group-hover:shadow-purple-500/25 transition-shadow duration-300">
              <Brain size={17} className="text-white" />
            </div>
            <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Djinn
            </span>
          </NavLink>

          {/* ── Mobile nav: icon + label stacked ──────────────────────── */}
          <div className="flex lg:hidden items-center gap-0.5 flex-1 justify-center">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center rounded-lg px-1.5 py-1 transition-all duration-150 min-w-[48px] ${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                  }`
                }
              >
                <Icon size={18} aria-hidden="true" />
                <span className="text-[9px] font-semibold mt-0.5 leading-tight">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* ── Desktop nav links ───────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-300"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                  }`
                }
              >
                <Icon size={16} className="shrink-0" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          {/* ── Right: UserMenu ─────────────────────────────────────────── */}
          <div className="shrink-0">
            {isAuthenticated ? <UserMenu /> : null}
          </div>

        </div>
      </nav>
    </header>
  );
}
