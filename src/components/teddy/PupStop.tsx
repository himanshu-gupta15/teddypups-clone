import { PupBuddy } from './PupBuddy';
import type { PoseName } from './rig';

type Props = {
  className: string;
  pose?: PoseName;
  facing?: 'left' | 'right';
  act?: 'basket' | 'peekaboo' | 'tilt' | 'treadmill';
  /** Teddy is tucked behind something here (the quilt, the basket). */
  behind?: boolean;
  /** Keep this stop on phones, where most are hidden. */
  lane?: boolean;
  label?: string;
};

/**
 * A spot on the page where the travelling Teddy rests. It renders a still Teddy, so the
 * page is complete without JavaScript; PupJourney hides the still and walks between stops.
 */
export function PupStop({ className, pose = 'sit', facing = 'right', act, behind, lane, label }: Props) {
  return (
    <div
      data-pup-stop
      data-pose={pose}
      data-facing={facing}
      data-act={act}
      data-behind={behind || undefined}
      data-lane={lane || undefined}
      className={`pup-stop ${className}`}
    >
      <PupBuddy pose={pose} facing={facing} label={label} live={false} />
    </div>
  );
}
