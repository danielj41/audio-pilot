import { SongNode } from './song-node'
import { AudioNodeChain } from '../audio-tree'

export class NoteSongNode extends SongNode {
  clone() {
    return new NoteSongNode(this.transformations, this.duration, this.children);
  }

  getAudioNodeChain(context: AudioContext) {
    let osc = context.createOscillator();
    let gain = context.createGain();

    osc.connect(gain);
    gain.gain.value = 1.0;

    return new AudioNodeChain(gain, gain, [osc]);
  }
}
