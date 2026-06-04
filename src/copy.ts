import type { FaceButton, ReactionGrade } from "./types";

export enum CopyText {
  AppName = "Triggr",
  PressAnyControllerButton = "Press any controller button",
  GamepadApiUnavailable = "Gamepad API unavailable",
  ControllerConnected = "Controller connected",
  StandBy = "Stand by. The next button can light up any moment.",
  RoundOneIncoming = "Round 1 incoming.",
  Complete = "Complete",
  RunComplete = "Run complete. Tune the round count or play again.",
  TooSoon = "Too soon",
  CurrentRun = "Current run",
  ViewCurrentRun = "View current run",
  CloseCurrentRun = "Close current run",
  MuteReactionSounds = "Mute reaction sounds",
  EnableReactionSounds = "Enable reaction sounds",
  UseLightMode = "Use light mode",
  UseDarkMode = "Use dark mode",
  RoundsPerGame = "Rounds per game",
  PlayAgain = "Play again",
  StartGame = "Start game",
  Reset = "Reset",
  Instructions = "Instructions",
  CloseInstructions = "Close instructions",
  ControllerSetup = "Controller setup",
  ControllerDetected = "Controller detected. Match Cross, Circle, Square, and Triangle when they light up.",
  ControllerConnectHelp = "Connect by USB or Bluetooth, then press any controller button once to activate.",
  Last = "Last",
  Average = "Average",
  Best = "Best",
  Streak = "Streak",
  Hits = "Hits",
  Misses = "Misses",
  Round = "Round",
  LastGames = "Last 8 games",
  Rank = "Rank",
  Avg = "Avg",
  Miss = "Miss",
  Rounds = "Rounds",
  FinishGameToRank = "Finish a game to rank it.",
  NoRoundsYet = "No rounds yet.",
  Prompt = "Prompt",
  Result = "Result",
  Time = "Time",
  Grade = "Grade",
  HowToPlay = "How to play",
  InstructionConnectTitle = "1. Connect",
  InstructionConnectBody = "Use USB or Bluetooth. Browser Gamepad API activates after one controller button press.",
  InstructionReactTitle = "2. React",
  InstructionReactBody = "A random face button appears after 0.8-2.6s. Press the matching Cross, Circle, Square, or Triangle button.",
  InstructionScoreTitle = "3. Score",
  InstructionScoreBody = "Under 220ms is Fast, under 400ms is Good, and slower hits are Slow. Wrong buttons and 2.5s timeouts count as misses.",
  InstructionKeyboardTitle = "Keyboard fallback",
  InstructionKeyboardBody = "Use X for Cross, O for Circle, S for Square, and T for Triangle while testing without a controller.",
  BackToArena = "Back to arena",
  Hit = "Hit",
  Timeout = "Timeout",
  FalseStartPrompt = "Too soon",
  Fast = "Fast",
  Good = "Good",
  Slow = "Slow",
  Cross = "Cross",
  Circle = "Circle",
  Square = "Square",
  Triangle = "Triangle"
}

export const emptyValue = "--";
export const emptyGrade: ReactionGrade = "--";

export function promptHit(button: FaceButton): string {
  return `Hit ${button.name}.`;
}

export function gameComplete(hits: number, misses: number): string {
  return `Game complete: ${hits} hits, ${misses} misses.`;
}

export function falseStart(button: FaceButton): string {
  return `False start: ${button.name} before the prompt.`;
}

export function missedButton(button: FaceButton): string {
  return `Miss: ${button.name}`;
}

export function wrongButton(actual: FaceButton, expected: string): string {
  return `Wrong button: ${actual.name} instead of ${expected}.`;
}

export function correctButton(promptName: string, elapsedLabel: string, grade: ReactionGrade): string {
  return `${promptName} hit in ${elapsedLabel} (${grade}).`;
}

export function timeout(promptName: string): string {
  return `Timeout: ${promptName} was missed.`;
}

export function streakRemarkText(streak: number): string {
  if (streak >= 8) return `${streak} streak. Reflex legend territory.`;
  if (streak >= 5) return `${streak} streak. You are reading the future.`;
  if (streak >= 3) return `${streak} streak. Stay locked.`;
  return "";
}
