import type { ControllerButton, FaceButton, GameMode } from "./types";
import { CopyText } from "./copy";

export const COLORS = {
  cross: "#39a8ff",
  circle: "#ff646d",
  square: "#ff5fac",
  triangle: "#36d786",
  shoulderLeft: "#ffd166",
  shoulderRight: "#ff9f1c",
  triggerLeft: "#8fd3ff",
  triggerRight: "#b983ff",
  dpadUp: "#6ee7b7",
  dpadDown: "#2dd4bf",
  dpadLeft: "#f472b6",
  dpadRight: "#fb7185",
  success: "#31d17b",
  warning: "#ffd166",
  white: "#ffffff",
  modelFallback: "#f2f4f8"
} as const;

export const FACE_BUTTONS: FaceButton[] = [
  { id: 0, group: "face", key: "x", name: CopyText.Cross, symbol: "X", alias: CopyText.Cross, color: COLORS.cross },
  { id: 1, group: "face", key: "o", name: CopyText.Circle, symbol: "O", alias: CopyText.Circle, color: COLORS.circle },
  { id: 2, group: "face", key: "s", name: CopyText.Square, symbol: "□", alias: CopyText.Square, color: COLORS.square },
  { id: 3, group: "face", key: "t", name: CopyText.Triangle, symbol: "△", alias: CopyText.Triangle, color: COLORS.triangle }
];

export const CONTROLLER_BUTTONS: ControllerButton[] = [
  ...FACE_BUTTONS,
  { id: 4, group: "shoulder", key: "q", name: CopyText.L1, symbol: "L1", alias: CopyText.L1, color: COLORS.shoulderLeft },
  { id: 5, group: "shoulder", key: "e", name: CopyText.R1, symbol: "R1", alias: CopyText.R1, color: COLORS.shoulderRight },
  { id: 6, group: "trigger", key: "a", name: CopyText.L2, symbol: "L2", alias: CopyText.L2, color: COLORS.triggerLeft },
  { id: 7, group: "trigger", key: "d", name: CopyText.R2, symbol: "R2", alias: CopyText.R2, color: COLORS.triggerRight },
  { id: 12, group: "dpad", key: "arrowup", name: CopyText.DpadUp, symbol: "↑", alias: CopyText.DpadUp, color: COLORS.dpadUp },
  { id: 13, group: "dpad", key: "arrowdown", name: CopyText.DpadDown, symbol: "↓", alias: CopyText.DpadDown, color: COLORS.dpadDown },
  { id: 14, group: "dpad", key: "arrowleft", name: CopyText.DpadLeft, symbol: "←", alias: CopyText.DpadLeft, color: COLORS.dpadLeft },
  { id: 15, group: "dpad", key: "arrowright", name: CopyText.DpadRight, symbol: "→", alias: CopyText.DpadRight, color: COLORS.dpadRight }
];

export const GAME_MODES: GameMode[] = [
  {
    id: "classic",
    name: CopyText.ClassicMode,
    label: CopyText.ClassicModeLabel,
    description: CopyText.ClassicModeDescription,
    buttonGroups: ["face"]
  },
  {
    id: "full-pad",
    name: CopyText.FullPadMode,
    label: CopyText.FullPadModeLabel,
    description: CopyText.FullPadModeDescription,
    buttonGroups: ["face", "shoulder", "trigger", "dpad"]
  },
  {
    id: "dpad-drill",
    name: CopyText.DpadDrillMode,
    label: CopyText.DpadDrillModeLabel,
    description: CopyText.DpadDrillModeDescription,
    buttonGroups: ["dpad"]
  },
  {
    id: "shoulder-trigger",
    name: CopyText.ShoulderTriggerMode,
    label: CopyText.ShoulderTriggerModeLabel,
    description: CopyText.ShoulderTriggerModeDescription,
    buttonGroups: ["shoulder", "trigger"]
  }
];

export const ROUND_LIMIT = 2500;
export const HISTORY_LIMIT = 8;
