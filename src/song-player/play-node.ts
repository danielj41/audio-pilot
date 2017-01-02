import { SongTree, SongNode, SongTransformationCollection } from '../song-tree'
import { SongTransformationStack } from './song-transformation-stack'
import { Audio } from './web-audio'

export class PlayNode {
  public children: PlayNode[];

  constructor(public songNode: SongNode, children: PlayNode[] | null) {
    if (children === null) {
      this.children = songNode.children.map((node) => new PlayNode(node, null));
    } else {
      this.children = children;
    }
  }

  traverse(parentStack: SongTransformationStack, audio: Audio) :
   PlayNode | null {
    let stack = parentStack.add(this.songNode.transformations);

    let start = this.songNode.transformations.time.absolute(
     stack.getSlice('time'));

    if (audio.shouldSchedule(start)) {
      if (this.children.length > 0) {
        return this.traverseChildren(stack, audio);
      } else {
        return this.traverseLeaf(stack, audio);
      }
    }

    return this;
  }

  traverseChildren(stack: SongTransformationStack, audio: Audio) :
   PlayNode | null {
    let dirty: boolean = false;
    let newChildren: PlayNode[] = [];

    for (let i in this.children) {
      let newChild = this.children[i].traverse(stack, audio);

      if (newChild !== this.children[i]) {
        dirty = true;
      }

      if (newChild !== null) {
        newChildren.push(newChild);
      }
    }

    if (!dirty) {
      return this;
    } else if (newChildren.length > 0) {
      return new PlayNode(this.songNode, newChildren);
    } else {
      return null;
    }
  }

  traverseLeaf(stack: SongTransformationStack, audio: Audio) :
   PlayNode | null {
    let start = this.songNode.transformations.time.absolute(
     stack.getSlice('time'));

    let end = this.songNode.transformations.time.absolute(
     stack.getSlice('time'), this.songNode.duration);
    let steps = this.songNode.transformations.time.absolute(
     stack.getSlice('steps'));

    audio.scheduleNote(start, end, steps);

    return null;
  }
}
