import { Steps, Time } from '../song-tree'
import { Frequency, stepsToFrequency } from './frequency'
import { AudioEnv } from './audio-env'

export class AudioNodeChain {
  private head: AudioNode;
  private tail: AudioNode;
  private oscillators: OscillatorNode[];

  constructor(head: AudioNode, tail: AudioNode | null = null, oscillators:
   OscillatorNode[] = []) {
    this.head = head;
    this.tail = tail ? tail : head;
    this.oscillators = oscillators;
  }

  schedule(env: AudioEnv, start: Time, end: Time, steps: Steps, destination: AudioNode) {
    this.head.connect(destination);

    setTimeout(this.head.disconnect.bind(this.head),
     (end - this.head.context.currentTime) * 1000);

     for (let i in this.oscillators) {
       let osc = this.oscillators[i];

       osc.frequency.value = stepsToFrequency(env.baseFrequency,
        steps / env.baseStepsInOctave);
       osc.start(start);
       osc.stop(end);
     }
  }
}
