import { useMemo, type CSSProperties } from "react";
import { BookOpen, Gamepad2, Info, Medal, Trophy, X } from "lucide-react";
import { motionClassNames } from "../animationVocabulary";
import { CopyText, emptyValue } from "../copy";
import { CONTROLLER_BUTTONS, GAME_MODES } from "../constants";
import { ms } from "../gameUtils";
import type { ConnectionState, GameModeId, GameStatus, GameSummary, LiveStatsValue, PromptDisplay, PromptMode, RoundRecord } from "../types";

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
    <div className="round-progress-tracker" aria-label={`${CopyText.Round} progress ${completed} of ${roundsPerGame}`}>
      <div className="round-progress-meta">
        <span>{CopyText.Round} progress</span>
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

export function GameModeSelector({ selectedMode, onSelect }: { selectedMode: GameModeId; onSelect: (mode: GameModeId) => void }) {
  return (
    <div className="mode-selector" aria-label={CopyText.GameMode}>
      <span>{CopyText.GameMode}</span>
      <div className="mode-options">
        {GAME_MODES.map((mode) => (
          <button className={mode.id === selectedMode ? "active" : ""} type="button" onClick={() => onSelect(mode.id)} key={mode.id}>
            <strong>{mode.name}</strong>
            <em>{mode.label}</em>
          </button>
        ))}
      </div>
    </div>
  );
}

export function LiveStats({ stats, hits, misses, streak, round }: { stats: LiveStatsValue; hits: number; misses: number; streak: number; round: string }) {
  const items: Array<[string, string | number]> = [
    [CopyText.Last, stats.last ? ms(stats.last) : emptyValue],
    [CopyText.Average, stats.avg ? ms(stats.avg) : emptyValue],
    [CopyText.Best, stats.best ? ms(stats.best) : emptyValue],
    [CopyText.Streak, streak],
    [CopyText.Hits, hits],
    [CopyText.Misses, misses],
    [CopyText.Round, round]
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
        <span>{CopyText.LastGames}</span>
      </div>
      <table>
        <thead>
          <tr><th>{CopyText.Rank}</th><th>{CopyText.Avg}</th><th>{CopyText.Best}</th><th>{CopyText.Miss}</th><th>{CopyText.Rounds}</th></tr>
        </thead>
        <tbody>
          {!games.length && <tr><td colSpan={5} className="empty-cell">{CopyText.FinishGameToRank}</td></tr>}
          {games.map((game) => {
            const rank = ranked.indexOf(game.id);
            return (
              <tr key={game.id}>
                <td>{rank >= 0 ? <span className={`medal-dot ${medalClass[rank]}`}>{rank + 1}</span> : emptyValue}</td>
                <td>{game.avg === null ? emptyValue : ms(game.avg)}</td>
                <td>{game.best === null ? emptyValue : ms(game.best)}</td>
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
      <div className="section-title"><Trophy size={17} /><span>{CopyText.CurrentRun}</span></div>
      <table>
        <thead>
          <tr><th>#</th><th>{CopyText.Prompt}</th><th>{CopyText.Result}</th><th>{CopyText.Time}</th><th>{CopyText.Grade}</th></tr>
        </thead>
        <tbody>
          {!rounds.length && <tr><td colSpan={5} className="empty-cell">{CopyText.NoRoundsYet}</td></tr>}
          {rounds.map((round) => (
            <tr key={round.number}>
              <td>{round.number}</td>
              <td>{round.prompt}</td>
              <td className={round.correct ? "good" : "bad"}>{round.result}</td>
              <td>{round.time === null ? emptyValue : ms(round.time)}</td>
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
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={CopyText.CurrentRun}>
      <section className={`rounds-modal ${motionClassNames.popIn}`}>
        <div className="modal-heading">
          <div className="section-title"><Trophy size={18} /><span>{CopyText.CurrentRun}</span></div>
          <button className="icon-button" type="button" onClick={onClose} title={CopyText.CloseCurrentRun} aria-label={CopyText.CloseCurrentRun}><X size={18} /></button>
        </div>
        <div className="rounds-modal-scroll"><RoundTable rounds={rounds} /></div>
      </section>
    </div>
  );
}

export function InstructionPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={CopyText.Instructions}>
      <section className={`instruction-panel ${motionClassNames.popIn}`}>
        <div className="modal-heading">
          <div className="section-title"><BookOpen size={18} /><span>{CopyText.HowToPlay}</span></div>
          <button className="icon-button" type="button" onClick={onClose} title={CopyText.CloseInstructions} aria-label={CopyText.CloseInstructions}><X size={18} /></button>
        </div>
        <div className="instruction-panel-scroll">
          <div className="instruction-grid">
            <div><strong>{CopyText.InstructionConnectTitle}</strong><p>{CopyText.InstructionConnectBody}</p></div>
            <div><strong>{CopyText.InstructionReactTitle}</strong><p>{CopyText.InstructionReactBody}</p></div>
            <div><strong>{CopyText.InstructionScoreTitle}</strong><p>{CopyText.InstructionScoreBody}</p></div>
            <div><strong>{CopyText.InstructionKeyboardTitle}</strong><p>{CopyText.InstructionKeyboardBody}</p></div>
          </div>
        </div>
        <button className="primary" onClick={onClose}>{CopyText.BackToArena}</button>
      </section>
    </div>
  );
}

export function ControllerSetupModal({ connection, onClose }: { connection: ConnectionState; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={CopyText.ControllerSetup}>
      <section className={`controller-setup-modal ${motionClassNames.popIn}`}>
        <div className="modal-heading">
          <div className="section-title"><Gamepad2 size={18} /><span>{CopyText.ControllerSetup}</span></div>
          <button className="icon-button" type="button" onClick={onClose} title={CopyText.CloseControllerSetup} aria-label={CopyText.CloseControllerSetup}><X size={18} /></button>
        </div>
        <div className="controller-setup-scroll">
          <div className={`controller-status-card ${connection.connected ? "online" : ""}`}>
            <span>{connection.connected ? CopyText.DetectedController : CopyText.ActivationRequired}</span>
            <strong>{connection.connected ? connection.label : CopyText.ControllerNotActive}</strong>
            <p>{connection.connected ? CopyText.ControllerDetected : CopyText.ControllerConnectHelp}</p>
          </div>
          <div className="setup-note-card">
            <div className="section-title"><Info size={17} /><span>{CopyText.ControllerStatus}</span></div>
            <p>{CopyText.BrowserGamepadNote}</p>
          </div>
          <div className="button-map-card">
            <div className="section-title"><Gamepad2 size={17} /><span>{CopyText.SupportedButtons}</span></div>
            <div className="button-map-grid">
              {CONTROLLER_BUTTONS.map((button) => (
                <div className="button-map-item" key={button.id}>
                  <span style={{ "--button-color": button.color } as CustomStyle}>{button.symbol}</span>
                  <strong>{button.name}</strong>
                  <em>{button.key.toUpperCase()}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className="primary" onClick={onClose}>{CopyText.BackToArena}</button>
      </section>
    </div>
  );
}
