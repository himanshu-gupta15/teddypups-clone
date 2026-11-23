/** Lets any scene ask the travelling Teddy to look at something or say something. */
export type PupCue = { look?: Element; say?: string; seconds?: number };

export const cuePup = (cue: PupCue) => dispatchEvent(new CustomEvent<PupCue>('tp:pup', { detail: cue }));

export const BARKS = ['woof!', 'hi friend!', 'boop!', 'again!'];
