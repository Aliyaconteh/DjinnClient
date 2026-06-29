import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Save, Clock, ChevronDown } from "lucide-react";
import { useToast } from "../../../components/ui/ToastContext";
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
  const [touched, setTouched] = useState({});
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(`/signin?redirect=${encodeURIComponent(window.location.pathname)}`);
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

  const markTouched = (field) => setTouched((p) => ({ ...p, [field]: true }));

  const saveQuiz = async () => {
    setError("");
    // Mark all as touched for validation display
    const allTouched = { title: true };
    questions.forEach((_, i) => {
      allTouched[`q${i}`] = true;
      allTouched[`q${i}_opts`] = true;
      allTouched[`q${i}_correct`] = true;
    });
    setTouched(allTouched);

    if (!title.trim()) {
      setError("Quiz title is required.");
      addToast("Quiz title is required.", { type: "error" });
      return;
    }
    for (const item of questions) {
      if (!item.question.trim()) {
        setError("Every question needs text.");
        addToast("Every question needs text.", { type: "error" });
        return;
      }
      if (item.options.some((option) => !option.trim())) {
        setError("Every question needs four options.");
        addToast("Every question needs four options.", { type: "error" });
        return;
      }
      if (!item.correctAnswer.trim()) {
        setError("Select a correct answer for every question.");
        addToast("Select a correct answer for every question.", { type: "error" });
        return;
      }
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

      addToast("Quiz created successfully!", { type: "success" });
      navigate("/quizzes");
    } catch (err) {
      setError(err.message);
      addToast(err.message, { type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full bg-[#0f1720] border-[1.5px] rounded-xl px-4 py-3 outline-none transition-all duration-150 placeholder:text-slate-700 focus:border-indigo-500 focus:bg-indigo-500/[0.05] focus:ring-2 focus:ring-indigo-500/10 ${hasError ? "border-red-500/70" : "border-slate-700/50"}`;

  return (
    <div
      className={`min-h-screen bg-[#060a0f] text-white px-4 py-10 relative overflow-hidden transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
      
    >
      {/* Ambient blobs */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-indigo-500/8 blur-[90px] -top-32 -right-36 pointer-events-none" />
      <div className="absolute w-[380px] h-[380px] rounded-full bg-violet-500/8 blur-[80px] -bottom-20 -left-16 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-3">
            <PlusCircle size={11} />
            Quiz Builder
          </div>
          <h1
            className="text-4xl font-extrabold mt-1"
            
          >
            Create{" "}
            <span className="bg-gradient-to-br from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Quiz
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-2">
            {questions.length} question{questions.length !== 1 ? "s" : ""} added
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Title */}
        <div className="bg-[#0d131c]/80 border border-slate-800 rounded-2xl p-6 mb-5">
          <label className="text-[0.68rem] font-semibold tracking-[0.08em] uppercase text-slate-500 mb-2 block">Quiz Title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={() => markTouched("title")}
            className={inputClass(touched.title && !title.trim())}
            placeholder="e.g. Computer Science Basics"
            
          />
          {touched.title && !title.trim() && (
            <p className="text-xs text-red-400 mt-1.5">Title is required</p>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {questions.map((item, index) => (
            <div
              key={index}
              className="bg-[#0d131c]/80 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-slate-700"
              style={{ animation: "staggerFade 0.4s ease both", animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-sm font-bold text-indigo-400">
                    {index + 1}
                  </div>
                  <h2 className="text-xl font-extrabold" >
                    Question {index + 1}
                  </h2>
                </div>
                {questions.length > 1 && (
                  <button
                    onClick={() => setQuestions((items) => items.filter((_, i) => i !== index))}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-red-950/50 border border-red-900/50 text-red-300 hover:bg-red-900/70 px-3 py-2 text-sm font-semibold transition-all duration-200"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                )}
              </div>

              <input
                value={item.question}
                onChange={(event) => updateQuestion(index, { question: event.target.value })}
                onBlur={() => markTouched(`q${index}`)}
                className={`${inputClass(touched[`q${index}`] && !item.question.trim())} mb-4`}
                placeholder="Enter your question"
                
              />

              <div className="grid sm:grid-cols-2 gap-3 mb-4">
                {item.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <input
                      value={option}
                      onChange={(event) => updateOption(index, optionIndex, event.target.value)}
                      onBlur={() => markTouched(`q${index}_opts`)}
                      className={`${inputClass(touched[`q${index}_opts`] && !option.trim())} pl-8`}
                      placeholder={`Option ${optionIndex + 1}`}
                      
                    />
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="relative">
                  <select
                    value={item.correctAnswer}
                    onChange={(event) => updateQuestion(index, { correctAnswer: event.target.value })}
                    onBlur={() => markTouched(`q${index}_correct`)}
                    className={`${inputClass(touched[`q${index}_correct`] && !item.correctAnswer.trim())} appearance-none pr-10 cursor-pointer`}
                    
                  >
                    <option value="">Correct answer</option>
                    {item.options.filter(Boolean).map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
                <div className="relative">
                  <Clock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={item.timeLimit}
                    onChange={(event) => updateQuestion(index, { timeLimit: event.target.value })}
                    className={`${inputClass(false)} pl-9`}
                    placeholder="Time limit"
                    
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-600 font-semibold">sec</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={() => setQuestions((items) => [...items, emptyQuestion()])}
            className="rounded-2xl border-2 border-dashed border-slate-700 hover:border-indigo-500/50 px-5 py-3 font-bold text-slate-400 hover:text-indigo-400 transition-all duration-200 flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Add Question
          </button>
          <button
            onClick={saveQuiz}
            disabled={saving}
            className="btn-shimmer rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 px-6 py-3 font-bold shadow-[0_4px_16px_rgba(99,102,241,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(99,102,241,0.35)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-2"
            
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                <Save size={16} />
                Save Quiz
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
