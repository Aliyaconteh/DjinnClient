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
  Users
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "../components/assets/hero.png";

const projectStats = [
  { label: "Communication", value: "Socket.IO", tone: "text-sky-300" },
  { label: "Database", value: "Supabase", tone: "text-emerald-300" },
  { label: "Sync Modes", value: "2 Models", tone: "text-amber-300" }
];

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

  return (
    <main className="bg-slate-950 text-white">
      <section className="border-b border-slate-800">
        <div className="mx-auto grid min-h-[calc(100vh-68px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-14">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Welcome to QuizRoom
            </div>


            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A multiplayer quiz platform for creating quizzes, hosting live rooms,
              joining with room codes, tracking scores, and comparing synchronization
              strategies in a distributed web application.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/quizzes/create")}
                className="rounded-xl bg-emerald-500 px-5 py-3 font-black text-slate-950 transition hover:bg-emerald-400"
              >
                Create Quiz
              </button>
              <button
                onClick={() => navigate("/create-room")}
                className="rounded-xl bg-sky-500 px-5 py-3 font-black text-slate-950 transition hover:bg-sky-400"
              >
                Host Room
              </button>
              <button
                onClick={() => navigate("/join-room")}
                className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-black text-white transition hover:border-amber-400"
              >
                Join Room
              </button>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {projectStats.map((item) => (
                <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className={`mt-2 text-2xl font-black ${item.tone}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="QuizRoom live quiz dashboard preview"
              className="aspect-[4/3] w-full rounded-2xl border border-slate-800 object-cover shadow-2xl shadow-black/40"
            />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniPanel label="Active players" value="Live lobby" />
              <MiniPanel label="Scoring" value="Instant updates" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-amber-300">Main workflows</p>
            <h2 className="mt-2 text-3xl font-black text-white">Move through the project</h2>
          </div>
          <button
            onClick={() => navigate("/sync-analysis")}
            className="w-fit rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 font-bold text-slate-200 transition hover:border-emerald-400"
          >
            Open Analysis
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflows.map((item) => (
            <WorkflowCard key={item.title} {...item} onOpen={() => navigate(item.path)} />
          ))}
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-7">
            <p className="text-sm font-bold uppercase tracking-wide text-sky-300">System design</p>
            <h2 className="mt-2 text-3xl font-black text-white">What the project demonstrates</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function MiniPanel({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 font-black text-white">{value}</p>
    </div>
  );
}

function WorkflowCard({ title, text, icon: Icon, action, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="group flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900 p-5 text-left transition hover:border-emerald-400 hover:bg-slate-800"
    >
      <div className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-slate-800 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-slate-950">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="text-xl font-black text-white">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-slate-300">{text}</p>
      <span className="mt-5 text-sm font-black text-amber-300">{action}</span>
    </button>
  );
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-900 text-sky-300">
          <Icon size={20} aria-hidden="true" />
        </div>
        <h3 className="font-black text-white">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}
