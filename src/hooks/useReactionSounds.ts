import { useCallback, useEffect, useRef, useState } from "react";
import type { SoundCue } from "../types";

type Tone = {
  frequency: number;
  duration: number;
  delay?: number;
  type?: OscillatorType;
  volume?: number;
};

const CUE_TONES: Record<SoundCue, Tone[]> = {
  prompt: [
    { frequency: 523.25, duration: 0.07, type: "sine", volume: 0.08 },
    { frequency: 783.99, duration: 0.1, delay: 0.055, type: "sine", volume: 0.07 }
  ],
  fast: [
    { frequency: 659.25, duration: 0.08, type: "triangle", volume: 0.1 },
    { frequency: 987.77, duration: 0.12, delay: 0.06, type: "triangle", volume: 0.09 }
  ],
  good: [
    { frequency: 523.25, duration: 0.08, type: "triangle", volume: 0.09 },
    { frequency: 783.99, duration: 0.11, delay: 0.065, type: "triangle", volume: 0.08 }
  ],
  slow: [
    { frequency: 392, duration: 0.1, type: "triangle", volume: 0.075 },
    { frequency: 523.25, duration: 0.12, delay: 0.08, type: "triangle", volume: 0.07 }
  ],
  miss: [
    { frequency: 220, duration: 0.12, type: "sawtooth", volume: 0.065 },
    { frequency: 164.81, duration: 0.16, delay: 0.09, type: "sawtooth", volume: 0.055 }
  ],
  streak: [
    { frequency: 659.25, duration: 0.08, type: "triangle", volume: 0.08 },
    { frequency: 783.99, duration: 0.08, delay: 0.065, type: "triangle", volume: 0.08 },
    { frequency: 1046.5, duration: 0.14, delay: 0.13, type: "triangle", volume: 0.08 }
  ],
  complete: [
    { frequency: 523.25, duration: 0.1, type: "triangle", volume: 0.08 },
    { frequency: 659.25, duration: 0.1, delay: 0.085, type: "triangle", volume: 0.08 },
    { frequency: 783.99, duration: 0.1, delay: 0.17, type: "triangle", volume: 0.08 },
    { frequency: 1046.5, duration: 0.22, delay: 0.255, type: "triangle", volume: 0.08 }
  ]
};

export function useReactionSounds() {
  const [enabled, setEnabled] = useState(true);
  const audioContext = useRef<AudioContext | null>(null);

  const unlock = useCallback((): AudioContext => {
    if (!audioContext.current) audioContext.current = new AudioContext();
    if (audioContext.current.state === "suspended") void audioContext.current.resume();
    return audioContext.current;
  }, []);

  const play = useCallback((cue: SoundCue): void => {
    if (!enabled) return;
    const context = unlock();

    CUE_TONES[cue].forEach((tone) => {
      const start = context.currentTime + (tone.delay ?? 0);
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = tone.type ?? "sine";
      oscillator.frequency.setValueAtTime(tone.frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(tone.volume ?? 0.08, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + tone.duration + 0.02);
    });
  }, [enabled, unlock]);

  const toggle = useCallback((): void => {
    setEnabled((current) => {
      if (!current) unlock();
      return !current;
    });
  }, [unlock]);

  useEffect(() => {
    return () => {
      if (audioContext.current) void audioContext.current.close();
    };
  }, []);

  return { enabled, play, toggle, unlock };
}
