import { useMemo } from "react";
import {
  DEFAULT_CUSTOM_GROUPS,
  DEFAULT_PREFERENCES,
  GAME_MODES,
  LEGACY_THEME_STORAGE_KEY,
  PREFERENCES_STORAGE_KEY,
  THEME_STORAGE_KEY
} from "../constants";
import type { GameModeId, UserPreferences } from "../types";

function getSavedPreferences(): UserPreferences {
  try {
    const saved = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!saved) {
      const savedTheme =
        localStorage.getItem(THEME_STORAGE_KEY) ??
        localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
      return {
        ...DEFAULT_PREFERENCES,
        theme:
          savedTheme === "dark" || savedTheme === "light"
            ? savedTheme
            : window.matchMedia("(prefers-color-scheme: light)").matches
              ? "light"
              : "dark"
      };
    }
    const parsed = JSON.parse(saved) as Partial<UserPreferences>;
    const mode: GameModeId =
      parsed.mode && GAME_MODES.some((item) => item.id === parsed.mode)
        ? parsed.mode
        : DEFAULT_PREFERENCES.mode;
    const customGroups = parsed.customGroups?.filter((group) =>
      DEFAULT_CUSTOM_GROUPS.includes(group)
    );
    return {
      mode,
      rounds:
        typeof parsed.rounds === "number"
          ? Math.min(20, Math.max(5, parsed.rounds))
          : DEFAULT_PREFERENCES.rounds,
      sound:
        typeof parsed.sound === "boolean"
          ? parsed.sound
          : DEFAULT_PREFERENCES.sound,
      theme:
        parsed.theme === "dark" || parsed.theme === "light"
          ? parsed.theme
          : DEFAULT_PREFERENCES.theme,
      customGroups: customGroups?.length
        ? customGroups
        : DEFAULT_PREFERENCES.customGroups
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function useSavedPreferences(): UserPreferences {
  return useMemo(getSavedPreferences, []);
}
