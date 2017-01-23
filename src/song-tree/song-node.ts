import { SongTransformationCollection } from './song-transformation-collection'
import { Time, Duration } from './time-transformation'
import { AudioNodeChain } from '../audio-tree'

/**
 * Represents one node of a SongTree. This can be subclasses for specific types
 * of SongNodes, or used directly as a blank SongNode.
 */
export class SongNode {
  constructor(public transformations: SongTransformationCollection,
   public duration: Duration = 0, public children: SongNode[] = []) {
    // Durations are only meaningful for leaf nodes. Parent nodes infer their
    // durations from their children.
  }

  /**
   * Returns the AudioNodes that should be used in the Web Audio API to play
   * this node of the song.
   */
  getAudioNodeChain(context: AudioContext) : AudioNodeChain | null {
    return null;
  }

  /**
   * TODO: Make immutable methods so that we can "reuse" parts of a song
   * without breaking the original part.
   */
  addChild(songNode: SongNode) : void {
    this.children.push(songNode);
  }

  /**
   * A shallow-copy of SongNode.
   */
  clone() : SongNode {
    return new SongNode(this.transformations, this.duration, this.children);
  };
}
