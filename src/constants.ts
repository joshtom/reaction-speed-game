import type { FaceButton } from "./types";
import { CopyText } from "./copy";

export const COLORS = {
  cross: "#39a8ff",
  circle: "#ff646d",
  square: "#ff5fac",
  triangle: "#36d786",
  success: "#31d17b",
  warning: "#ffd166",
  white: "#ffffff",
  modelFallback: "#f2f4f8"
} as const;

export const FACE_BUTTONS: FaceButton[] = [
  { id: 0, key: "x", name: CopyText.Cross, symbol: "X", alias: CopyText.Cross, color: COLORS.cross, modelPosition: [0.88, 0.08, 0.42] },
  { id: 1, key: "o", name: CopyText.Circle, symbol: "O", alias: CopyText.Circle, color: COLORS.circle, modelPosition: [1.04, 0.24, 0.42] },
  { id: 2, key: "s", name: CopyText.Square, symbol: "□", alias: CopyText.Square, color: COLORS.square, modelPosition: [0.72, 0.24, 0.42] },
  { id: 3, key: "t", name: CopyText.Triangle, symbol: "△", alias: CopyText.Triangle, color: COLORS.triangle, modelPosition: [0.88, 0.4, 0.42] }
];

export const ROUND_LIMIT = 2500;
export const HISTORY_LIMIT = 8;
