import { useRef, useState } from "react";
import { CopyText } from "../copy";
import type {
  ConnectionState,
  ControllerButton,
  ControllerButtonGroup,
  DetectedButton,
  GameModeId,
  GameStateSnapshot,
  GameStatus,
  GameSummary,
  PromptDisplay,
  PromptMode,
  RoundRecord,
  Theme,
  UserPreferences
} from "../types";

export function useGameState(savedPreferences: UserPreferences) {
  const [theme, setTheme] = useState<Theme>(savedPreferences.theme);
  const [connection, setConnection] = useState<ConnectionState>({
    connected: false,
    label: CopyText.PressAnyControllerButton
  });
  const [status, setStatus] = useState<GameStatus>("welcome");
  const [selectedMode, setSelectedMode] = useState<GameModeId>(savedPreferences.mode);
  const [customGroups, setCustomGroups] = useState<ControllerButtonGroup[]>(
    savedPreferences.customGroups
  );
  const [roundsPerGame, setRoundsPerGame] = useState(savedPreferences.rounds);
  const [prompt, setPrompt] = useState<PromptDisplay | null>(null);
  const [mode, setMode] = useState<PromptMode>("idle");
  const [message, setMessage] = useState("");
  const [celebration, setCelebration] = useState("");
  const [rounds, setRounds] = useState<RoundRecord[]>([]);
  const [games, setGames] = useState<GameSummary[]>([]);
  const [streak, setStreak] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showRounds, setShowRounds] = useState(false);
  const [showControllerSetup, setShowControllerSetup] = useState(false);
  const [detectedButtons, setDetectedButtons] = useState<DetectedButton[]>([]);
  const stateRef = useRef<GameStateSnapshot>({
    status,
    prompt,
    rounds,
    roundsPerGame,
    streak,
    hits,
    misses
  });
  const waitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptStartedAt = useRef(0);
  const promptButtonsRef = useRef<ControllerButton[]>([]);

  return {
    theme,
    setTheme,
    connection,
    setConnection,
    status,
    setStatus,
    selectedMode,
    setSelectedMode,
    customGroups,
    setCustomGroups,
    roundsPerGame,
    setRoundsPerGame,
    prompt,
    setPrompt,
    mode,
    setMode,
    message,
    setMessage,
    celebration,
    setCelebration,
    rounds,
    setRounds,
    games,
    setGames,
    streak,
    setStreak,
    hits,
    setHits,
    misses,
    setMisses,
    showInstructions,
    setShowInstructions,
    showRounds,
    setShowRounds,
    showControllerSetup,
    setShowControllerSetup,
    detectedButtons,
    setDetectedButtons,
    stateRef,
    waitTimer,
    reactionTimer,
    feedbackTimer,
    promptStartedAt,
    promptButtonsRef
  };
}
