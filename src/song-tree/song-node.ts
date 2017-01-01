import { SongTransformationCollection } from './song-transformation-collection'
import { Duration } from './time-transformation'

/**
 * Represents one node of a SongTree.
 */
export class SongNode {
  children: SongNode[];
  duration: Duration;

  // TODO: playing a song shouldn't break its data structure representation,
  // so store this boolean somewhere else.
  played: boolean = false;

  constructor(public transformations: SongTransformationCollection) {
    this.children = [];
  }

  /**
   * TODO: Make immutable methods so that we can "reuse" parts of a song
   * without breaking the original part.
   */
  addChild(songNode: SongNode) {
    this.children.push(songNode);
  }
}
