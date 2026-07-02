import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import SignIn from "../features/auth/pages/SignIn";
import SignUp from "../features/auth/pages/SignUp";
import Profile from "../features/auth/pages/Profile";
import RequireAuth from "../features/auth/RequireAuth";
import CreateRoom from "../features/rooms/pages/CreateRoom";
import JoinRoom from "../features/rooms/pages/JoinRoom";
import WaitingRoom from "../features/rooms/pages/WaitingRoom";
import GameRoom from "../features/game/pages/GameRoom";
import Results from "../features/game/pages/Results";
import SyncAnalysis from "../features/sync/pages/SyncAnalysis";
import Leaderboard from "../features/leaderboard/pages/Leaderboard";
import QuizList from "../features/quizzes/pages/QuizList";
import CreateQuiz from "../features/quizzes/pages/CreateQuiz";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/create-room"
          element={<CreateRoom />}
        />

        <Route
          path="/join-room"
          element={<JoinRoom />}
        />

        <Route
          path="/waiting-room/:roomCode"
          element={<WaitingRoom />}
        />

        <Route
          path="/game/:roomCode"
          element={<GameRoom />}
        />

        <Route
          path="/results/:roomCode"
          element={<Results />}
        />

        <Route
          path="/sync-analysis"
          element={<SyncAnalysis />}
        />

        <Route
          path="/leaderboard"
          element={<Leaderboard />}
        />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

        <Route path="/quizzes" element={<RequireAuth><QuizList /></RequireAuth>} />

        <Route path="/quizzes/create" element={<RequireAuth><CreateQuiz /></RequireAuth>} />

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
