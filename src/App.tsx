import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Gamepad2,
  Moon,
  Play,
  RotateCcw,
  Sun,
  Trophy,
  Volume2,
  VolumeX,
  Wifi,
} from 'lucide-react';
import { ControllerScene } from './components/ControllerScene';
import {
  ConnectCard,
  GameHistory,
  GameToast,
  InstructionPanel,
  LiveStats,
  PromptCardOverlay,
  RoundProgressTracker,
  RoundTableModal,
} from './components/GameUI';
import { COLORS, FACE_BUTTONS, HISTORY_LIMIT, ROUND_LIMIT } from './constants';
import {
  CopyText,
  correctButton,
  emptyGrade,
  falseStart,
  gameComplete,
  missedButton,
  promptHit,
  timeout,
  wrongButton,
} from './copy';
import {
  getRandomPrompt,
  gradeReaction,
  ms,
  nextDelay,
  streakRemark,
} from './gameUtils';
import { useGamepad } from './hooks/useGamepad';
import { useReactionSounds } from './hooks/useReactionSounds';
import type {
  ConnectionState,
  FaceButton,
  GameStateSnapshot,
  GameStatus,
  GameSummary,
  PromptDisplay,
  PromptMode,
  ReactionGrade,
  RoundRecord,
  SoundCue,
  Theme,
} from './types';

const THEME_STORAGE_KEY = 'triggr-theme';
const LEGACY_THEME_STORAGE_KEY = 'triggerlab-theme';

function soundCueForGrade(grade: ReactionGrade): SoundCue {
  if (grade === CopyText.Fast) return 'fast';
  if (grade === CopyText.Good) return 'good';
  return 'slow';
}

