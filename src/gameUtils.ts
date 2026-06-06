import { CONTROLLER_BUTTONS } from "./constants";
import { CopyText, emptyGrade, streakRemarkText } from "./copy";
import type { ControllerButton, GameMode, ReactionGrade } from "./types";

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

export function getButtonsForMode(mode: GameMode): ControllerButton[] {
  return CONTROLLER_BUTTONS.filter((button) => mode.buttonGroups.includes(button.group));
}

export function getRandomPrompt(previous: ControllerButton | null, buttons: ControllerButton[]): ControllerButton {
  let next = buttons[Math.floor(Math.random() * buttons.length)];
  while (previous && next.id === previous.id) {
    next = buttons[Math.floor(Math.random() * buttons.length)];
  }
  return next;
}
