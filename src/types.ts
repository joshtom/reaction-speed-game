export type FaceButtonId = 0 | 1 | 2 | 3;

export type FaceButton = {
  id: FaceButtonId;
  key: string;
  name: string;
  symbol: string;
  alias: string;
  color: string;
  modelPosition: [number, number, number];
};

export type GameStatus = "welcome" | "waiting" | "prompt" | "complete";
export type PromptMode = "idle" | "live" | "hit" | "miss" | "warning" | "timeout" | "complete";
export type ReactionGrade = "Fast" | "Good" | "Slow" | "--";
export type Theme = "dark" | "light";
export type SoundCue = "prompt" | "fast" | "good" | "slow" | "miss" | "streak" | "complete";

export type PromptDisplay = Pick<FaceButton, "name" | "symbol" | "color"> & Partial<Pick<FaceButton, "id" | "alias" | "modelPosition">>;

export type RoundRecord = {
  number: number;
  prompt: string;
  result: string;
  correct: boolean;
  time: number | null;
  grade: ReactionGrade;
};

export type GameSummary = {
  id: string;
  avg: number | null;
  best: number | null;
  misses: number;
  rounds: number;
  hits: number;
  createdAt: string;
};

export type ConnectionState = {
  connected: boolean;
  label: string;
};

export type LiveStatsValue = {
  avg: number | null;
  best: number | null;
  last: number | null;
};

export type GameStateSnapshot = {
  status: GameStatus;
  prompt: PromptDisplay | null;
  rounds: RoundRecord[];
  roundsPerGame: number;
  streak: number;
  hits: number;
  misses: number;
};
