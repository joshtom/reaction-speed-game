import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, OrbitControls, PerspectiveCamera, useGLTF } from "@react-three/drei";
import { Box3, DoubleSide, MeshStandardMaterial, Vector3 } from "three";
import { createRootRoute, createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { BookOpen, Gamepad2, Info, Medal, Play, RotateCcw, Trophy, Wifi, X } from "lucide-react";
import { motionClassNames } from "./animationVocabulary";
import "./styles.css";

const FACE_BUTTONS = [
  { id: 0, key: "x", name: "Cross", symbol: "X", alias: "Cross", color: "#39a8ff", screen: [73, 45] },
  { id: 1, key: "o", name: "Circle", symbol: "O", alias: "Circle", color: "#ff646d", screen: [78, 38] },
  { id: 2, key: "s", name: "Square", symbol: "□", alias: "Square", color: "#ff5fac", screen: [68, 38] },
  { id: 3, key: "t", name: "Triangle", symbol: "△", alias: "Triangle", color: "#36d786", screen: [73, 31] }
];

const ROUND_LIMIT = 2500;
const HISTORY_LIMIT = 8;

function ms(value) {
  return `${Math.round(value)} ms`;
}

function gradeReaction(value) {
  if (value === null) return "--";
  if (value < 220) return "Fast";
  if (value < 400) return "Good";
  return "Slow";
}

function nextDelay() {
  return 800 + Math.random() * 1800;
}

function streakRemark(streak) {
  if (streak >= 8) return `${streak} streak. Reflex legend territory.`;
  if (streak >= 5) return `${streak} streak. You are reading the future.`;
  if (streak >= 3) return `${streak} streak. Stay locked.`;
  return "";
}

function getRandomPrompt(previous) {
  let next = FACE_BUTTONS[Math.floor(Math.random() * FACE_BUTTONS.length)];
  while (previous && next.id === previous.id) {
    next = FACE_BUTTONS[Math.floor(Math.random() * FACE_BUTTONS.length)];
  }
  return next;
}

function useGamepad(onFaceButton, onConnectState) {
  const previousButtons = useRef(new Set());
  const onFaceButtonRef = useRef(onFaceButton);
  const onConnectStateRef = useRef(onConnectState);

  useEffect(() => {
    onFaceButtonRef.current = onFaceButton;
    onConnectStateRef.current = onConnectState;
  }, [onConnectState, onFaceButton]);

  useEffect(() => {
    let frame = 0;
    let activeIndex = null;
    let lastConnectionSignature = "";

    function publishConnection(connected, label) {
      const signature = `${connected}:${label}`;
      if (signature === lastConnectionSignature) return;

      lastConnectionSignature = signature;
      onConnectStateRef.current({ connected, label });
    }

    function readGamepads() {
      if (!navigator.getGamepads) {
        publishConnection(false, "Gamepad API unavailable");
        return;
      }

      const pads = navigator.getGamepads ? Array.from(navigator.getGamepads()).filter(Boolean) : [];
      const current = activeIndex === null ? null : pads.find((pad) => pad.index === activeIndex);
      const pad = current || pads[0];

      if (pad) {
        if (activeIndex !== pad.index) previousButtons.current.clear();
        activeIndex = pad.index;
        publishConnection(true, pad.id || "Controller connected");
      } else {
        activeIndex = null;
        previousButtons.current.clear();
        publishConnection(false, "Press any controller button");
      }

      if (pad) {
        FACE_BUTTONS.forEach((button) => {
          const pressed = Boolean(pad.buttons[button.id] && pad.buttons[button.id].pressed);
          if (pressed && !previousButtons.current.has(button.id)) onFaceButtonRef.current(button);
          if (pressed) previousButtons.current.add(button.id);
          else previousButtons.current.delete(button.id);
        });
      }
    }

    function scan() {
      readGamepads();
      frame = requestAnimationFrame(scan);
    }

    function handleConnected(event) {
      activeIndex = event.gamepad.index;
      previousButtons.current.clear();
      publishConnection(true, event.gamepad.id || "Controller connected");
      readGamepads();
    }

    function handleDisconnected(event) {
      if (activeIndex === event.gamepad.index) activeIndex = null;
      previousButtons.current.clear();
      readGamepads();
    }

    window.addEventListener("gamepadconnected", handleConnected);
    window.addEventListener("gamepaddisconnected", handleDisconnected);
    window.addEventListener("focus", readGamepads);
    readGamepads();
    frame = requestAnimationFrame(scan);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("gamepadconnected", handleConnected);
      window.removeEventListener("gamepaddisconnected", handleDisconnected);
      window.removeEventListener("focus", readGamepads);
    };
  }, []);
}

