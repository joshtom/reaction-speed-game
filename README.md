# Triggr Reaction Arena

Triggr is a controller-first reaction speed game built with TanStack React, React Three Fiber, and the browser Gamepad API. A random face-button prompt appears after a variable delay, the player hits the matching controller button, and the app tracks reaction speed, misses, streaks, and recent game summaries.

## Features

- 3D controller scene using `public/models/dualshock.glb`
- Standard Gamepad API support for Cross, Circle, Square, and Triangle style face buttons
- Keyboard fallback for local testing: `X`, `O`, `S`, and `T`
- Random 0.8-2.6s prompt delay to prevent anticipation
- 2.5s reaction timeout, wrong-button misses, and false-start misses
- Reaction grades: Fast under 220ms, Good under 400ms, Slow above 400ms
- Last 8 game summaries with top-3 medal ranking
- Streak celebration copy and sound cues
- Dark/light theme toggle with persisted preference
- Responsive layout for desktop and mobile viewports
- Centralized UI copy in `src/copy.ts`
- Reusable design tokens in `src/styles.css` and 3D color constants in `src/constants.ts`

## Tech Stack

- Vite
- React 18
- TypeScript
- TanStack Router
- React Three Fiber
- Drei
- Three.js
- Lucide React

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173/
```

Build for production:

```bash
npm run build
```

Run strict TypeScript checks:

```bash
npm run typecheck
```

## How To Play

1. Connect a controller by USB or Bluetooth.
2. Focus the browser tab and press any controller button once so the browser exposes the gamepad.
3. Choose 5-20 rounds.
4. Start the game.
5. When a prompt appears, press the matching face button before the 2.5s timeout.

The app maps standard browser gamepad buttons as:

| Browser button index | Prompt   |
| -------------------- | -------- |
| `0`                  | Cross    |
| `1`                  | Circle   |
| `2`                  | Square   |
| `3`                  | Triangle |

## Project Structure

```text
src/
  App.tsx                         Game state and main arena composition
  copy.ts                         User-facing copy enum and message builders
  constants.ts                    Button metadata, colors, and game limits
  gameUtils.ts                    Timing, grading, prompt, and streak helpers
  hooks/
    useGamepad.ts                 Gamepad polling and connection state
    useReactionSounds.ts          Web Audio reaction cues
  components/
    ControllerScene.tsx           3D controller, float, and button highlight
    GameUI.tsx                    HUD, stats, tables, and modal panels
  styles.css                      Theme tokens, layout, and animation polish
  animationVocabulary.ts          Shared animation class names
skills/
  animation-vocabulary.md         Motion glossary used by the UI
public/models/
  dualshock.glb                   Active controller model
```

## Browser Notes

Browsers only expose gamepads after a user gesture. If a controller is already connected but Triggr says to press a button, click or focus the page and press any controller button once.

Different controllers can label buttons differently at the OS level, but most modern controllers follow the standard face-button index mapping used here. The current 3D highlight positions are calibrated against the bundled `dualshock.glb` model.

## Development Notes

- Keep visible copy in `src/copy.ts`; avoid hardcoding UI strings in components.
- Keep colors in CSS variables or the typed `COLORS` object.
- Use `npm run typecheck` and `npm run build` before handing off changes.

## Contribution

- Feel free to send a PR
