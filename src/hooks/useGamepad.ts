import { useEffect, useRef } from "react";
import { CONTROLLER_BUTTONS } from "../constants";
import { CopyText } from "../copy";
import type { ConnectionState, ControllerButton, ControllerButtonId } from "../types";

type ControllerButtonHandler = (button: ControllerButton) => void;
type ConnectionHandler = (state: ConnectionState) => void;

const TRANSIENT_DISCONNECT_GRACE_MS = 1800;

export function useGamepad(onControllerButton: ControllerButtonHandler, onConnectState: ConnectionHandler): void {
  const previousButtons = useRef<Set<ControllerButtonId>>(new Set());
  const onControllerButtonRef = useRef<ControllerButtonHandler>(onControllerButton);
  const onConnectStateRef = useRef<ConnectionHandler>(onConnectState);

  useEffect(() => {
    onControllerButtonRef.current = onControllerButton;
    onConnectStateRef.current = onConnectState;
  }, [onConnectState, onControllerButton]);

  useEffect(() => {
    let frame = 0;
    let activeIndex: number | null = null;
    let lastConnectionSignature = "";
    let lastSeenAt = 0;
    let lastConnectedLabel: string = CopyText.ControllerConnected;

    function publishConnection(connected: boolean, label: string): void {
      const signature = `${connected}:${label}`;
      if (signature === lastConnectionSignature) return;

      lastConnectionSignature = signature;
      onConnectStateRef.current({ connected, label });
    }

    function readGamepads(): void {
      if (!navigator.getGamepads) {
        publishConnection(false, CopyText.GamepadApiUnavailable);
        return;
      }

      const pads = Array.from(navigator.getGamepads()).filter((pad): pad is Gamepad => Boolean(pad));
      const current = activeIndex === null ? null : pads.find((pad) => pad.index === activeIndex);
      const pad = current ?? pads[0];

      if (pad) {
        if (activeIndex !== pad.index) previousButtons.current.clear();
        activeIndex = pad.index;
        lastSeenAt = performance.now();
        lastConnectedLabel = pad.id || CopyText.ControllerConnected;
        publishConnection(true, lastConnectedLabel);
      } else {
        const isLikelyTransient = activeIndex !== null && performance.now() - lastSeenAt < TRANSIENT_DISCONNECT_GRACE_MS;
        if (isLikelyTransient) {
          publishConnection(true, lastConnectedLabel);
          return;
        }

        activeIndex = null;
        previousButtons.current.clear();
        publishConnection(false, CopyText.PressAnyControllerButton);
      }

      if (!pad) return;

      CONTROLLER_BUTTONS.forEach((button) => {
        const pressed = Boolean(pad.buttons[button.id]?.pressed);
        if (pressed && !previousButtons.current.has(button.id)) onControllerButtonRef.current(button);
        if (pressed) previousButtons.current.add(button.id);
        else previousButtons.current.delete(button.id);
      });
    }

    function scan(): void {
      readGamepads();
      frame = requestAnimationFrame(scan);
    }

    function handleConnected(event: GamepadEvent): void {
      activeIndex = event.gamepad.index;
      lastSeenAt = performance.now();
      lastConnectedLabel = event.gamepad.id || CopyText.ControllerConnected;
      previousButtons.current.clear();
      publishConnection(true, lastConnectedLabel);
      readGamepads();
    }

    function handleDisconnected(event: GamepadEvent): void {
      if (activeIndex === event.gamepad.index) activeIndex = null;
      lastSeenAt = 0;
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
