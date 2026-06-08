import { motionClassNames } from '../animationVocabulary';
import type { PromptDisplay, PromptMode } from '../types';
import type { CustomStyle } from './componentUtils';

export function PromptCardOverlay({
  prompt,
  mode,
}: {
  prompt: PromptDisplay | null;
  mode: PromptMode;
}) {
  if (!prompt || mode === 'idle') return null;
  const style: CustomStyle = { '--prompt-color': prompt.color };

  return (
    <div
      className={`prompt-card-3d ${prompt.group} ${mode} ${motionClassNames.popIn}`}
      style={style}
      key={`${prompt.name}-${mode}`}
    >
      <span className='prompt-symbol'>{prompt.symbol}</span>
      <span className='prompt-label'>{prompt.alias ?? prompt.name}</span>
    </div>
  );
}
