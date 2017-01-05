import { Steps, Time } from '../song-tree'
import { Frequency, stepsToFrequency } from './frequency'

/**
 * Wrapper around the WebAudio API
 */
export class Audio {
  private context: AudioContext;

  /**
   * Set the base song frequency (A4, 440hz) and number of steps between
   * two of the same note. These are arbitrary, but they can be transformed by a
   * SongNode, so it doesn't matter too much.
   */
  private baseFrequency: Frequency = 440;
  private baseStepsInOctave: Steps = 12;

  /**
   * We schedule notes to play slightly before they actually need to play.
   * 0.2 means that "each time the PlayTree is traversed, any notes that will
   * start playing in the next 0.2 seconds will get attached the the AudioNode
   * graph."
   */
  private scheduleAhead: number = 0.2;

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

  /**
   * Creates the AudioNodes necessary for a SongNode and schedules them to play
   * at `start` time.
   *
   * TODO: Generalize this method.
   */
  scheduleNote(start: Time, stop: Time, steps: Steps) : void {
    let frequency = stepsToFrequency(this.baseFrequency,
     steps / this.baseStepsInOctave);

    let oscillator = this.context.createOscillator();
    let gain = this.context.createGain();

    oscillator.connect(gain);
    oscillator.frequency.value = frequency;
    oscillator.start(start);
    oscillator.stop(stop);

    gain.gain.value = 0.5;
    gain.connect(this.context.destination);

    console.log(start, stop, frequency);

    oscillator.addEventListener('ended', () => {
      oscillator.disconnect();
      console.log('disconnected');
    });
  }
}
