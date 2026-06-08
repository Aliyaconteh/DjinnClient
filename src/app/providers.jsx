import { GameProvider } from "../context/GameContext";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import { RoomProvider } from "../context/RoomContext";
import ToastProvider from "../components/ui/ToastProvider";

export default function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <SocketProvider>
          <GameProvider>
            <RoomProvider>{children}</RoomProvider>
          </GameProvider>
        </SocketProvider>
      </AuthProvider>
    </ToastProvider>
  );
}