export type ControllerButtonId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 12 | 13 | 14 | 15;
export type ControllerButtonGroup = "face" | "shoulder" | "trigger" | "dpad";
export type GameModeId = "classic" | "full-pad" | "dpad-drill" | "shoulder-trigger";

export type ControllerButton = {
  id: ControllerButtonId;
  group: ControllerButtonGroup;
  key: string;
  name: string;
  symbol: string;
  alias: string;
  color: string;
};

export type FaceButton = ControllerButton & {
  id: 0 | 1 | 2 | 3;
  group: "face";
};

export type GameMode = {
  id: GameModeId;
  name: string;
  label: string;
  description: string;
  buttonGroups: ControllerButtonGroup[];
};

export type GameStatus = "welcome" | "waiting" | "prompt" | "complete";
export type PromptMode = "idle" | "live" | "hit" | "miss" | "warning" | "timeout" | "complete";
export type ReactionGrade = "Fast" | "Good" | "Slow" | "--";
export type Theme = "dark" | "light";
export type SoundCue = "prompt" | "fast" | "good" | "slow" | "miss" | "streak" | "complete";

export type PromptDisplay = Pick<ControllerButton, "name" | "symbol" | "color"> & Partial<Pick<ControllerButton, "id" | "alias">>;

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
