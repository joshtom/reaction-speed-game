import { CopyText } from '../copy';
import { BUTTON_GROUPS, GAME_MODES } from '../constants';
import type { ControllerButtonGroup, GameModeId } from '../types';
import type { CustomStyle } from './componentUtils';

export function GameModeSelector({
  selectedMode,
  onSelect,
  selectedGroups,
  onToggleGroup,
  disabled,
}: {
  selectedMode: GameModeId;
  onSelect: (mode: GameModeId) => void;
  selectedGroups: ControllerButtonGroup[];
  onToggleGroup: (group: ControllerButtonGroup) => void;
  disabled: boolean;
}) {
  const isCustom = selectedMode === 'custom';

  return (
    <div className='mode-selector' aria-label={CopyText.GameMode}>
      <div className='mode-options'>
        {GAME_MODES.map((mode) => (
          <button
            className={mode.id === selectedMode ? 'active' : ''}
            type='button'
            disabled={disabled}
            onClick={() => onSelect(mode.id)}
            key={mode.id}
          >
            <strong>{mode.name}</strong>
            <em>{mode.label}</em>
          </button>
        ))}
      </div>
      {isCustom && (
        <div className='custom-mix-options' aria-label={CopyText.CustomMix}>
          {BUTTON_GROUPS.map((group) => {
            const checked = selectedGroups.includes(group.id);
            const style: CustomStyle = { '--group-color': group.color };
            return (
              <button
                className={checked ? 'active' : ''}
                type='button'
                disabled={disabled || (checked && selectedGroups.length === 1)}
                onClick={() => onToggleGroup(group.id)}
                style={style}
                key={group.id}
              >
                <span />
                {group.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
