import { SongTransformationCollection } from './song-transformation-collection'
import { Time, Duration } from './time-transformation'
import { AudioNodeChain } from '../audio-tree'

/**
 * Represents one node of a SongTree.
 */
export abstract class SongNode {
  children: SongNode[];

  constructor(public transformations: SongTransformationCollection,
   public duration: Duration = 0) {
    this.children = [];
    // Durations are only meaningful for leaf nodes. Parent nodes infer their
    // durations from their children.
  }

  /**
   * Returns the AudioNodes that should be used in the Web Audio API to play
   * this node of the song.
   */
  abstract getAudioNodeChain(context: AudioContext) : AudioNodeChain;

  /**
   * TODO: Make immutable methods so that we can "reuse" parts of a song
   * without breaking the original part.
   */
  addChild(songNode: SongNode) : void {
    this.children.push(songNode);
  }
}
