import { SongNode } from './song-node'
import { AudioNodeChain } from '../audio-tree'

export class NoteSongNode extends SongNode {
  getAudioNodeChain(context: AudioContext) {
    let osc = context.createOscillator();
    let gain = context.createGain();

    osc.connect(gain);
    gain.gain.value = 0.5;

    return new AudioNodeChain(gain, gain, [osc]);
  }
}
