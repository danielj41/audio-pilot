import { Transformation } from './transformation'

/**
 * A StepsTransformation determines the pitch of individual notes and can be
 * used in parent nodes for key changes. `stepsPerStep` can be used to alter
 * the type of scale used.
 */
export class StepsTransformation extends Transformation<Steps> {
  protected identityValue = 0;
  
  constructor(private steps: Steps, private stepsPerStep: StepsPerStep) {
    super();
  }

  transform(childSteps: Steps) : Steps {
    return this.steps + childSteps / this.stepsPerStep;
  }
}

export type Steps = number;
export type StepsPerStep = number;
