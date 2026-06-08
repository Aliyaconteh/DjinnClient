import { Home, ListChecks, PlusCircle, Trophy, Users, Brain } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserMenu from "./UserMenu";

const hostLinks = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/quizzes", label: "Quizzes", icon: ListChecks },
  { to: "/create-room", label: "Create Room", icon: PlusCircle },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

const guestLinks = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/join-room", label: "Join Room", icon: Users },
   { to: "/leaderboard", label: "Leaderboard", icon: Trophy},
  { to: "/signIn", label: "Sign In", icon: Users },
];

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  
  // Hosts are authenticated users, guests and players see limited options
  const links = isAuthenticated ? hostLinks : guestLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl shadow-lg">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <NavLink 
            to="/home" 
            className="flex items-center gap-2 group"
            aria-label="QuizRoom Home"
          >
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300">
              <Brain size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent hidden sm:inline-block">
              QuizRoom
            </span>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center justify-center flex-1 mx-4">
            <div className="flex items-center gap-1 rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur p-1">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                    }`
                  }
                  aria-current="page"
                >
                  <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
                  <span className="hidden md:inline">{label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center justify-end">
            {isAuthenticated ? <UserMenu /> : null}
          </div>
        </div>
      </nav>
    </header>
  );
}
