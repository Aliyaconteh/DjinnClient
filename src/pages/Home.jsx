import { useEffect, useState, memo, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Database,
  ListChecks,
  PlusCircle,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// -------------------------------------------------------------------
//  Data
// -------------------------------------------------------------------
const workflows = [
  {
    title: "Create a quiz",
    text: "Add questions, options, correct answers, and timers before opening a room.",
    path: "/quizzes/create",
    icon: ListChecks,
    action: "Build quiz",
  },
  {
    title: "Host a live room",
    text: "Select a quiz, generate a room code, and wait for participants in the lobby.",
    path: "/create-room",
    icon: PlusCircle,
    action: "Create room",
  },
  {
    title: "Join with a code",
    text: "Participants can enter a room code and username to join the waiting room.",
    path: "/join-room",
    icon: Users,
    action: "Join room",
  },
  {
    title: "Review outcomes",
    text: "Open room scores and synchronization analysis for evaluation and reporting.",
    path: "/leaderboard",
    icon: Trophy,
    action: "View scores",
  },
];

const features = [
  { icon: Radio, title: "Real-time rooms", text: "Room updates, player lists, questions, timers, and scores move through sockets." },
  { icon: ShieldCheck, title: "Server authority", text: "The backend validates answers and controls scoring for consistent results." },
  { icon: Clock3, title: "Optimistic feedback", text: "Client-side prediction is supported for comparing perceived responsiveness." },
  { icon: Database, title: "Persistent records", text: "Quizzes, rooms, players, answers, and session results are saved in Supabase." },
  { icon: BarChart3, title: "Analysis ready", text: "Synchronization logs support latency and reconciliation discussion." },
  { icon: CheckCircle2, title: "Demo workflow", text: "Create quiz, create room, join, play, finish, and review results from one interface." },
];

// -------------------------------------------------------------------
//  Animation variants (respects prefers-reduced-motion)
// -------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// -------------------------------------------------------------------
//  Reusable motion wrappers (keeps markup clean)
// -------------------------------------------------------------------
const MotionButton = motion.button;
const MotionDiv = motion.div;
const MotionSection = motion.section;

// -------------------------------------------------------------------
//  Card components – memoised for perf
// -------------------------------------------------------------------
const WorkflowCard = memo(function WorkflowCard({
  title,
  text,
  icon: Icon,
  action,
  onOpen,
}) {
  return (
    <MotionButton
      onClick={onOpen}
      variants={fadeUp}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-left backdrop-blur-sm transition-colors duration-200 hover:border-indigo-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
      aria-label={`${action}: ${title}`}
    >
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-slate-800 text-indigo-300 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-500/20">
        <Icon size={20} aria-hidden="true" />
      </div>
      <h3 className="text-xl font-extrabold tracking-tight">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{text}</p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-indigo-300 transition-colors group-hover:text-indigo-200">
        {action}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </span>
    </MotionButton>
  );
});

const FeatureCard = memo(function FeatureCard({
  icon: Icon,
  title,
  text,
}) {
  return (
    <MotionDiv
      variants={fadeUp}
      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-sm transition-colors duration-200 hover:border-indigo-500/40"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800 bg-slate-900 text-indigo-300 transition-colors group-hover:border-indigo-500/40">
          <Icon size={20} aria-hidden="true" />
        </div>
        <h3 className="font-extrabold">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-slate-400">{text}</p>
    </MotionDiv>
  );
});

// -------------------------------------------------------------------
//  Home page
// -------------------------------------------------------------------
export default function Home() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleNavigation = useCallback(
    (path) => () => navigate(path),
    [navigate]
  );

  // Respect user motion preference – skip initial mount fade if reduced motion
  const heroOpacity = mounted ? "opacity-100" : "opacity-0";
  const heroTransition = prefersReducedMotion
    ? "transition-none"
    : "transition-opacity duration-500";

  return (
    <main className="relative overflow-hidden bg-slate-950 text-white">
      {/* Subtle animated gradient background – decorative */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-900/20 to-purple-900/10 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="border-b border-slate-800/80">
        <div
          className={`mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:py-28 ${heroOpacity} ${heroTransition}`}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur-sm">
            <Sparkles size={16} className="text-indigo-300" aria-hidden="true" />
            Welcome to Djinn
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Multiplayer Quiz{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Platform
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-400">
            Create quizzes, host live rooms, join with a room code, and track
            scores in real time.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <MotionButton
              onClick={handleNavigation("/quizzes/create")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-3 font-bold text-white shadow-md shadow-purple-500/20 transition-shadow duration-200 hover:shadow-lg hover:shadow-purple-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
              aria-label="Create a new quiz"
            >
              Create Quiz
            </MotionButton>
            <MotionButton
              onClick={handleNavigation("/create-room")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 font-bold text-slate-200 backdrop-blur-sm transition-colors duration-200 hover:border-indigo-500/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
              aria-label="Host a new live room"
            >
              Host Room
            </MotionButton>
            <MotionButton
              onClick={handleNavigation("/join-room")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-slate-700 bg-slate-900/90 px-6 py-3 font-bold text-slate-200 backdrop-blur-sm transition-colors duration-200 hover:border-indigo-500/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
              aria-label="Join a room using a code"
            >
              Join Room
            </MotionButton>
          </div>
        </div>
      </section>

      {/* WORKFLOWS */}
      <MotionSection
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={prefersReducedMotion ? {} : staggerContainer}
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6"
      >
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-300">
              Main workflows
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
              Move through the project
            </h2>
          </div>
          <MotionButton
            onClick={handleNavigation("/sync-analysis")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-fit rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 font-bold text-slate-200 backdrop-blur-sm transition-colors duration-200 hover:border-indigo-500/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70"
            aria-label="Open synchronization analysis dashboard"
          >
            Open Analysis
          </MotionButton>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflows.map((item) => (
            <WorkflowCard
              key={item.title}
              {...item}
              onOpen={handleNavigation(item.path)}
            />
          ))}
        </div>
      </MotionSection>

      {/* FEATURES */}
      <MotionSection
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={prefersReducedMotion ? {} : staggerContainer}
        className="border-t border-slate-800/80 bg-slate-900/30"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-300">
              System design
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
              What the project demonstrates
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </MotionSection>
    </main>
  );
}