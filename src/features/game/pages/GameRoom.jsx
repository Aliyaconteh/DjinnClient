import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../../services/socket/socket";
import ScoreBoard from "../../../components/game/ScoreBoard";
import { useGame } from "../../../context/GameContext";

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

  const username = useMemo(() => localStorage.getItem("username") || "Guest", []);
  const playerId = useMemo(() => localStorage.getItem("playerId") || socket.id, []);

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
    };

    const handleTimer = (data) => setTimeRemaining(data.time);
    const handleLeaderboard = (data) => setLeaderboard(data.players || data.leaderboard || []);

    const handleConfirmed = (data) => {
      setAnswerStatus(data.isCorrect ? "correct" : "incorrect");
      setFeedback(
        data.isCorrect
          ? `Correct. +${data.pointsAwarded} points`
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
      setError(data.message || "Something went wrong in the game room.");
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
  }, [
    navigate,
    playerId,
    roomCode,
    setCurrentQuestion,
    setLeaderboard,
    setQuestionsAnswered,
    setTimeRemaining,
    setTotalQuestions,
    username
  ]);

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

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6 md:px-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-6">
        <main className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-sm text-slate-400 uppercase tracking-wide">Room {roomCode}</p>
              <h1 className="text-3xl font-black mt-1">Live Quiz</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                <span className="text-slate-400 text-sm">Question </span>
                <span className="font-bold">{questionNumber || 0}/{totalQuestions || 0}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-blue-600 font-black">
                {Math.max(0, timeRemaining || 0)}s
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 border border-red-700 bg-red-950/50 text-red-100 rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {currentQuestion ? (
            <>
              <div className="mb-8">
                <p className="text-slate-400 text-sm mb-2">Answered: {questionsAnswered}</p>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  return (
                    <button
                      key={option}
                      onClick={() => submitAnswer(option)}
                      disabled={
                        Number(timeRemaining || 0) <= 0 ||
                        ["pending", "correct", "incorrect"].includes(answerStatus)
                      }
                      className={`text-left rounded-2xl border px-5 py-4 transition font-semibold ${
                        isSelected
                          ? "bg-blue-600 border-blue-400 text-white"
                          : "bg-slate-800 border-slate-700 hover:border-blue-500"
                      } disabled:cursor-not-allowed disabled:opacity-80`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {feedback && (
                <div className="mt-6 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100">
                  {feedback}
                </div>
              )}

              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  onClick={() => socket.emit("quiz-end", { roomCode })}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold"
                >
                  Finish Quiz
                </button>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-slate-300">
              Waiting for the host to start the first question...
            </div>
          )}
        </main>

        <aside className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <ScoreBoard players={leaderboard || []} />
        </aside>
      </div>
    </div>
  );
}
