import { FACE_BUTTONS } from "./constants";
import type { FaceButton, ReactionGrade } from "./types";

export function ms(value: number): string {
  return `${Math.round(value)} ms`;
}

export function gradeReaction(value: number | null): ReactionGrade {
  if (value === null) return "--";
  if (value < 220) return "Fast";
  if (value < 400) return "Good";
  return "Slow";
}

export function nextDelay(): number {
  return 800 + Math.random() * 1800;
}

export function streakRemark(streak: number): string {
  if (streak >= 8) return `${streak} streak. Reflex legend territory.`;
  if (streak >= 5) return `${streak} streak. You are reading the future.`;
  if (streak >= 3) return `${streak} streak. Stay locked.`;
  return "";
}

export function getRandomPrompt(previous: FaceButton | null): FaceButton {
  let next = FACE_BUTTONS[Math.floor(Math.random() * FACE_BUTTONS.length)];
  while (previous && next.id === previous.id) {
    next = FACE_BUTTONS[Math.floor(Math.random() * FACE_BUTTONS.length)];
  }
  return next;
}
