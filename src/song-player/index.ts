import { SongTree, SongNode, SongTransformationCollection, Steps }
 from '../song-tree'
import { SongTransformationStack } from './song-transformation-stack'
import { Audio } from './web-audio'
import { stepsToFrequency, Frequency } from './frequency'
import { PlayNode } from './play-node'

export class SongPlayer {
  public period: number = 10;

  playSong(song: SongTree) : void {
    let audio = new Audio();
    let playTree : PlayNode | null = new PlayNode(song.root, null);

    let interval = setInterval(() : void => {
      if (playTree !== null) {
        playTree = playTree.traverse(new SongTransformationStack(), audio);
      } else {
        clearInterval(interval);
        console.log('song ended!');
      }
    }, this.period);
  }
}
