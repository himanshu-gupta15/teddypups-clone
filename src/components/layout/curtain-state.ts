/** Milliseconds into the first-load curtain animation at which the page becomes visible. */
export const INTRO_LIFT = 560;

export function introElapsed() {
  const rest = document
    .querySelector('.tp-curtain')
    ?.getAnimations()
    .find((a) => (a as CSSAnimation).animationName === 'tp-curtain-rest');
  return rest && rest.playState !== 'finished' && typeof rest.currentTime === 'number' ? rest.currentTime : Infinity;
}

/** True while the page-transition curtain hides the page. */
export function curtainIsDown() {
  const state = document.querySelector<HTMLElement>('.tp-curtain')?.dataset.state;
  if (state === 'intro') return introElapsed() < INTRO_LIFT;
  return state === 'covering' || state === 'covered' || state === 'snap';
}
