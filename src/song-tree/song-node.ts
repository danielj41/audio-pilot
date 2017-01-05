import { SongTransformationCollection } from './song-transformation-collection'
import { Time, Duration } from './time-transformation'

/**
 * Represents one node of a SongTree.
 */
export class SongNode {
  children: SongNode[];

  constructor(public transformations: SongTransformationCollection,
   public duration: Duration = 0) {
    this.children = [];
  }

  /**
   * TODO: Make immutable methods so that we can "reuse" parts of a song
   * without breaking the original part.
   */
  addChild(songNode: SongNode) : void {
    this.children.push(songNode);

    // Make the parent duration reflect the length of all its children.
    // TODO: Figure out if this makes sense here, since it's just a "view"
    // of its children's data.
    let endTime = songNode.transformations.time.transform(songNode.duration);

    if (endTime > this.duration) {
      this.duration = endTime;
    }
  }
}
