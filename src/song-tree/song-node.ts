import { SongTransformationCollection } from './song-transformation-collection'
import { Time, Duration } from './time-transformation'

/**
 * Represents one node of a SongTree.
 */
export class SongNode {
  children: SongNode[];
  duration: Duration;

  constructor(public transformations: SongTransformationCollection) {
    this.children = [];
  }

  /**
   * TODO: Make immutable methods so that we can "reuse" parts of a song
   * without breaking the original part.
   */
  addChild(songNode: SongNode) : void {
    this.children.push(songNode);
  }
}
