import { SongTree, SongNode, SongTransformationCollection } from '../song-tree'
import { SongTransformationStack } from './song-transformation-stack'
import { Audio } from './web-audio'
import { stepsToFrequency } from './frequency'

export function playSong(song: SongTree) : void {
  let audio = new Audio();

  setInterval(() => {
    playNode(song.root, new SongTransformationStack(), audio);
  }, 10);
}

function playNode(node: SongNode, stack: SongTransformationStack, audio: Audio)
 : void {
  stack.push(node.transformations);

  let start = node.transformations.time.absolute(stack.getSlice('time'));
  let end = node.transformations.time.absolute(stack.getSlice('time'), node.duration);
  let steps = node.transformations.time.absolute(stack.getSlice('steps'));
  let frequency = stepsToFrequency(440, steps / 12.0);

  if (node.children.length == 0 && node.played == false) {
    if (audio.context.currentTime > start - 0.2) {
      node.played = true;
      audio.playNote(start, end, frequency);
    }
  }

  for (let i in node.children) {
    playNode(node.children[i], stack, audio);
  }

  stack.pop();
}
