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
    let playTreeRoot = new PlayNode(song.root, null);

    setInterval(() : void => {
      playTreeRoot.traverse(new SongTransformationStack(), audio);
    }, this.period);
  }
}
