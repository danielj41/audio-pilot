import { SongTree, SongNode } from '../song-tree'
import { SongTransformationStack } from './song-transformation-stack'
import { Audio } from './web-audio'

export class PlayNode {
  public children: PlayNode[];
  public played: boolean = false;

  constructor(public songNode: SongNode, public parentNode: PlayNode | null) {
    this.children = songNode.children.map((node) => new PlayNode(node, this));
  }

  traverse(stack: SongTransformationStack, audio: Audio) :
   void {
    stack.push(this.songNode.transformations);

    let start = this.songNode.transformations.time.absolute(
     stack.getSlice('time'));
    let end = this.songNode.transformations.time.absolute(
     stack.getSlice('time'), this.songNode.duration);
    let steps = this.songNode.transformations.time.absolute(
     stack.getSlice('steps'));

    if (audio.shouldSchedule(start)) {
      if (this.children.length == 0 && this.played == false) {
        this.played = true;
        audio.scheduleNote(start, end, steps);
      }
    }

    for (let i in this.children) {
      this.children[i].traverse(stack, audio);
    }

    stack.pop();
  }
}
