import { useMemo, type CSSProperties } from "react";
import { BookOpen, Info, Medal, Trophy, X } from "lucide-react";
import { motionClassNames } from "../animationVocabulary";
import { ms } from "../gameUtils";
import type { GameStatus, GameSummary, LiveStatsValue, PromptDisplay, PromptMode, RoundRecord } from "../types";

type CustomStyle = CSSProperties & Record<`--${string}`, string | number>;

export function PromptCardOverlay({ prompt, mode }: { prompt: PromptDisplay | null; mode: PromptMode }) {
  if (!prompt || mode === "idle") return null;
  const style: CustomStyle = { "--prompt-color": prompt.color };

  return (
    <div className={`prompt-card-3d ${mode} ${motionClassNames.popIn}`} style={style} key={`${prompt.name}-${mode}`}>
      <span className="prompt-symbol">{prompt.symbol}</span>
      <span className="prompt-label">{prompt.alias ?? prompt.name}</span>
    </div>
  );
}

export function GameToast({ message, celebration, status }: { message: string; celebration: string; status: GameStatus }) {
  if (status === "welcome" || (!message && !celebration)) return null;

  return (
    <div className={`game-toast ${motionClassNames.popIn}`} key={`${message}-${celebration}`}>
      {message && <span>{message}</span>}
      {celebration && <strong>{celebration}</strong>}
    </div>
  );
}

export function RoundProgressTracker({ roundsPlayed, roundsPerGame }: { roundsPlayed: number; roundsPerGame: number }) {
  const completed = Math.min(roundsPlayed, roundsPerGame);
  const style: CustomStyle = { "--round-count": roundsPerGame };

  return (
    <div className="round-progress-tracker" aria-label={`Round progress ${completed} of ${roundsPerGame}`}>
      <div className="round-progress-meta">
        <span>Round progress</span>
        <strong>{completed}/{roundsPerGame}</strong>
      </div>
      <div className="round-segments" style={style}>
        {Array.from({ length: roundsPerGame }).map((_, index) => (
          <span className={index < completed ? "complete" : ""} key={index} />
        ))}
      </div>
    </div>
  );
}

export function ConnectCard({ connected }: { connected: boolean }) {
  return (
    <section className={`connect-card ${motionClassNames.scaleIn}`}>
      <div className="section-title">
        <Info size={17} />
        <span>Controller setup</span>
      </div>
      <p>{connected ? "Controller detected. Match Cross, Circle, Square, and Triangle when they light up." : "Connect by USB or Bluetooth, focus this page, then press any controller button once. Browsers only expose gamepads after input."}</p>
    </section>
  );
}

export function LiveStats({ stats, hits, misses, streak, round }: { stats: LiveStatsValue; hits: number; misses: number; streak: number; round: string }) {
  const items: Array<[string, string | number]> = [
    ["Last", stats.last ? ms(stats.last) : "--"],
    ["Average", stats.avg ? ms(stats.avg) : "--"],
    ["Best", stats.best ? ms(stats.best) : "--"],
    ["Streak", streak],
    ["Hits", hits],
    ["Misses", misses],
    ["Round", round]
  ];

  return (
    <section className={`stats-grid ${motionClassNames.stagger}`}>
      {items.map(([label, value], index) => {
        const style: CustomStyle = { "--stagger-index": index };
        return (
          <div className={`stat-tile ${motionClassNames.numberTicker}`} style={style} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        );
      })}
    </section>
  );
}

export function GameHistory({ games }: { games: GameSummary[] }) {
  const ranked = useMemo(() => {
    return [...games]
      .sort((a, b) => {
        if (a.avg === null && b.avg === null) return a.misses - b.misses;
        if (a.avg === null) return 1;
        if (b.avg === null) return -1;
        return a.avg - b.avg || a.misses - b.misses;
      })
      .slice(0, 3)
      .map((game) => game.id);
  }, [games]);

  const medalClass = ["gold", "silver", "bronze"];

  return (
    <section className={`table-card ${motionClassNames.reveal}`}>
      <div className="section-title">
        <Medal size={17} />
        <span>Last 8 games</span>
      </div>
      <table>
        <thead>
          <tr><th>Rank</th><th>Avg</th><th>Best</th><th>Miss</th><th>Rounds</th></tr>
        </thead>
        <tbody>
          {!games.length && <tr><td colSpan={5} className="empty-cell">Finish a game to rank it.</td></tr>}
          {games.map((game) => {
            const rank = ranked.indexOf(game.id);
            return (
              <tr key={game.id}>
                <td>{rank >= 0 ? <span className={`medal-dot ${medalClass[rank]}`}>{rank + 1}</span> : "--"}</td>
                <td>{game.avg === null ? "--" : ms(game.avg)}</td>
                <td>{game.best === null ? "--" : ms(game.best)}</td>
                <td>{game.misses}</td>
                <td>{game.rounds}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function RoundTable({ rounds }: { rounds: RoundRecord[] }) {
  return (
    <section className={`table-card ${motionClassNames.reveal}`}>
      <div className="section-title"><Trophy size={17} /><span>Current run</span></div>
      <table>
        <thead>
          <tr><th>#</th><th>Prompt</th><th>Result</th><th>Time</th><th>Grade</th></tr>
        </thead>
        <tbody>
          {!rounds.length && <tr><td colSpan={5} className="empty-cell">No rounds yet.</td></tr>}
          {rounds.map((round) => (
            <tr key={round.number}>
              <td>{round.number}</td>
              <td>{round.prompt}</td>
              <td className={round.correct ? "good" : "bad"}>{round.result}</td>
              <td>{round.time === null ? "--" : ms(round.time)}</td>
              <td className={`grade ${round.grade.toLowerCase()}`}>{round.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export function RoundTableModal({ rounds, onClose }: { rounds: RoundRecord[]; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Current run">
      <section className={`rounds-modal ${motionClassNames.popIn}`}>
        <div className="modal-heading">
          <div className="section-title"><Trophy size={18} /><span>Current run</span></div>
          <button className="icon-button" type="button" onClick={onClose} title="Close current run" aria-label="Close current run"><X size={18} /></button>
        </div>
        <div className="rounds-modal-scroll"><RoundTable rounds={rounds} /></div>
      </section>
    </div>
  );
}

export function InstructionPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Instructions">
      <section className={`instruction-panel ${motionClassNames.popIn}`}>
        <div className="section-title"><BookOpen size={18} /><span>How to play</span></div>
        <div className="instruction-grid">
          <div><strong>1. Connect</strong><p>Use USB or Bluetooth. Browser Gamepad API activates after one controller button press.</p></div>
          <div><strong>2. React</strong><p>A random face button appears after 0.8-2.6s. Press the matching Cross, Circle, Square, or Triangle button.</p></div>
          <div><strong>3. Score</strong><p>Under 220ms is Fast, under 400ms is Good, and slower hits are Slow. Wrong buttons and 2.5s timeouts count as misses.</p></div>
          <div><strong>Keyboard fallback</strong><p>Use X for Cross, O for Circle, S for Square, and T for Triangle while testing without a controller.</p></div>
        </div>
        <button className="primary" onClick={onClose}>Back to arena</button>
      </section>
    </div>
  );
}
