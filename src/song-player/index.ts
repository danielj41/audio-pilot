import { SongTree, SongNode, SongTransformationCollection } from '../song-tree'
import { SongTransformationStack } from './song-transformation-stack'

export function playSong(song: SongTree) : void {
  playNode(song.root, new SongTransformationStack());
}

function playNode(node: SongNode, stack: SongTransformationStack) : void {
  stack.push(node.transformations);

  console.log("TIME: ", node.transformations.time.absolute(stack.getSlice('time')));
  console.log("STEPS: ", node.transformations.time.absolute(stack.getSlice('steps')));

  for (let i in node.children) {
    playNode(node.children[i], stack);
  }

  stack.pop();
}
