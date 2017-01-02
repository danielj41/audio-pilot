import { Steps, Time } from '../song-tree'
import { Frequency, stepsToFrequency } from './frequency'

export class Audio {
  public context: AudioContext;
  public baseFrequency: Frequency = 440;
  public baseStepsInOctave: Steps = 12;
  public scheduleAhead: number = 0.2;

  constructor() {
    this.context = new AudioContext();
  }

  shouldSchedule(start: Time) : boolean {
    return this.context.currentTime > start - this.scheduleAhead &&
     this.context.currentTime < start;
  }

  scheduleNote(start: Time, stop: Time, steps: Steps) {
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