function ControllerScene() {
  return (
    <Canvas className="scene-canvas" shadows dpr={[1, 1.7]}>
      <PerspectiveCamera makeDefault position={[0, 1.15, 5.4]} fov={34} />
      <ambientLight intensity={0.72} />
      <spotLight position={[2.8, 4.8, 4.8]} angle={0.48} penumbra={0.55} intensity={5.8} castShadow />
      <pointLight position={[-3, 1.4, 2.5]} intensity={2.1} color="#39a8ff" />
      <Suspense fallback={<Html center><Gamepad2 size={50} /></Html>}>
        <Environment preset="city" />
        <ControllerModel />
      </Suspense>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={0.82}
        maxPolarAngle={2.12}
        target={[0, 0.3, 0]}
      />
    </Canvas>
  );
}

function ControllerModel() {
  const { scene } = useGLTF("/models/dualshock.glb");
  const { model, modelPosition, modelScale } = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const usesMaterialArray = Array.isArray(child.material);
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        const solidMaterials = materials.map((material) => solidifyMaterial(material));
        child.material = usesMaterialArray ? solidMaterials : solidMaterials[0];
        child.frustumCulled = false;
      }
    });

    const bounds = new Box3().setFromObject(cloned);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const scale = 2.72 / Math.max(size.x, size.y, size.z);

    return {
      model: cloned,
      modelPosition: [-center.x * scale, -center.y * scale, -center.z * scale],
      modelScale: scale
    };
  }, [scene]);

  return (
    <group position={[0, 0.34, 0]} rotation={[-0.08, 0, 0]}>
      <group rotation={[0, Math.PI, 0]}>
        <primitive object={model} position={modelPosition} scale={modelScale} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/dualshock.glb");

function solidifyMaterial(material) {
  if (!material) {
    return new MeshStandardMaterial({ color: "#f2f4f8", roughness: 0.58, metalness: 0.12, side: DoubleSide });
  }

  const clone = material.clone();
  clone.transparent = false;
  clone.opacity = 1;
  clone.alphaTest = 0;
  clone.depthWrite = true;
  clone.depthTest = true;
  clone.side = DoubleSide;
  clone.toneMapped = true;

  if ("roughness" in clone) clone.roughness = Math.min(clone.roughness ?? 0.58, 0.74);
  if ("metalness" in clone) clone.metalness = Math.max(clone.metalness ?? 0.08, 0.1);
  if (clone.map) {
    clone.map.flipY = false;
    clone.map.needsUpdate = true;
  }
  if (clone.alphaMap) clone.alphaMap = null;
  clone.needsUpdate = true;
  return clone;
}

function App() {
  const [connection, setConnection] = useState({ connected: false, label: "Press any controller button" });
  const [status, setStatus] = useState("welcome");
  const [roundsPerGame, setRoundsPerGame] = useState(10);
  const [prompt, setPrompt] = useState(null);
  const [mode, setMode] = useState("idle");
  const [message, setMessage] = useState("");
  const [celebration, setCelebration] = useState("");
  const [rounds, setRounds] = useState([]);
  const [games, setGames] = useState([]);
  const [streak, setStreak] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showRounds, setShowRounds] = useState(false);
  const stateRef = useRef({});
  const waitTimer = useRef(0);
  const reactionTimer = useRef(0);
  const feedbackTimer = useRef(0);
  const promptStartedAt = useRef(0);

  stateRef.current = { status, prompt, rounds, roundsPerGame, streak, hits, misses };

  const stats = useMemo(() => {
    const times = rounds.filter((round) => round.correct).map((round) => round.time);
    const avg = times.length ? times.reduce((sum, value) => sum + value, 0) / times.length : null;
    const best = times.length ? Math.min(...times) : null;
    return { avg, best, last: times[0] || null };
  }, [rounds]);

  function clearTimers() {
    clearTimeout(waitTimer.current);
    clearTimeout(reactionTimer.current);
    clearTimeout(feedbackTimer.current);
  }

  function schedulePrompt() {
    clearTimers();
    setStatus("waiting");
    setPrompt(null);
    setMode("idle");
    setMessage("Stand by. The next button can light up any moment.");
    setCelebration("");
    waitTimer.current = setTimeout(() => {
      const current = getRandomPrompt(stateRef.current.prompt);
      promptStartedAt.current = performance.now();
      setPrompt(current);
      setMode("live");
      setStatus("prompt");
      setMessage(`Hit ${current.name}.`);
      reactionTimer.current = setTimeout(() => recordTimeout(current), ROUND_LIMIT);
    }, nextDelay());
  }

  function startGame() {
    clearTimers();
    setRounds([]);
    setHits(0);
    setMisses(0);
    setStreak(0);
    setCelebration("");
    setMessage("Round 1 incoming.");
    schedulePrompt();
  }

  function resetGame() {
    clearTimers();
    setStatus("welcome");
    setPrompt(null);
    setMode("idle");
    setRounds([]);
    setHits(0);
    setMisses(0);
    setStreak(0);
    setCelebration("");
    setMessage("");
  }

  function appendRound(round) {
    const current = stateRef.current;
    const nextRounds = [{ number: current.rounds.length + 1, ...round }, ...current.rounds];
    setRounds(nextRounds);
    return nextRounds;
  }

  function advance(nextRounds, nextHits, nextMisses, nextStreak) {
    if (nextRounds.length >= stateRef.current.roundsPerGame) {
      finishGame(nextRounds, nextHits, nextMisses, nextStreak);
      return;
    }
    feedbackTimer.current = setTimeout(schedulePrompt, 640);
  }

  function finishGame(finalRounds, finalHits, finalMisses, finalStreak) {
    clearTimers();
    setStatus("complete");
    setMode("complete");
    setPrompt({ name: "Complete", symbol: "✓", color: "#31d17b" });

    const times = finalRounds.filter((round) => round.correct).map((round) => round.time);
    const avg = times.length ? times.reduce((sum, value) => sum + value, 0) / times.length : null;
    const best = times.length ? Math.min(...times) : null;
    const game = {
      id: crypto.randomUUID(),
      avg,
      best,
      misses: finalMisses,
      rounds: finalRounds.length,
      hits: finalHits,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setGames((current) => [game, ...current].slice(0, HISTORY_LIMIT));
    setMessage(`Game complete: ${finalHits} hits, ${finalMisses} misses.`);
    setCelebration(finalStreak >= 3 ? streakRemark(finalStreak) : "Run complete. Tune the round count or play again.");
  }

  function recordFalseStart(button) {
    if (stateRef.current.status !== "waiting") return;
    clearTimers();
    const nextMisses = stateRef.current.misses + 1;
    setMisses(nextMisses);
    setStreak(0);
    setMode("warning");
    setPrompt({ name: "Too soon", symbol: "!", color: "#ffd166" });
    setMessage(`False start: ${button.name} before the prompt.`);
    setCelebration("");
    const nextRounds = appendRound({
      prompt: "Too soon",
      result: `Miss: ${button.name}`,
      correct: false,
      time: null,
      grade: "--"
    });
    advance(nextRounds, stateRef.current.hits, nextMisses, 0);
  }

  function recordButton(button) {
    const current = stateRef.current;
    if (current.status === "waiting") {
      recordFalseStart(button);
      return;
    }
    if (current.status !== "prompt" || !current.prompt) return;

    clearTimers();
    const elapsed = performance.now() - promptStartedAt.current;
    const correct = button.id === current.prompt.id;
    const nextHits = current.hits + (correct ? 1 : 0);
    const nextMisses = current.misses + (correct ? 0 : 1);
    const nextStreak = correct ? current.streak + 1 : 0;
    setHits(nextHits);
    setMisses(nextMisses);
    setStreak(nextStreak);
    setMode(correct ? "hit" : "miss");
    setMessage(correct ? `${current.prompt.name} hit in ${ms(elapsed)} (${gradeReaction(elapsed)}).` : `Wrong button: ${button.name} instead of ${current.prompt.name}.`);
    setCelebration(correct ? streakRemark(nextStreak) : "");

    const nextRounds = appendRound({
      prompt: current.prompt.name,
      result: correct ? "Hit" : `Miss: ${button.name}`,
      correct,
      time: correct ? elapsed : null,
      grade: correct ? gradeReaction(elapsed) : "--"
    });
    advance(nextRounds, nextHits, nextMisses, nextStreak);
  }

  function recordTimeout(expiredPrompt) {
    const current = stateRef.current;
    if (current.status !== "prompt") return;
    clearTimers();
    const nextMisses = current.misses + 1;
    setMisses(nextMisses);
    setStreak(0);
    setMode("timeout");
    setMessage(`Timeout: ${expiredPrompt.name} was missed.`);
    setCelebration("");
    const nextRounds = appendRound({
      prompt: expiredPrompt.name,
      result: "Timeout",
      correct: false,
      time: null,
      grade: "--"
    });
    advance(nextRounds, current.hits, nextMisses, 0);
  }

  useGamepad(recordButton, setConnection);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Enter" && status !== "prompt" && status !== "waiting") startGame();
      const button = FACE_BUTTONS.find((item) => item.key === event.key.toLowerCase());
      if (button) recordButton(button);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="topbar">
          <div className="brand-mark">
            <Gamepad2 size={22} />
            <span>TriggerLab</span>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" onClick={() => setShowRounds(true)} title="View current run" aria-label="View current run">
              <Trophy size={18} />
            </button>
            <div className={`connection-pill ${connection.connected ? "online" : ""}`}>
              <Wifi size={16} />
              <span>{connection.label}</span>
            </div>
          </div>
        </div>

        <div className="arena-layout">
          <section className="play-zone">
            <div className="canvas-wrap">
              <ControllerScene />
              <PromptCardOverlay prompt={prompt} mode={mode} />
              <ControllerButtonGlow prompt={prompt} mode={mode} />
              <GameToast message={message} celebration={celebration} status={status} />
              <RoundProgressTracker roundsPlayed={rounds.length} roundsPerGame={roundsPerGame} />
            </div>

            <div className="command-deck">
              {(status === "welcome" || status === "complete") && (
                <label className="round-control">
                  <span>Rounds per game</span>
                  <strong>{roundsPerGame}</strong>
                  <input type="range" min="5" max="20" value={roundsPerGame} onChange={(event) => setRoundsPerGame(Number(event.target.value))} />
                </label>
              )}
              <button className="primary" onClick={startGame} disabled={status === "waiting" || status === "prompt"}>
                <Play size={18} />
                {status === "complete" ? "Play again" : "Start game"}
              </button>
              <button className="secondary" onClick={resetGame}>
                <RotateCcw size={18} />
                Reset
              </button>
              <button className="secondary icon-text" onClick={() => setShowInstructions(true)}>
                <BookOpen size={18} />
                Instructions
              </button>
            </div>
          </section>

          <aside className="side-stack">
            <ConnectCard connected={connection.connected} />
            <LiveStats stats={stats} hits={hits} misses={misses} streak={streak} round={`${Math.min(rounds.length, roundsPerGame)}/${roundsPerGame}`} />
            <GameHistory games={games} />
          </aside>
        </div>
      </section>

      {showInstructions && <InstructionPanel onClose={() => setShowInstructions(false)} />}
      {showRounds && <RoundTableModal rounds={rounds} onClose={() => setShowRounds(false)} />}
    </main>
  );
}

