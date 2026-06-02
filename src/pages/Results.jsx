import { useGame } from "../../../context/GameContext";

export default function Results() {
  const { scores } = useGame();

  return (
    <div>
      <h1>Game Results</h1>

      {Object.entries(scores).map(([player, score]) => (
        <p key={player}>
          {player}: {score}
        </p>
      ))}
    </div>
  );
}