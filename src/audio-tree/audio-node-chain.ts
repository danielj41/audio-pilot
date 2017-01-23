import { Steps, Time } from '../song-tree'
import { Frequency, stepsToFrequency } from './frequency'
import { AudioEnv } from './audio-env'

/**
 * Wrapper around AudioNodes with functions to connect, disconnect, start and
 * stop at specified times. Allows combining multiple AudioNodes.
 */
export class AudioNodeChain {
  private head: AudioNode;
  private tail: AudioNode | AudioParam;
  private oscillators: OscillatorNode[];

  /**
   * head: The "output" of this chain of AudioNodes. For example, this could
   *       be connected to your AudioContext's destination.
   * tail: The "input" of this chain for any chains that get attached to this
   *       one.
   * oscillators: An array of OscillatorNodes that need to be scheduled to
   *              start() and stop() at specific times.
   */
  constructor(head: AudioNode, tail: AudioNode | AudioParam | null = null,
   oscillators: OscillatorNode[] = []) {
    this.head = head;
    this.tail = tail ? tail : head;
    this.oscillators = oscillators;
  }

  /**
   * Schedules this AudioNodeChain to play from `start` to `end` at frequency
   * `steps` in the context specified by `env`.
   *
   * `destination` can be an AudioNode, AudioParam, another AudioNodeChain, or
   * null, which implicitly means the AudioContext's destination.
   */
  schedule(env: AudioEnv, start: Time, end: Time, steps: Steps,
   destination: AudioNode | AudioParam | AudioNodeChain | null) : void {
    if (destination === null) {
      // A null destination means that these are the root AudioNodes. Connect
      // them directly to the AudioContext's destination.
      destination = env.context.destination;
    } else if (destination instanceof AudioNodeChain) {
      // If they pass in another AudioNodeChain, connect to its tail.
      destination = destination.tail;
    }

    // Ideally just `this.head.connect(destination)`.
    // Not sure why typescript doesn't like that.
    // The connect function should accept AudioNode | AudioParam according to
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioNode
    if (destination instanceof AudioNode) {
      this.head.connect(destination);
    } else if (destination instanceof AudioParam) {
      this.head.connect(<any>destination);
    }

    // Disconnect this node at the end time. It's ok if this is a little
    // inaccurate, because the scheduled `start` and `stop` are what actually
    // play the sounds.
    setTimeout(() => {
      this.head.disconnect();
      console.log("disconnected node");
    }, env.getDisconnectTimeoutDuration(end));

    // For any oscillators, set their frequency and schedule them to start and
    // stop.
    let frequency = stepsToFrequency(env.baseFrequency,
     steps / env.baseStepsInOctave);

    for (let i in this.oscillators) {
      let osc = this.oscillators[i];

      osc.frequency.value = frequency;
      osc.start(start);
      osc.stop(end);
    }

    console.log("time: " + start + "-" + end + " @ " + frequency + " Hz");
  }
}