function PromptCardOverlay({ prompt, mode }) {
  if (!prompt || mode === "idle") return null;
  return (
    <div className={`prompt-card-3d ${mode} ${motionClassNames.popIn}`} style={{ "--prompt-color": prompt.color }} key={`${prompt.name}-${mode}`}>
      <span className="prompt-symbol">{prompt.symbol}</span>
      <span className="prompt-label">{prompt.alias || prompt.name}</span>
    </div>
  );
}

function ControllerButtonGlow({ prompt, mode }) {
  if (!prompt || mode !== "live") return null;
  return (
    <div
      className="controller-button-glow"
      style={{
        "--button-color": prompt.color,
        "--button-x": `${prompt.screen[0]}%`,
        "--button-y": `${prompt.screen[1]}%`
      }}
      aria-hidden="true"
    >
      <span>{prompt.symbol}</span>
    </div>
  );
}

function GameToast({ message, celebration, status }) {
  if (status === "welcome" || (!message && !celebration)) return null;
  return (
    <div className={`game-toast ${motionClassNames.popIn}`} key={`${message}-${celebration}`}>
      {message && <span>{message}</span>}
      {celebration && <strong>{celebration}</strong>}
    </div>
  );
}

function RoundProgressTracker({ roundsPlayed, roundsPerGame }) {
  const completed = Math.min(roundsPlayed, roundsPerGame);
  return (
    <div className="round-progress-tracker" aria-label={`Round progress ${completed} of ${roundsPerGame}`}>
      <div className="round-progress-meta">
        <span>Round progress</span>
        <strong>{completed}/{roundsPerGame}</strong>
      </div>
      <div className="round-segments" style={{ "--round-count": roundsPerGame }}>
        {Array.from({ length: roundsPerGame }).map((_, index) => (
          <span className={index < completed ? "complete" : ""} key={index} />
        ))}
      </div>
    </div>
  );
}

