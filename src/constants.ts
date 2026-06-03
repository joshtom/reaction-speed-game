import type { FaceButton } from "./types";

export const FACE_BUTTONS: FaceButton[] = [
  { id: 0, key: "x", name: "Cross", symbol: "X", alias: "Cross", color: "#39a8ff", modelPosition: [0.88, 0.08, 0.42] },
  { id: 1, key: "o", name: "Circle", symbol: "O", alias: "Circle", color: "#ff646d", modelPosition: [1.04, 0.24, 0.42] },
  { id: 2, key: "s", name: "Square", symbol: "□", alias: "Square", color: "#ff5fac", modelPosition: [0.72, 0.24, 0.42] },
  { id: 3, key: "t", name: "Triangle", symbol: "△", alias: "Triangle", color: "#36d786", modelPosition: [0.88, 0.4, 0.42] }
];

export const ROUND_LIMIT = 2500;
export const HISTORY_LIMIT = 8;
