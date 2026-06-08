import { Activity, Gamepad2, Info, X } from 'lucide-react';
import { motionClassNames } from '../../animationVocabulary';
import { CONTROLLER_BUTTONS } from '../../constants';
import { CopyText } from '../../copy';
import { getGroupLabel } from '../../gameUtils';
import type { ConnectionState, DetectedButton } from '../../types';
import { keyboardLabel, type CustomStyle } from '../componentUtils';

export function ControllerSetupModal({
  connection,
  detectedButtons,
  onClose,
}: {
  connection: ConnectionState;
  detectedButtons: DetectedButton[];
  onClose: () => void;
}) {
  const lastDetected = detectedButtons[0] ?? null;

  return (
    <div
      className='modal-backdrop'
      role='dialog'
      aria-modal='true'
      aria-label={CopyText.ControllerSetup}
    >
      <section className={`controller-setup-modal ${motionClassNames.popIn}`}>
        <div className='modal-heading'>
          <div className='section-title'>
            <Gamepad2 size={18} />
            <span>{CopyText.ControllerSetup}</span>
          </div>
          <button
            className='icon-button'
            type='button'
            onClick={onClose}
            title={CopyText.CloseControllerSetup}
            aria-label={CopyText.CloseControllerSetup}
          >
            <X size={18} />
          </button>
        </div>
        <div className='controller-setup-scroll'>
          <div
            className={`controller-status-card ${connection.connected ? 'online' : ''}`}
          >
            <span>
              {connection.connected
                ? CopyText.DetectedController
                : CopyText.ActivationRequired}
            </span>
            <strong>
              {connection.connected
                ? connection.label
                : CopyText.ControllerNotActive}
            </strong>
            <p>
              {connection.connected
                ? CopyText.ControllerDetected
                : CopyText.ControllerConnectHelp}
            </p>
          </div>
          <div className='setup-note-card'>
            <div className='section-title'>
              <Info size={17} />
              <span>{CopyText.ControllerStatus}</span>
            </div>
            <p>{CopyText.BrowserGamepadNote}</p>
          </div>
          <div className='button-test-card'>
            <div className='section-title'>
              <Activity size={17} />
              <span>{CopyText.ButtonTest}</span>
            </div>
            <div className={`detected-button ${lastDetected ? 'active' : ''}`}>
              <span>
                {lastDetected ? lastDetected.symbol : <Gamepad2 size={24} />}
              </span>
              <div>
                <strong>
                  {lastDetected ? lastDetected.name : CopyText.NoButtonDetected}
                </strong>
                <em>
                  {lastDetected
                    ? `${getGroupLabel(lastDetected.group)} · ${CopyText.BrowserIndex} ${lastDetected.index}`
                    : CopyText.MappingUnknown}
                </em>
              </div>
            </div>
            {!!detectedButtons.length && (
              <div className='detected-history'>
                {detectedButtons.map((button) => (
                  <span key={`${button.id}-${button.detectedAt}`}>
                    {button.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className='button-map-card'>
            <div className='section-title'>
              <Gamepad2 size={17} />
              <span>{CopyText.SupportedButtons}</span>
            </div>
            <div className='button-map-grid'>
              {CONTROLLER_BUTTONS.map((button) => (
                <div className='button-map-item' key={button.id}>
                  <span
                    style={{ '--button-color': button.color } as CustomStyle}
                  >
                    {button.symbol}
                  </span>
                  <strong>{button.name}</strong>
                  <em>{keyboardLabel(button.key)}</em>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button className='primary' onClick={onClose}>
          {CopyText.BackToArena}
        </button>
      </section>
    </div>
  );
}