function ConnectCard({ connected }) {
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

function LiveStats({ stats, hits, misses, streak, round }) {
  const items = [
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
      {items.map(([label, value], index) => (
        <div className={`stat-tile ${motionClassNames.numberTicker}`} style={{ "--stagger-index": index }} key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}

function RoundTable({ rounds }) {
  return (
    <section className={`table-card ${motionClassNames.reveal}`}>
      <div className="section-title">
        <Trophy size={17} />
        <span>Current run</span>
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Prompt</th>
            <th>Result</th>
            <th>Time</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {!rounds.length && (
            <tr>
              <td colSpan="5" className="empty-cell">No rounds yet.</td>
            </tr>
          )}
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

function RoundTableModal({ rounds, onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Current run">
      <section className={`rounds-modal ${motionClassNames.popIn}`}>
        <div className="modal-heading">
          <div className="section-title">
            <Trophy size={18} />
            <span>Current run</span>
          </div>
          <button className="icon-button" type="button" onClick={onClose} title="Close current run" aria-label="Close current run">
            <X size={18} />
          </button>
        </div>
        <div className="rounds-modal-scroll">
          <RoundTable rounds={rounds} />
        </div>
      </section>
    </div>
  );
}

function GameHistory({ games }) {
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
          <tr>
            <th>Rank</th>
            <th>Avg</th>
            <th>Best</th>
            <th>Miss</th>
            <th>Rounds</th>
          </tr>
        </thead>
        <tbody>
          {!games.length && (
            <tr>
              <td colSpan="5" className="empty-cell">Finish a game to rank it.</td>
            </tr>
          )}
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

function InstructionPanel({ onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Instructions">
      <section className={`instruction-panel ${motionClassNames.popIn}`}>
        <div className="section-title">
          <BookOpen size={18} />
          <span>How to play</span>
        </div>
        <div className="instruction-grid">
          <div>
            <strong>1. Connect</strong>
            <p>Use USB or Bluetooth. Browser Gamepad API activates after one controller button press.</p>
          </div>
          <div>
            <strong>2. React</strong>
            <p>A random face button appears after 0.8-2.6s. Press the matching Cross, Circle, Square, or Triangle button.</p>
          </div>
          <div>
            <strong>3. Score</strong>
            <p>Under 220ms is Fast, under 400ms is Good, and slower hits are Slow. Wrong buttons and 2.5s timeouts count as misses.</p>
          </div>
          <div>
            <strong>Keyboard fallback</strong>
            <p>Use X for Cross, O for Circle, S for Square, and T for Triangle while testing without a controller.</p>
          </div>
        </div>
        <button className="primary" onClick={onClose}>Back to arena</button>
      </section>
    </div>
  );
}

const rootRoute = createRootRoute({ component: App });
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: App });
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute]) });
const rootElement = document.getElementById("root");
const reactRoot = rootElement.__triggerLabRoot || createRoot(rootElement);
rootElement.__triggerLabRoot = reactRoot;

reactRoot.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
