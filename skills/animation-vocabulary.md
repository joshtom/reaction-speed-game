# Animation Vocabulary

Use these terms when describing UI motion in Triggr. The app maps the most-used patterns to CSS classes in `src/animationVocabulary.ts` and `src/styles.css`.

## Entrances And Exits

- Fade in / fade out: opacity-based entrance or exit.
- Scale in: element grows from smaller to full size while appearing.
- Pop in: scale-in with a small overshoot and settle.
- Reveal: content is uncovered with a clip or mask.
- Enter / exit: motion when an element is added or removed.

## Sequencing And Timing

- Keyframes: defined animation moments such as 0%, 50%, and 100%.
- Tween: generated in-between frames.
- Stagger: repeated items animate one after another.
- Orchestration: multiple animations timed to feel like one event.
- Delay, duration, fill mode: controls for when motion starts, how long it lasts, and whether it keeps end-state styles.

## Movement And Transforms

- Translate, scale, rotate, skew: transform-based motion.
- 3D tilt / flip: rotate in 3D space for depth.
- Perspective: strength of the 3D effect.
- Transform origin: the anchor point of scale or rotation.
- Origin-aware animation: motion grows out of the trigger that caused it.

## State Transitions

- Crossfade: one element fades out while another fades in.
- Continuity transition: the user can visually track what changed.
- Morph: one shape smoothly turns into another.
- Shared element transition: an element travels between views.
- Layout animation: size or position changes animate instead of snapping.
- Accordion / collapse: height expands or closes smoothly.
- Direction-aware transition: forward and back navigation move in opposite directions.

## Feedback And Interaction

- Hover effect: visual response on pointer hover.
- Press / tap feedback: subtle scale-down on click.
- Hold to confirm: progress fills while holding.
- Shake / wiggle: quick error or rejected-input motion.
- Ripple: expanding circle from a tap point.
- Rubber-banding: resistance and snap-back past boundaries.

## Easing And Spring Motion

- Ease-out: fast start, slow finish; best for direct user feedback.
- Ease-in-out: balanced start and finish for objects already on screen.
- Cubic-bezier: custom easing curve.
- Spring: physics-based motion with tension, damping, and mass.
- Bounce, momentum, velocity: physical motion cues for playful or interruptible UI.

## Ambient Motion And Polish

- Pulse: repeating scale or opacity change for attention.
- Float: gentle up/down idle motion.
- Orbit: continuous circular motion.
- Skeleton / shimmer: loading placeholder sheen.
- Number ticker: fixed-width digits that update without layout shift.
- Text morph: animated character-level text changes.

## Performance Principles

- Animate transform and opacity where possible.
- Use `will-change` sparingly before high-frequency animations.
- Avoid layout thrashing from animating width, height, top, or left.
- Respect `prefers-reduced-motion`.
- Motion should orient, respond, or clarify. Frequent animations should be short and subtle.
