import { useEffect, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Database,
  ListChecks,
  PlusCircle,
  Radio,
  ShieldCheck,
  Trophy,
  Users,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "../components/assets/hero.png";

const workflows = [
  {
    title: "Create a quiz",
    text: "Add questions, options, correct answers, and timers before opening a room.",
    path: "/quizzes/create",
    icon: ListChecks,
    action: "Build quiz"
  },
  {
    title: "Host a live room",
    text: "Select a quiz, generate a room code, and wait for participants in the lobby.",
    path: "/create-room",
    icon: PlusCircle,
    action: "Create room"
  },
  {
    title: "Join with a code",
    text: "Participants can enter a room code and username to join the waiting room.",
    path: "/join-room",
    icon: Users,
    action: "Join room"
  },
  {
    title: "Review outcomes",
    text: "Open room scores and synchronization analysis for evaluation and reporting.",
    path: "/leaderboard",
    icon: Trophy,
    action: "View scores"
  }
];

const features = [
  { icon: Radio, title: "Real-time rooms", text: "Room updates, player lists, questions, timers, and scores move through sockets." },
  { icon: ShieldCheck, title: "Server authority", text: "The backend validates answers and controls scoring for consistent results." },
  { icon: Clock3, title: "Optimistic feedback", text: "Client-side prediction is supported for comparing perceived responsiveness." },
  { icon: Database, title: "Persistent records", text: "Quizzes, rooms, players, answers, and session results are saved in Supabase." },
  { icon: BarChart3, title: "Analysis ready", text: "Synchronization logs support latency and reconciliation discussion." },
  { icon: CheckCircle2, title: "Demo workflow", text: "Create quiz, create room, join, play, finish, and review results from one interface." }
];

export default function Home() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="bg-[#060a0f] text-white relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[120px] -top-40 -right-40 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-violet-500/5 blur-[100px] top-1/2 -left-40 pointer-events-none" />

      {/* HERO */}
      <section className="border-b border-slate-800 relative">
        <div className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <div
            className={`transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Welcome to Djinn
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight"
            >
              Multiplayer Quiz{" "}
              <span className="bg-gradient-to-br from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                Platform
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              A multiplayer quiz platform for creating quizzes, hosting live rooms,
              joining with room codes, tracking scores, and comparing synchronization
              strategies in a distributed web application.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/quizzes/create")}
                className="btn-shimmer rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 px-6 py-3 font-bold text-slate-950 shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(16,185,129,0.4)]"
              >
                Create Quiz
              </button>
              <button
                onClick={() => navigate("/create-room")}
                className="btn-shimmer rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-[0_4px_16px_rgba(59,130,246,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(59,130,246,0.4)]"
              >
                Host Room
              </button>
              <button
                onClick={() => navigate("/join-room")}
                className="rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-3 font-bold text-white transition-all duration-200 hover:border-indigo-500/60 hover:-translate-y-0.5"
              >
                Join Room
              </button>
            </div>

           
          </div>

          <div
            className={`relative transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            <img
              src={heroImage}
              alt="Djinn live quiz dashboard preview"
              className="aspect-[4/3] w-full rounded-2xl border border-slate-800 object-cover shadow-2xl shadow-black/40"
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniPanel label="Active players" value="Live lobby" />
              <MiniPanel label="Scoring" value="Instant updates" />
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOWS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 relative">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-amber-300">Main workflows</p>
            <h2
              className="mt-2 text-3xl font-extrabold text-white"
            >
              Move through the project
            </h2>
          </div>
          <button
            onClick={() => navigate("/sync-analysis")}
            className="w-fit rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 font-bold text-slate-200 transition-all duration-200 hover:border-emerald-400 hover:-translate-y-0.5"
          >
            Open Analysis
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflows.map((item, i) => (
            <WorkflowCard key={item.title} {...item} index={i} onOpen={() => navigate(item.path)} />
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-t border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-wide text-sky-300">System design</p>
            <h2
              className="mt-2 text-3xl font-extrabold text-white"
            >
              What the project demonstrates
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function MiniPanel({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#0d131c]/80 p-4 transition-all duration-300 hover:border-slate-700">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-black text-white">{value}</p>
    </div>
  );
}

function WorkflowCard({ title, text, icon: Icon, action, onOpen, index }) {
  return (
    <button
      onClick={onOpen}
      className="group flex h-full flex-col rounded-2xl border border-slate-800 bg-[#0d131c]/80 p-5 text-left transition-all duration-300 hover:border-emerald-400/60 hover:bg-slate-800/50 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(16,185,129,0.08)]"
      style={{ animation: "staggerFade 0.4s ease both", animationDelay: `${index * 0.08}s` }}
    >
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-slate-800 text-emerald-300 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:shadow-[0_0_16px_rgba(16,185,129,0.3)]">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="text-xl font-extrabold text-white">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{text}</p>
      <span className="mt-5 text-sm font-bold text-amber-300 flex items-center gap-1 group-hover:gap-2 transition-all">
        {action}
        <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
      </span>
    </button>
  );
}

function FeatureCard({ icon: Icon, title, text, index }) {
  return (
    <div
      className="rounded-2xl border border-slate-800 bg-[#0d131c]/60 p-5 transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(99,102,241,0.08)]"
      style={{ animation: "staggerFade 0.4s ease both", animationDelay: `${index * 0.06}s` }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sky-300 border border-slate-800 transition-all duration-300 group-hover:border-sky-500/30">
          <Icon size={20} aria-hidden="true" />
        </div>
        <h3 className="font-extrabold text-white">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}
