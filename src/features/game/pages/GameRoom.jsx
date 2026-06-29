import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle, Clock, Flag } from "lucide-react";
import { socket } from "../../../services/socket/socket";
import ScoreBoard from "../../../components/game/ScoreBoard";
import { useGame } from "../../../context/GameContext";
import { useToast } from "../../../components/ui/ToastContext";

const LETTERS = ["A", "B", "C", "D"];

export default function GameRoom() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const {
    leaderboard,
    setLeaderboard,
    currentQuestion,
    setCurrentQuestion,
    timeRemaining,
    setTimeRemaining,
    totalQuestions,
    setTotalQuestions,
    questionsAnswered,
    setQuestionsAnswered
  } = useGame();

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerStatus, setAnswerStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const [questionNumber, setQuestionNumber] = useState(0);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [questionKey, setQuestionKey] = useState(0);
  const { addToast } = useToast();

  const username = useMemo(() => localStorage.getItem("username") || "Guest", []);
  const playerId = useMemo(() => localStorage.getItem("playerId") || socket.id, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit("game:join", { roomCode, username, playerId });

    const handleQuestion = (data) => {
      setCurrentQuestion(data.question);
      setQuestionNumber(data.questionNumber || 1);
      setTotalQuestions(data.totalQuestions || 0);
      setSelectedAnswer("");
      setAnswerStatus("idle");
      setFeedback("");
      setError("");
      setQuestionKey((k) => k + 1);
    };

    const handleTimer = (data) => setTimeRemaining(data.time);
    const handleLeaderboard = (data) => setLeaderboard(data.players || data.leaderboard || []);

    const handleConfirmed = (data) => {
      setAnswerStatus(data.isCorrect ? "correct" : "incorrect");
      setFeedback(
        data.isCorrect
          ? `Correct! +${data.pointsAwarded} points`
          : "Not quite. Your answer was recorded."
      );
      setQuestionsAnswered((count) => count + 1);
    };

    const handleRejected = (data) => {
      setAnswerStatus("rejected");
      setFeedback(data.reason || "Answer rejected");
    };

    const handleFinished = (data) => {
      setLeaderboard(data.leaderboard || data.scores || []);
      navigate(`/results/${roomCode}`);
    };

    const handleError = (data) => {
      const msg = data.message || "Something went wrong in the game room.";
      setError(msg);
      addToast(msg, { type: "error" });
      setAnswerStatus("idle");
    };

    socket.on("game:question", handleQuestion);
    socket.on("game:timer", handleTimer);
    socket.on("game:leaderboard", handleLeaderboard);
    socket.on("leaderboard-update", handleLeaderboard);
    socket.on("answer_confirmed", handleConfirmed);
    socket.on("submission_rejected", handleRejected);
    socket.on("game:finished", handleFinished);
    socket.on("error", handleError);

    return () => {
      socket.off("game:question", handleQuestion);
      socket.off("game:timer", handleTimer);
      socket.off("game:leaderboard", handleLeaderboard);
      socket.off("leaderboard-update", handleLeaderboard);
      socket.off("answer_confirmed", handleConfirmed);
      socket.off("submission_rejected", handleRejected);
      socket.off("game:finished", handleFinished);
      socket.off("error", handleError);
    };
  }, [navigate, playerId, roomCode, setCurrentQuestion, setLeaderboard, setQuestionsAnswered, setTimeRemaining, setTotalQuestions, username, addToast]);

  const submitAnswer = (answer) => {
    if (!currentQuestion || answerStatus === "pending" || Number(timeRemaining || 0) <= 0) return;

    const predictedScore = Number(
      leaderboard.find((player) => player.username === username)?.score || 0
    ) + 100;

    setSelectedAnswer(answer);
    setAnswerStatus("pending");
    setFeedback("Submitting answer...");

    socket.emit("game:answer", {
      roomCode,
      questionId: currentQuestion.id,
      answer,
      username,
      playerId,
      clientTimestamp: new Date().getTime(),
      clientPredictedScore: predictedScore
    });
  };

  const timerValue = Math.max(0, timeRemaining || 0);
  const timerColor = timerValue > 10 ? "text-blue-400" : timerValue > 5 ? "text-amber-400" : "text-red-400";
  const timerBg = timerValue > 10 ? "bg-blue-500/10 border-blue-500/30" : timerValue > 5 ? "bg-amber-500/10 border-amber-500/30" : "bg-red-500/10 border-red-500/30";
  const progressPct = totalQuestions > 0 ? (questionNumber / totalQuestions) * 100 : 0;

  const feedbackIcon = answerStatus === "correct" ? <CheckCircle size={18} className="text-emerald-400" /> : answerStatus === "incorrect" ? <XCircle size={18} className="text-red-400" /> : answerStatus === "rejected" ? <AlertCircle size={18} className="text-amber-400" /> : null;
  const feedbackBg = answerStatus === "correct" ? "bg-emerald-500/10 border-emerald-500/20" : answerStatus === "incorrect" ? "bg-red-500/10 border-red-500/20" : answerStatus === "rejected" ? "bg-amber-500/10 border-amber-500/20" : "bg-slate-800 border-slate-700";

  return (
    <div
      className={`min-h-screen bg-[#060a0f] text-white px-4 py-6 md:px-10 relative overflow-hidden transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
      
    >
      {/* Ambient blobs */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-indigo-500/6 blur-[90px] -top-32 -right-36 pointer-events-none" />
      <div className="absolute w-[380px] h-[380px] rounded-full bg-violet-500/6 blur-[80px] -bottom-20 -left-16 pointer-events-none" />

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-6 relative">
        <main className="bg-[#0d131c]/80 border border-slate-800 rounded-2xl p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Room {roomCode}</p>
              <h1 className="text-3xl font-extrabold mt-1" >Live Quiz</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                <span className="text-slate-400 text-sm">Question </span>
                <span className="font-bold">{questionNumber || 0}/{totalQuestions || 0}</span>
              </div>
              <div className={`px-4 py-2 rounded-xl font-black flex items-center gap-1.5 border ${timerBg}`}>
                <Clock size={14} className={timerColor} />
                <span className={timerColor}>{timerValue}s</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {totalQuestions > 0 && (
            <div className="mb-6">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {currentQuestion ? (
            <div key={questionKey} style={{ animation: "slideUp 0.4s ease both" }}>
              <div className="mb-8">
                <p className="text-slate-500 text-sm mb-2 font-medium">Answered: {questionsAnswered}</p>
                <h2 className="text-2xl md:text-4xl font-extrabold leading-tight" >
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedAnswer === option;
                  const isDisabled = Number(timeRemaining || 0) <= 0 || ["pending", "correct", "incorrect"].includes(answerStatus);
                  const showCorrect = answerStatus === "correct" && isSelected;
                  const showWrong = answerStatus === "incorrect" && isSelected;

                  let optionStyle = "bg-slate-800/60 border-slate-700/50 hover:border-indigo-500/60 hover:bg-slate-800";
                  if (isSelected && answerStatus === "pending") optionStyle = "bg-indigo-500/15 border-indigo-500/50";
                  if (showCorrect) optionStyle = "bg-emerald-500/15 border-emerald-500/50";
                  if (showWrong) optionStyle = "bg-red-500/15 border-red-500/50";

                  return (
                    <button
                      key={option}
                      onClick={() => submitAnswer(option)}
                      disabled={isDisabled}
                      className={`text-left rounded-2xl border px-5 py-4 transition-all duration-200 font-semibold flex items-center gap-3 ${optionStyle} disabled:cursor-not-allowed disabled:opacity-80`}
                    >
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        showCorrect ? "bg-emerald-500/20 text-emerald-400" :
                        showWrong ? "bg-red-500/20 text-red-400" :
                        isSelected ? "bg-indigo-500/20 text-indigo-400" :
                        "bg-slate-700/50 text-slate-400"
                      }`}>
                        {LETTERS[idx]}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className={`mt-6 rounded-xl px-4 py-3 flex items-center gap-3 border ${feedbackBg}`} style={{ animation: "fadeIn 0.3s ease both" }}>
                  {feedbackIcon}
                  <span className="text-slate-100 text-sm font-medium">{feedback}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  onClick={() => socket.emit("quiz-end", { roomCode })}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold flex items-center gap-2 transition-all duration-200"
                >
                  <Flag size={14} />
                  Finish Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5 animate-float">
                <Clock size={28} className="text-indigo-400" />
              </div>
              <p className="text-slate-300 font-semibold text-lg">Waiting for the first question...</p>
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0s" }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: "0.4s" }} />
              </div>
            </div>
          )}
        </main>

        <aside className="bg-[#0d131c]/80 border border-slate-800 rounded-2xl p-6 max-h-[400px] lg:max-h-none overflow-y-auto">
          <ScoreBoard players={leaderboard || []} />
        </aside>
      </div>
    </div>
  );
}