export function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved =
      localStorage.getItem(THEME_STORAGE_KEY) ??
      localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  });
  const [connection, setConnection] = useState<ConnectionState>({
    connected: false,
    label: CopyText.PressAnyControllerButton,
  });
  const [status, setStatus] = useState<GameStatus>('welcome');
  const [roundsPerGame, setRoundsPerGame] = useState(10);
  const [prompt, setPrompt] = useState<PromptDisplay | null>(null);
  const [mode, setMode] = useState<PromptMode>('idle');
  const [message, setMessage] = useState('');
  const [celebration, setCelebration] = useState('');
  const [rounds, setRounds] = useState<RoundRecord[]>([]);
  const [games, setGames] = useState<GameSummary[]>([]);
  const [streak, setStreak] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showRounds, setShowRounds] = useState(false);
  const stateRef = useRef<GameStateSnapshot>({
    status,
    prompt,
    rounds,
    roundsPerGame,
    streak,
    hits,
    misses,
  });
  const waitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptStartedAt = useRef(0);
  const sounds = useReactionSounds();

  stateRef.current = {
    status,
    prompt,
    rounds,
    roundsPerGame,
    streak,
    hits,
    misses,
  };

  const stats = useMemo(() => {
    const times = rounds
      .filter((round) => round.correct)
      .map((round) => round.time)
      .filter((time): time is number => time !== null);
    const avg = times.length
      ? times.reduce((sum, value) => sum + value, 0) / times.length
      : null;
    return {
      avg,
      best: times.length ? Math.min(...times) : null,
      last: times[0] ?? null,
    };
  }, [rounds]);

  function clearTimers(): void {
    if (waitTimer.current) clearTimeout(waitTimer.current);
    if (reactionTimer.current) clearTimeout(reactionTimer.current);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }

  function schedulePrompt(): void {
    clearTimers();
    setStatus('waiting');
    setPrompt(null);
    setMode('idle');
    setMessage(CopyText.StandBy);
    setCelebration('');
    waitTimer.current = setTimeout(() => {
      const previous =
        stateRef.current.prompt?.id !== undefined
          ? (FACE_BUTTONS.find(
              (button) => button.id === stateRef.current.prompt?.id,
            ) ?? null)
          : null;
      const current = getRandomPrompt(previous);
      promptStartedAt.current = performance.now();
      setPrompt(current);
      setMode('live');
      setStatus('prompt');
      setMessage(promptHit(current));
      sounds.play('prompt');
      reactionTimer.current = setTimeout(
        () => recordTimeout(current),
        ROUND_LIMIT,
      );
    }, nextDelay());
  }

  function startGame(): void {
    if (sounds.enabled) sounds.unlock();
    clearTimers();
    setRounds([]);
    setHits(0);
    setMisses(0);
    setStreak(0);
    setCelebration('');
    setMessage(CopyText.RoundOneIncoming);
    schedulePrompt();
  }

  function resetGame(): void {
    clearTimers();
    setStatus('welcome');
    setPrompt(null);
    setMode('idle');
    setRounds([]);
    setHits(0);
    setMisses(0);
    setStreak(0);
    setCelebration('');
    setMessage('');
  }

  function appendRound(round: Omit<RoundRecord, 'number'>): RoundRecord[] {
    const nextRounds = [
      { number: stateRef.current.rounds.length + 1, ...round },
      ...stateRef.current.rounds,
    ];
    setRounds(nextRounds);
    return nextRounds;
  }

  function advance(
    nextRounds: RoundRecord[],
    nextHits: number,
    nextMisses: number,
    nextStreak: number,
  ): void {
    if (nextRounds.length >= stateRef.current.roundsPerGame) {
      finishGame(nextRounds, nextHits, nextMisses, nextStreak);
      return;
    }
    feedbackTimer.current = setTimeout(schedulePrompt, 640);
  }

  function finishGame(
    finalRounds: RoundRecord[],
    finalHits: number,
    finalMisses: number,
    finalStreak: number,
  ): void {
    clearTimers();
    setStatus('complete');
    setMode('complete');
    setPrompt({ name: CopyText.Complete, symbol: '✓', color: COLORS.success });
    sounds.play('complete');
    const times = finalRounds
      .filter((round) => round.correct)
      .map((round) => round.time)
      .filter((time): time is number => time !== null);
    const game: GameSummary = {
      id: crypto.randomUUID(),
      avg: times.length
        ? times.reduce((sum, value) => sum + value, 0) / times.length
        : null,
      best: times.length ? Math.min(...times) : null,
      misses: finalMisses,
      rounds: finalRounds.length,
      hits: finalHits,
      createdAt: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setGames((current) => [game, ...current].slice(0, HISTORY_LIMIT));
    setMessage(gameComplete(finalHits, finalMisses));
    setCelebration(
      finalStreak >= 3 ? streakRemark(finalStreak) : CopyText.RunComplete,
    );
  }

  function recordFalseStart(button: FaceButton): void {
    if (stateRef.current.status !== 'waiting') return;
    clearTimers();
    const nextMisses = stateRef.current.misses + 1;
    setMisses(nextMisses);
    setStreak(0);
    setMode('warning');
    setPrompt({ name: CopyText.TooSoon, symbol: '!', color: COLORS.warning });
    sounds.play('miss');
    setMessage(falseStart(button));
    setCelebration('');
    const nextRounds = appendRound({
      prompt: CopyText.FalseStartPrompt,
      result: missedButton(button),
      correct: false,
      time: null,
      grade: emptyGrade,
    });
    advance(nextRounds, stateRef.current.hits, nextMisses, 0);
  }

  function recordButton(button: FaceButton): void {
    const current = stateRef.current;
    if (current.status === 'waiting') {
      recordFalseStart(button);
      return;
    }
    if (current.status !== 'prompt' || current.prompt?.id === undefined) return;

    clearTimers();
    const elapsed = performance.now() - promptStartedAt.current;
    const correct = button.id === current.prompt.id;
    const nextHits = current.hits + (correct ? 1 : 0);
    const nextMisses = current.misses + (correct ? 0 : 1);
    const nextStreak = correct ? current.streak + 1 : 0;
    setHits(nextHits);
    setMisses(nextMisses);
    setStreak(nextStreak);
    setMode(correct ? 'hit' : 'miss');
    setMessage(
      correct
        ? correctButton(
            current.prompt.name,
            ms(elapsed),
            gradeReaction(elapsed),
          )
        : wrongButton(button, current.prompt.name),
    );
    setCelebration(correct ? streakRemark(nextStreak) : '');
    if (!correct) {
      sounds.play('miss');
    } else if (nextStreak >= 3) {
      sounds.play('streak');
    } else {
      sounds.play(soundCueForGrade(gradeReaction(elapsed)));
    }
    const nextRounds = appendRound({
      prompt: current.prompt.name,
      result: correct ? CopyText.Hit : missedButton(button),
      correct,
      time: correct ? elapsed : null,
      grade: correct ? gradeReaction(elapsed) : emptyGrade,
    });
    advance(nextRounds, nextHits, nextMisses, nextStreak);
  }

  function recordTimeout(expiredPrompt: FaceButton): void {
    const current = stateRef.current;
    if (current.status !== 'prompt') return;
    clearTimers();
    const nextMisses = current.misses + 1;
    setMisses(nextMisses);
    setStreak(0);
    setMode('timeout');
    sounds.play('miss');
    setMessage(timeout(expiredPrompt.name));
    setCelebration('');
    const nextRounds = appendRound({
      prompt: expiredPrompt.name,
      result: CopyText.Timeout,
      correct: false,
      time: null,
      grade: emptyGrade,
    });
    advance(nextRounds, current.hits, nextMisses, 0);
  }

  useGamepad(recordButton, setConnection);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.removeItem(LEGACY_THEME_STORAGE_KEY);
  }, [theme]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Enter' && status !== 'prompt' && status !== 'waiting')
        startGame();
      const button = FACE_BUTTONS.find(
        (item) => item.key === event.key.toLowerCase(),
      );
      if (button) recordButton(button);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <main className='app-shell'>
      <section className='hero-panel'>
        <div className='topbar'>
          <div className='brand-mark'>
            <Gamepad2 size={22} />
            <span>{CopyText.AppName}</span>
          </div>
          <div className='topbar-actions'>
            <button
              className='icon-button'
              type='button'
              onClick={sounds.toggle}
              title={
                sounds.enabled
                  ? CopyText.MuteReactionSounds
                  : CopyText.EnableReactionSounds
              }
              aria-label={
                sounds.enabled
                  ? CopyText.MuteReactionSounds
                  : CopyText.EnableReactionSounds
              }
            >
              {sounds.enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button
              className='icon-button'
              type='button'
              onClick={() =>
                setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
              }
              title={
                theme === 'dark' ? CopyText.UseLightMode : CopyText.UseDarkMode
              }
              aria-label={
                theme === 'dark' ? CopyText.UseLightMode : CopyText.UseDarkMode
              }
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className='icon-button'
              type='button'
              onClick={() => setShowRounds(true)}
              title={CopyText.ViewCurrentRun}
              aria-label={CopyText.ViewCurrentRun}
            >
              <Trophy size={18} />
            </button>
            <div
              className={`connection-pill ${connection.connected ? 'online' : ''}`}
            >
              <Wifi size={16} />
              <span>{connection.label}</span>
            </div>
          </div>
        </div>
        <div className='arena-layout'>
          <section className='play-zone'>
            <div className='canvas-wrap'>
              <ControllerScene prompt={prompt} mode={mode} />
              <PromptCardOverlay prompt={prompt} mode={mode} />
              <GameToast
                message={message}
                celebration={celebration}
                status={status}
              />
              <RoundProgressTracker
                roundsPlayed={rounds.length}
                roundsPerGame={roundsPerGame}
              />
            </div>
            <div className='command-deck'>
              {(status === 'welcome' || status === 'complete') && (
                <label className='round-control'>
                  <span>{CopyText.RoundsPerGame}</span>
                  <strong>{roundsPerGame}</strong>
                  <input
                    type='range'
                    min='5'
                    max='20'
                    value={roundsPerGame}
                    onChange={(event) =>
                      setRoundsPerGame(Number(event.target.value))
                    }
                  />
                </label>
              )}
              <button
                className='primary'
                onClick={startGame}
                disabled={status === 'waiting' || status === 'prompt'}
              >
                <Play size={18} />
                {status === 'complete'
                  ? CopyText.PlayAgain
                  : CopyText.StartGame}
              </button>
              <button className='secondary' onClick={resetGame}>
                <RotateCcw size={18} />
                {CopyText.Reset}
              </button>
              <button
                className='secondary icon-text'
                onClick={() => setShowInstructions(true)}
              >
                <BookOpen size={18} />
                {CopyText.Instructions}
              </button>
            </div>
          </section>
          <aside className='side-stack'>
            <ConnectCard connected={connection.connected} />
            <LiveStats
              stats={stats}
              hits={hits}
              misses={misses}
              streak={streak}
              round={`${Math.min(rounds.length, roundsPerGame)}/${roundsPerGame}`}
            />
            <GameHistory games={games} />
          </aside>
        </div>
      </section>
      {showInstructions && (
        <InstructionPanel onClose={() => setShowInstructions(false)} />
      )}
      {showRounds && (
        <RoundTableModal rounds={rounds} onClose={() => setShowRounds(false)} />
      )}
    </main>
  );
}
