import { SongTree, SongNode, SongTransformationCollection, Steps }
 from '../song-tree'
import { SongTransformationStack } from './song-transformation-stack'
import { AudioEnv } from '../audio-tree'
import { PlayNode } from './play-node'

/**
 * Plays a song defined by a SongTree.
 */
export class SongPlayer {
  /**
   * How often to traverse the PlayTree in ms. Each time we traverse the tree,
   * we look for new notes to play in the next few seconds.
   */
  public traversePeriod: number = 10;

  public playSong(song: SongTree) : void {
    let audio = new AudioEnv();

    // Create a PlayNode representation of the SongTree.
    let playTree : PlayNode | null = new PlayNode(song.root);

    // Traverse the tree repeatedly.
    let interval = setInterval(() : void => {
      if (playTree !== null) {
        // `traverse` will return a new tree after deleting all nodes that have
        // already been played.
        playTree = playTree.traverse(new SongTransformationStack(), audio);
      } else {
        // If it returns null, then there are no more nodes to play. That means
        // that the song must have ended.
        clearInterval(interval);
        console.log('song ended!');
      }
    }, this.traversePeriod);
  }
}
