import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  timeLimit: 15
});

export default function CreateQuiz() {
  const navigate = useNavigate();
  const { authFetch, user, isAuthenticated, loading: authLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/signIn?redirect=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [isAuthenticated, authLoading, navigate]);

  const updateQuestion = (index, updates) => {
    setQuestions((items) => items.map((item, i) => (i === index ? { ...item, ...updates } : item)));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((items) =>
      items.map((item, i) => {
        if (i !== questionIndex) return item;
        const options = [...item.options];
        options[optionIndex] = value;
        return { ...item, options };
      })
    );
  };

  const saveQuiz = async () => {
    setError("");

    if (!title.trim()) return setError("Quiz title is required.");
    for (const item of questions) {
      if (!item.question.trim()) return setError("Every question needs text.");
      if (item.options.some((option) => !option.trim())) return setError("Every question needs four options.");
      if (!item.correctAnswer.trim()) return setError("Select a correct answer for every question.");
    }

    setSaving(true);
    try {
        const quizResponse = await authFetch("/api/quizzes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title.trim(), created_by: user.id })
        }).then((res) => res.json());

      if (!quizResponse.success) throw new Error(quizResponse.message || "Could not create quiz");

      for (const item of questions) {
        const questionResponse = await authFetch("/api/quizzes/question", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quiz_id: quizResponse.data.id,
            question: item.question.trim(),
            options: item.options.map((option) => option.trim()),
            correct_answer: item.correctAnswer.trim(),
            time_limit: Number(item.timeLimit || 15)
          })
        }).then((res) => res.json());

        if (!questionResponse.success) throw new Error(questionResponse.message || "Could not save a question");
      }

      navigate("/quizzes");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-sm text-slate-400 uppercase tracking-wide">Quiz Builder</p>
          <h1 className="text-4xl font-black mt-1">Create Quiz</h1>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-700 bg-red-950/50 px-4 py-3 text-red-100">
            {error}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-5">
          <label className="block text-sm text-slate-300 mb-2">Quiz Title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Computer Science Basics"
          />
        </div>

        <div className="space-y-5">
          {questions.map((item, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-black">Question {index + 1}</h2>
                {questions.length > 1 && (
                  <button
                    onClick={() => setQuestions((items) => items.filter((_, i) => i !== index))}
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-2 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                value={item.question}
                onChange={(event) => updateQuestion(index, { question: event.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 mb-4"
                placeholder="Enter question"
              />

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {item.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    value={option}
                    onChange={(event) => updateOption(index, optionIndex, event.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <select
                  value={item.correctAnswer}
                  onChange={(event) => updateQuestion(index, { correctAnswer: event.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                >
                  <option value="">Correct answer</option>
                  {item.options.filter(Boolean).map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={item.timeLimit}
                  onChange={(event) => updateQuestion(index, { timeLimit: event.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Time limit"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => setQuestions((items) => [...items, emptyQuestion()])}
            className="rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-3 font-bold"
          >
            Add Question
          </button>
          <button
            onClick={saveQuiz}
            disabled={saving}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-5 py-3 font-bold"
          >
            {saving ? "Saving..." : "Save Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}
