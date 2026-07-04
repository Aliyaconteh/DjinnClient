import { useEffect, useRef, useState } from "react";
import { Home, DoorOpen, Plus, Trophy, Sparkles, Sun, Moon, BookOpen, LogIn } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserMenu from "./UserMenu";

const hostDesktopLinks = [
  { to: "/",            label: "Home",         icon: Home },
  { to: "/join-room",   label: "Join",         icon: DoorOpen },
  { to: "/quizzes",     label: "Quizzes",      icon: BookOpen },
  { to: "/quizzes/create", label: "Create Quiz", icon: Plus },
  { to: "/leaderboard", label: "Scores",       icon: Trophy },
];

// Mobile links exclude "Create Quiz" — it gets its own big FAB-style button in the center.
// 4 links total so they split evenly: 2 on the left, 2 on the right of the FAB.
const hostMobileLinks = [
  { to: "/",            label: "Home",       icon: Home },
  { to: "/quizzes",     label: "Quizzes",    icon: BookOpen },
  { to: "/join-room",   label: "Join",       icon: DoorOpen },
  { to: "/leaderboard", label: "Scores",     icon: Trophy },
];

const guestMainLinks = [
  { to: "/",            label: "Home",       icon: Home },
  { to: "/quizzes",     label: "Quizzes",    icon: BookOpen },
  { to: "/join-room",   label: "Join",       icon: DoorOpen },
  { to: "/leaderboard", label: "Scores",     icon: Trophy },
];

const guestAuthLink = { to: "/signin", label: "Sign In", icon: LogIn };
const hostFabLink = { to: "/quizzes/create", label: "Create Quiz" };

export default function Navbar() {
  const { isAuthenticated, theme, setTheme } = useAuth();
  const links = isAuthenticated ? hostDesktopLinks : guestMainLinks;
  const mobileLinks = isAuthenticated ? hostMobileLinks : guestMainLinks;
  const authLink = isAuthenticated ? null : guestAuthLink;

  // --- Hide/show the mobile bottom nav based on scroll direction (LinkedIn-style) ---
  const [showMobileNav, setShowMobileNav] = useState(true);
  const lastScrollY = useRef(0);
  const idleTimer = useRef(null);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY <= 24) {
        // Always show near the very top of the page.
        setShowMobileNav(true);
      } else if (delta > 4) {
        // Scrolling down -> hide.
        setShowMobileNav(false);
      } else if (delta < -4) {
        // Scrolling up -> show.
        setShowMobileNav(true);
      }

      lastScrollY.current = currentY;

      // Reveal again once the user stops scrolling for a moment.
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setShowMobileNav(true), 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl">
        <nav className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex items-center h-15 justify-between gap-2 py-2 lg:py-0">

            <NavLink
              to="/"
              className="flex items-center gap-2 group shrink-0"
              aria-label="Djinn Home"
            >
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 group-hover:shadow-md group-hover:shadow-purple-500/25 transition-shadow duration-300">
                <Sparkles size={17} className="text-white" />
              </div>
              <span className="hidden sm:inline text-base font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Djinn
              </span>
            </NavLink>

            <div className="flex-1 hidden lg:flex items-center gap-2 justify-center">
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

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/90 px-2.5 py-2 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-indigo-500/60 hover:text-white"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
              </button>

              {authLink ? (
                <NavLink
                  to={authLink.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900/90 px-2.5 py-2 text-sm font-semibold transition-all duration-200 hover:border-indigo-500/60 hover:text-white ${
                      isActive ? "text-indigo-300" : "text-slate-200"
                    }`
                  }
                >
                  <authLink.icon size={16} aria-hidden="true" />
                  <span className="hidden sm:inline">{authLink.label}</span>
                  <span className="sr-only">Sign In</span>
                </NavLink>
              ) : (
                <UserMenu />
              )}
            </div>
          </div>
        </nav>
      </header>

      <nav
        className={`lg:hidden fixed inset-x-0 bottom-0 z-50 border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ease-out ${
          showMobileNav ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div
          className={`mx-auto max-w-7xl px-4 py-3.5 sm:py-4 flex items-center gap-4 sm:gap-6 overflow-x-auto ${
            isAuthenticated ? "justify-between" : "justify-center"
          }`}
        >
          {/* First half of links */}
          {mobileLinks.slice(0, Math.ceil(mobileLinks.length / 2)).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              aria-label={label}
              className={({ isActive }) =>
                `group relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900/95 text-slate-200 shadow-sm transition-all duration-200 ${
                  isActive
                    ? "border-indigo-500/60 bg-indigo-500/15 text-indigo-300 shadow-indigo-500/20"
                    : "hover:border-indigo-500/60 hover:bg-slate-800/95 hover:text-white"
                }`
              }
            >
              <Icon size={20} className="shrink-0" aria-hidden="true" />
              <span className="sr-only">{label}</span>
              <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-2 py-1 text-[11px] text-slate-200 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 group-active:duration-0">
                {label}
              </span>
            </NavLink>
          ))}

          {/* Big centered "Host a Quiz" FAB */}
          {isAuthenticated && (
            <NavLink
              to={hostFabLink.to}
              title={hostFabLink.label}
              aria-label={hostFabLink.label}
              className="group relative -mt-6 inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/30 ring-4 ring-slate-950 transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <Plus size={28} strokeWidth={2.5} aria-hidden="true" />
              <span className="sr-only">{hostFabLink.label}</span>
              <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-2 py-1 text-[11px] text-slate-200 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 group-active:duration-0">
                {hostFabLink.label}
              </span>
            </NavLink>
          )}

          {/* Second half of links */}
          {mobileLinks.slice(Math.ceil(mobileLinks.length / 2)).map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              aria-label={label}
              className={({ isActive }) =>
                `group relative inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-900/95 text-slate-200 shadow-sm transition-all duration-200 ${
                  isActive
                    ? "border-indigo-500/60 bg-indigo-500/15 text-indigo-300 shadow-indigo-500/20"
                    : "hover:border-indigo-500/60 hover:bg-slate-800/95 hover:text-white"
                }`
              }
            >
              <Icon size={20} className="shrink-0" aria-hidden="true" />
              <span className="sr-only">{label}</span>
              <span className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900 px-2 py-1 text-[11px] text-slate-200 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus:opacity-100 group-active:opacity-100 group-active:duration-0">
                {label}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}