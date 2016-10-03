import { SongTransformationCollection } from './song-transformation-collection'

/**
 * Represents one node of a SongTree.
 */
export class SongNode {
  children: SongNode[];

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
