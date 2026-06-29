import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Trash2, PlusCircle, ListChecks, AlertTriangle } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useToast } from "../../../components/ui/ToastContext";
import Skeleton from "../../../components/ui/Skeleton";

export default function QuizList() {
  const navigate = useNavigate();
  const { authFetch, isAuthenticated, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [confirmDeleteQuiz, setConfirmDeleteQuiz] = useState(null);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;

    authFetch("/api/quizzes")
      .then((res) => res.json())
      .then((response) => {
        if (!response.success) throw new Error(response.message || "Failed to load quizzes");
        setQuizzes(response.data || []);
      })
      .catch((err) => {
        setError(err.message);
        addToast(err.message, { type: "error" });
      })
      .finally(() => setLoading(false));
  }, [authFetch, isAuthenticated, authLoading, addToast]);

  const deleteQuiz = (quiz) => setConfirmDeleteQuiz(quiz);

  const confirmDelete = async () => {
    if (!confirmDeleteQuiz) return;
    const quiz = confirmDeleteQuiz;
    setDeletingId(quiz.id);
    setError("");

    try {
      const response = await authFetch(`/api/quizzes/${quiz.id}`, { method: "DELETE" }).then((res) => res.json());
      if (!response.success) throw new Error(response.message || "Failed to delete quiz");

      setQuizzes((items) => items.filter((item) => item.id !== quiz.id));
      setConfirmDeleteQuiz(null);
      addToast("Quiz deleted", { type: "info" });
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId("");
    }
  };

  const cancelDelete = () => setConfirmDeleteQuiz(null);

  return (
    <div
      className={`min-h-screen bg-[#060a0f] text-white px-4 py-10 relative overflow-hidden transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
      
    >
      {/* Ambient blobs */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-indigo-500/8 blur-[90px] -top-32 -right-36 pointer-events-none" />
      <div className="absolute w-[380px] h-[380px] rounded-full bg-violet-500/8 blur-[80px] -bottom-20 -left-16 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-3">
              <ListChecks size={11} />
              Quiz Bank
            </div>
            <h1
              className="text-4xl font-extrabold mt-1"
              
            >
              Manage{" "}
              <span className="bg-gradient-to-br from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Quizzes
              </span>
            </h1>
          </div>
          <button
            onClick={() => navigate("/quizzes/create")}
            className="btn-shimmer rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-3 font-bold shadow-[0_4px_16px_rgba(99,102,241,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(99,102,241,0.35)] transition-all duration-200 flex items-center gap-2"
            
          >
            <PlusCircle size={16} />
            Create Quiz
          </button>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Quiz grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {quizzes.map((quiz, i) => (
            <div
              key={quiz.id}
              className="group bg-[#0d131c]/80 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(99,102,241,0.12)]"
              style={{ animation: "staggerFade 0.4s ease both", animationDelay: `${i * 0.06}s` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2
                    className="text-xl font-extrabold truncate"
                    
                  >
                    {quiz.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2.5 py-0.5">
                      {quiz.question_count || 0} questions
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteQuiz(quiz)}
                  disabled={deletingId === quiz.id}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-950/50 text-red-300 border border-red-900/50 hover:bg-red-900/70 hover:border-red-700 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200"
                  title="Delete quiz"
                  aria-label={`Delete ${quiz.title}`}
                >
                  {deletingId === quiz.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              <button
                onClick={() => navigate(`/create-room?quizId=${encodeURIComponent(quiz.id)}`)}
                className="mt-5 w-full rounded-xl bg-emerald-600/90 hover:bg-emerald-600 px-4 py-2.5 font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                Use for Room
              </button>
            </div>
          ))}
        </div>

        {loading && (
          <div className="grid md:grid-cols-2 gap-4">
            <Skeleton count={4} />
          </div>
        )}

        {!loading && !quizzes.length && (
          <div className="bg-[#0d131c]/80 border border-slate-800 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
              <ListChecks size={28} className="text-indigo-400" />
            </div>
            <p className="text-slate-300 text-lg font-semibold mb-2">No quizzes yet</p>
            <p className="text-slate-500 text-sm mb-6">Create your first quiz to start hosting rooms.</p>
            <button
              onClick={() => navigate("/quizzes/create")}
              className="btn-shimmer rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-3 font-bold shadow-[0_4px_16px_rgba(99,102,241,0.25)] hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2"
              
            >
              <PlusCircle size={16} />
              Create First Quiz
            </button>
          </div>
        )}
      </div>

      {/* Confirmation modal */}
      {confirmDeleteQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={cancelDelete} />
          <div
            className="relative z-10 w-full max-w-md bg-[#0d131c] border border-slate-800 rounded-2xl p-6 shadow-2xl"
            style={{ animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Delete Quiz?</h3>
                <p className="text-sm text-slate-400">"{confirmDeleteQuiz.title}"</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 mb-6">This will also remove all its questions. This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2.5 font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingId === confirmDeleteQuiz.id}
                className="rounded-xl bg-red-600 hover:bg-red-500 px-5 py-2.5 font-bold disabled:opacity-60 flex items-center gap-2 transition"
              >
                {deletingId === confirmDeleteQuiz.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
