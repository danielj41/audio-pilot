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

  private startTime: Time = 0;

  constructor() {
    if (typeof AudioContext !== 'undefined') {
      this.context = new AudioContext();
    }
  }

  /**
   * This resets the timer to 0 for restarting a song.
   */
  public restartTime() {
    // Store it as an offset from the audio context's time.
    this.startTime = this.context.currentTime;
  }

  /**
   * Get the current time in the song.
   */
  public getCurrentTime() {
    // Offset by the time that we started the song.
    return this.context.currentTime - this.startTime;
  }

  /**
   * Converts a time in a song to an absolute time that can be used with
   * the audio context.
   *
   * TODO: It's probably better to abstract this somehow, so that users don't
   *       need to write code like `oscillator.start(env.getTime(startTime))`.
   */
  public getTime(time: Time) {
    return time + this.startTime;
  }

  /**
   * Given the absolute start time for a node, this specifies whether or not
   * that node should get scheduled to play soon.
   */
  public shouldSchedule(start: Time) : boolean {
    return this.getCurrentTime() > start - this.scheduleAhead;
  }

  /**
   * Returns when an AudioNode should be disconnected, based on its scheduled
   * end time. This doesn't need to be completely accurate, since the sound
   * will stop at its scheduled `stop()` time, so add a buffer of
   * this.scheduleAhead.
   *
   * Not entirely necessary, but this cleans up AudioNodes we won't ever use
   * again.
   *
   * Returns a duration in ms to use in setTimeout.
   */
  public getDisconnectTimeoutDuration(end: Time) : number {
    return (end + this.scheduleAhead - this.getCurrentTime()) * 1000;
  }
}
