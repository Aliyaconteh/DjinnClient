import { BarChart3, Home, ListChecks, PlusCircle, Trophy, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/quizzes", label: "Quizzes", icon: ListChecks },
  { to: "/create-room", label: "Create", icon: PlusCircle },
  { to: "/join-room", label: "Join", icon: Users },
  { to: "/leaderboard", label: "Scores", icon: Trophy },
  { to: "/sync-analysis", label: "Analysis", icon: BarChart3 }
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-3 text-white">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500 text-slate-950 font-black">
            Q
          </div>
          <div className="leading-tight">
            <p className="text-base font-black">QuizRoom</p>
            <p className="text-xs text-slate-400">Real-time quiz platform</p>
          </div>
        </NavLink>

        <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-white text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
