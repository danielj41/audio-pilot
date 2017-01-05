import { SongTree, SongNode, SongTransformationCollection } from '../song-tree'
import { SongTransformationStack } from './song-transformation-stack'
import { Audio } from './audio'

/**
 * A wrapper around a SongNode that has methods for actually playing notes.
 */
export class PlayNode {
  children: PlayNode[];

  /**
   * Construct a PlayNode for a SongNode. If `children` is null, then child
   * PlayNodes will be recursively constructed to match the SongNode structure.
   */
  constructor(public songNode: SongNode, children: PlayNode[] | null) {
    if (children === null) {
      this.children = songNode.children.map((node) => new PlayNode(node, null));
    } else {
      this.children = children;
    }
  }

  /**
   * Traverse this node and its children recursively. If any nodes need to play
   * soon, they will be scheduled to play. Returns a new PlayNode after deleting
   * any already-played child nodes. Returns null if this node and all of its
   * children have been played.
   */
  public traverse(parentStack: SongTransformationStack, audio: Audio) :
   PlayNode | null {
    // Push any new transformations onto the stack.
    let stack = parentStack.add(this.songNode.transformations);

    // Get the absolute start time for this SongNode.
    let start = this.songNode.transformations.time.absolute(
     stack.getSlice('time'));

    if (audio.shouldSchedule(start)) {
      // If the absolute start time is soon, then schedule the note to play
      // soon.
      this.scheduleToPlay(stack, audio);

      // Also, check if any children need to be scheduled soon. Return the
      // new PlayNode with new children.
      return this.traverseChildren(stack, audio);
    } else {
      // If we're not playing this node soon, then just return this part of the
      // tree without any modifications.
      return this;
    }
  }

  /**
   * Traverse the children of this PlayNode. If any of them get scheduled to
   * play, return a new PlayNode with less children. Return null if this node
   * and all its children are done.
   */
  private traverseChildren(stack: SongTransformationStack, audio: Audio) :
   PlayNode | null {
    let newChildren: PlayNode[] = [];

    for (let i in this.children) {
      let newChild = this.children[i].traverse(stack, audio);

      if (newChild !== null) {
        newChildren.push(newChild);
      }
    }

    if (newChildren.length > 0) {
      return new PlayNode(this.songNode, newChildren);
    } else {
      return null;
    }
  }

  /**
   * Add the node to the WebAudio API.
   */
  private scheduleToPlay(stack: SongTransformationStack, audio: Audio) : void {
    // Right now, we just play leaf nodes.
    //
    // TODO: We'll want to play non-leaf nodes at some point.
    if (this.children.length > 0) {
      return;
    }

    // TODO: Make it one function call to get all of the absolute transforms.
    let start = this.songNode.transformations.time.absolute(
     stack.getSlice('time'));
    let end = this.songNode.transformations.time.absolute(
     stack.getSlice('time'), this.songNode.duration);
    let steps = this.songNode.transformations.time.absolute(
     stack.getSlice('steps'));

    audio.scheduleNote(start, end, steps);
  }
}
