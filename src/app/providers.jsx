import { GameProvider } from "../context/GameContext";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import {RoomProvider} from "../context/RoomContext";
export default function Providers({ children }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <GameProvider>
          <RoomProvider>
            {children}
          </RoomProvider>
        </GameProvider>
      </SocketProvider>
    </AuthProvider>
  );
}