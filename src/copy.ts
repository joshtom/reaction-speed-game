import type { ControllerButton, ReactionGrade } from "./types";

export enum CopyText {
  AppName = "Triggr",
  PressAnyControllerButton = "Press a controller button to activate",
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
  OpenControllerSetup = "Open controller setup",
  CloseControllerSetup = "Close controller setup",
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
  ControllerStatus = "Controller status",
  DetectedController = "Detected controller",
  ControllerNotActive = "Waiting for controller",
  ActivationRequired = "Activation required",
  SupportedButtons = "Supported buttons",
  BrowserGamepadNote = "Browsers expose controller data only after a page is focused and a controller button is pressed.",
  ControllerDetected = "Controller detected. Match each prompt from the selected mode when it lights up.",
  ControllerConnectHelp = "Connect by USB or Bluetooth, focus this page, then press any controller button once.",
  Mode = "Mode",
  GameMode = "Game mode",
  ClassicMode = "Classic",
  ClassicModeLabel = "Face buttons",
  ClassicModeDescription = "Cross, Circle, Square, and Triangle.",
  FullPadMode = "Full Pad",
  FullPadModeLabel = "All buttons",
  FullPadModeDescription = "Face buttons, shoulders, triggers, and D-pad.",
  DpadDrillMode = "D-pad Drill",
  DpadDrillModeLabel = "Direction focus",
  DpadDrillModeDescription = "Up, Down, Left, and Right only.",
  ShoulderTriggerMode = "Shoulder / Trigger Drill",
  ShoulderTriggerModeLabel = "Top buttons",
  ShoulderTriggerModeDescription = "L1, R1, L2, and R2 only.",
  CustomMode = "Custom Mix",
  CustomModeLabel = "Your groups",
  CustomModeDescription = "Choose exactly which button groups appear.",
  CustomMix = "Custom mix",
  ButtonTest = "Button test",
  ButtonTestIdle = "Press any controller button while this modal is open.",
  LastDetected = "Last detected",
  BrowserIndex = "Browser index",
  NoButtonDetected = "Ready to listen",
  MappingUnknown = "Mapping appears here after the first button press.",
  GroupReadout = "Group readout",
  BestGroup = "Best group",
  WeakestGroup = "Weakest group",
  NeedMoreRounds = "Need more rounds",
  FaceGroup = "Face",
  DpadGroup = "D-pad",
  ShoulderGroup = "Shoulder",
  TriggerGroup = "Trigger",
  Last = "Last",
  Average = "Average",
  Best = "Best",
  Streak = "Streak",
  Hits = "Hits",
  Misses = "Misses",
  Round = "Round",
  LastGames = "Last 3 games",
  Rank = "Rank",
  ModeName = "Mode",
  Groups = "Groups",
  Accuracy = "Accuracy",
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
  InstructionReactBody = "A random prompt appears after 0.8-2.6s. Press the matching controller button before time runs out.",
  InstructionScoreTitle = "3. Score",
  InstructionScoreBody = "Under 220ms is Fast, under 400ms is Good, and slower hits are Slow. Wrong buttons and 2.5s timeouts count as misses.",
  InstructionKeyboardTitle = "Keyboard fallback",
  InstructionKeyboardBody = "Use X/O/S/T for face buttons, Q/E for L1/R1, A/D for L2/R2, and arrow keys for D-pad drills.",
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
  Triangle = "Triangle",
  L1 = "L1",
  R1 = "R1",
  L2 = "L2",
  R2 = "R2",
  DpadUp = "D-pad Up",
  DpadDown = "D-pad Down",
  DpadLeft = "D-pad Left",
  DpadRight = "D-pad Right"
}

export const emptyValue = "--";
export const emptyGrade: ReactionGrade = "--";

export function promptHit(button: ControllerButton): string {
  return `Hit ${button.name}.`;
}

export function gameComplete(hits: number, misses: number): string {
  return `Game complete: ${hits} hits, ${misses} misses.`;
}

export function falseStart(button: ControllerButton): string {
  return `False start: ${button.name} before the prompt.`;
}

export function missedButton(button: ControllerButton): string {
  return `Miss: ${button.name}`;
}

export function wrongButton(actual: ControllerButton, expected: string): string {
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
