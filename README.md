# QuizRoom Frontend

React/Vite client for the QuizRoom final project.

Main flows:
- Create Quiz: build quiz questions, options, correct answers, and timers.
- Create Room: choose a quiz and create a live room code.
- Join Room: players enter the room code.
- Live Quiz: the server sends questions and advances everyone using the question timer.
- Results: final leaderboard after the quiz ends.

Local setup:
```bash
npm install
npm run dev
```

Environment variables belong in `.env`, which is ignored by Git.
