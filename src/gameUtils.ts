import { BUTTON_GROUPS, CONTROLLER_BUTTONS } from "./constants";
import { CopyText, emptyGrade, streakRemarkText } from "./copy";
import type { ControllerButton, ControllerButtonGroup, GameMode, GroupPerformance, ReactionGrade, RoundRecord, SoundCue } from "./types";

export function ms(value: number): string {
  return `${Math.round(value)} ms`;
}

export function gradeReaction(value: number | null): ReactionGrade {
  if (value === null) return emptyGrade;
  if (value < 220) return CopyText.Fast;
  if (value < 400) return CopyText.Good;
  return CopyText.Slow;
}

export function soundCueForGrade(grade: ReactionGrade): SoundCue {
  if (grade === CopyText.Fast) return "fast";
  if (grade === CopyText.Good) return "good";
  return "slow";
}

export function nextDelay(): number {
  return 800 + Math.random() * 1800;
}

export function streakRemark(streak: number): string {
  return streakRemarkText(streak);
}

export function getGroupLabel(group: ControllerButtonGroup): string {
  return BUTTON_GROUPS.find((item) => item.id === group)?.label ?? group;
}

export function getButtonsForGroups(groups: ControllerButtonGroup[]): ControllerButton[] {
  return CONTROLLER_BUTTONS.filter((button) => groups.includes(button.group));
}

export function getButtonsForMode(mode: GameMode): ControllerButton[] {
  return getButtonsForGroups(mode.buttonGroups);
}

export function getRandomPrompt(previous: ControllerButton | null, buttons: ControllerButton[]): ControllerButton {
  let next = buttons[Math.floor(Math.random() * buttons.length)];
  while (previous && next.id === previous.id) {
    next = buttons[Math.floor(Math.random() * buttons.length)];
  }
  return next;
}

export function getGroupPerformance(rounds: RoundRecord[]): GroupPerformance[] {
  return BUTTON_GROUPS.map((group) => {
    const groupRounds = rounds.filter((round) => round.group === group.id);
    const hitTimes = groupRounds
      .filter((round) => round.correct)
      .map((round) => round.time)
      .filter((time): time is number => time !== null);
    return {
      group: group.id,
      label: group.label,
      rounds: groupRounds.length,
      hits: hitTimes.length,
      misses: groupRounds.length - hitTimes.length,
      avg: hitTimes.length
        ? hitTimes.reduce((sum, value) => sum + value, 0) / hitTimes.length
        : null,
      best: hitTimes.length ? Math.min(...hitTimes) : null,
    };
  });
}

export function getBestAndWeakestGroups(performance: GroupPerformance[]): { best: GroupPerformance | null; weakest: GroupPerformance | null } {
  const played = performance.filter((group) => group.rounds > 0);
  const withHits = played.filter((group) => group.avg !== null);
  const best = withHits.length
    ? [...withHits].sort((a, b) => (a.avg ?? Infinity) - (b.avg ?? Infinity) || a.misses - b.misses)[0]
    : null;
  const weakest = played.length
    ? [...played].sort((a, b) => b.misses - a.misses || (b.avg ?? 0) - (a.avg ?? 0))[0]
    : null;
  return { best, weakest };
}
