import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Trash2 } from "lucide-react";
import { apiUrl } from "../../../config/api";

export default function QuizList() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(apiUrl("/api/quizzes"))
      .then((res) => res.json())
      .then((response) => {
        if (!response.success) throw new Error(response.message || "Failed to load quizzes");
        setQuizzes(response.data || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const deleteQuiz = async (quiz) => {
    const confirmed = window.confirm(`Delete "${quiz.title}"? This will also remove its questions.`);
    if (!confirmed) return;

    setDeletingId(quiz.id);
    setError("");

    try {
      const response = await fetch(apiUrl(`/api/quizzes/${quiz.id}`), {
        method: "DELETE"
      }).then((res) => res.json());

      if (!response.success) throw new Error(response.message || "Failed to delete quiz");

      setQuizzes((items) => items.filter((item) => item.id !== quiz.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-slate-400 uppercase tracking-wide">Quiz Bank</p>
            <h1 className="text-4xl font-black mt-1">Manage Quizzes</h1>
          </div>
          <button
            onClick={() => navigate("/quizzes/create")}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 font-bold"
          >
            Create Quiz
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-700 bg-red-950/50 px-4 py-3 text-red-100">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black">{quiz.title}</h2>
                  <p className="text-slate-400 mt-2">{quiz.question_count || 0} questions</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteQuiz(quiz)}
                  disabled={deletingId === quiz.id}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-950/70 text-red-200 border border-red-900 hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-60"
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
                className="mt-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 font-bold"
              >
                Use for Room
              </button>
            </div>
          ))}
        </div>

        {loading && <p className="text-slate-400">Loading quizzes...</p>}
        {!loading && !quizzes.length && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">
            <p className="text-slate-300 mb-5">No quizzes found. Create one to start a room.</p>
            <button
              onClick={() => navigate("/quizzes/create")}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-3 font-bold"
            >
              Create First Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
