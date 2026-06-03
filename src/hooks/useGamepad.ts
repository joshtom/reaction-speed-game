import { useEffect, useRef } from "react";
import { FACE_BUTTONS } from "../constants";
import type { ConnectionState, FaceButton, FaceButtonId } from "../types";

type FaceButtonHandler = (button: FaceButton) => void;
type ConnectionHandler = (state: ConnectionState) => void;

export function useGamepad(onFaceButton: FaceButtonHandler, onConnectState: ConnectionHandler): void {
  const previousButtons = useRef<Set<FaceButtonId>>(new Set());
  const onFaceButtonRef = useRef<FaceButtonHandler>(onFaceButton);
  const onConnectStateRef = useRef<ConnectionHandler>(onConnectState);

  useEffect(() => {
    onFaceButtonRef.current = onFaceButton;
    onConnectStateRef.current = onConnectState;
  }, [onConnectState, onFaceButton]);

  useEffect(() => {
    let frame = 0;
    let activeIndex: number | null = null;
    let lastConnectionSignature = "";

    function publishConnection(connected: boolean, label: string): void {
      const signature = `${connected}:${label}`;
      if (signature === lastConnectionSignature) return;

      lastConnectionSignature = signature;
      onConnectStateRef.current({ connected, label });
    }

    function readGamepads(): void {
      if (!navigator.getGamepads) {
        publishConnection(false, "Gamepad API unavailable");
        return;
      }

      const pads = Array.from(navigator.getGamepads()).filter((pad): pad is Gamepad => Boolean(pad));
      const current = activeIndex === null ? null : pads.find((pad) => pad.index === activeIndex);
      const pad = current ?? pads[0];

      if (pad) {
        if (activeIndex !== pad.index) previousButtons.current.clear();
        activeIndex = pad.index;
        publishConnection(true, pad.id || "Controller connected");
      } else {
        activeIndex = null;
        previousButtons.current.clear();
        publishConnection(false, "Press any controller button");
      }

      if (!pad) return;

      FACE_BUTTONS.forEach((button) => {
        const pressed = Boolean(pad.buttons[button.id]?.pressed);
        if (pressed && !previousButtons.current.has(button.id)) onFaceButtonRef.current(button);
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
      previousButtons.current.clear();
      publishConnection(true, event.gamepad.id || "Controller connected");
      readGamepads();
    }

    function handleDisconnected(event: GamepadEvent): void {
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
