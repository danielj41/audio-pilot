import { TimeTransformation, Velocity, Time } from './time-transformation'
import { StepsTransformation, Steps, StepsPerStep }
 from './steps-transformation'

/**
 * An object that contains all of the valid Transformations for one SongNode.
 */
export class SongTransformationCollection {
  /**
   * Convenience constructor that wraps the constructors for TimeTransformation
   * and StepsTransformation.
   */
  constructor(time: Time, velocity: Velocity = 1, steps: Steps = 0,
   stepsPerStep: StepsPerStep = 1) {
    this.time = new TimeTransformation(time, velocity);
    this.steps = new StepsTransformation(steps, stepsPerStep);
  }

  time: TimeTransformation;
  steps: StepsTransformation;
}
