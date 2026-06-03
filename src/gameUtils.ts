import { FACE_BUTTONS } from "./constants";
import { CopyText, emptyGrade, streakRemarkText } from "./copy";
import type { FaceButton, ReactionGrade } from "./types";

export function ms(value: number): string {
  return `${Math.round(value)} ms`;
}

export function gradeReaction(value: number | null): ReactionGrade {
  if (value === null) return emptyGrade;
  if (value < 220) return CopyText.Fast;
  if (value < 400) return CopyText.Good;
  return CopyText.Slow;
}

export function nextDelay(): number {
  return 800 + Math.random() * 1800;
}

export function streakRemark(streak: number): string {
  return streakRemarkText(streak);
}

export function getRandomPrompt(previous: FaceButton | null): FaceButton {
  let next = FACE_BUTTONS[Math.floor(Math.random() * FACE_BUTTONS.length)];
  while (previous && next.id === previous.id) {
    next = FACE_BUTTONS[Math.floor(Math.random() * FACE_BUTTONS.length)];
  }
  return next;
}
