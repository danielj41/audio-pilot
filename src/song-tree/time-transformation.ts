import { Transformation } from './transformation'

/**
 * A SongNode's TimeTransformation determines when and how fast its child nodes
 * play.
 */
export class TimeTransformation extends Transformation<Time> {
  protected identityValue = 0;

  constructor(private offset: Time, private velocity: Velocity) {
     super();
  }

  transform(childTime: Time): Time {
    return timeAfter(this.offset, durationAtVelocity(childTime, this.velocity));
  }
}

/**
 * Simple type definitions and functions so that it's easier to understand
 * where these values come from and how they're caculated.
 */
export type Time = number;
export type Duration = number;
export type Velocity = number;

export function timeAfter(t: Time, d: Duration): Time {
  return t + d;
}

function durationAtVelocity(d: Duration, vel: Velocity): Duration {
  return d / vel;
}
