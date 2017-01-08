import { Steps, Time } from '../song-tree'
import { Frequency, stepsToFrequency } from './frequency'

/**
 * Wrapper around the WebAudio API
 */
export class AudioEnv {
  public context: AudioContext;

  /**
   * Set the base song frequency (A4, 440hz) and number of steps between
   * two of the same note. These are arbitrary, but they can be transformed by a
   * SongNode, so it doesn't matter too much.
   */
  public readonly baseFrequency: Frequency = 440;
  public readonly baseStepsInOctave: Steps = 12;

  /**
   * We schedule notes to play slightly before they actually need to play.
   * 0.2 means that "each time the PlayTree is traversed, any notes that will
   * start playing in the next 0.2 seconds will get attached the the AudioNode
   * graph."
   */
  public readonly scheduleAhead: number = 0.2;

  constructor() {
    if (typeof AudioContext !== 'undefined') {
      this.context = new AudioContext();
    }
  }

  /**
   * Given the absolute start time for a node, this specifies whether or not
   * that node should get scheduled to play soon.
   */
  public shouldSchedule(start: Time) : boolean {
    return this.context.currentTime > start - this.scheduleAhead;
  }
}
