/**
 * song-player uses audio-tree to play a song-tree in the browser.
 */
import { SongTree, SongNode, SongTransformationCollection, Steps }
 from '../song-tree'
import { SongTransformationStack } from './song-transformation-stack'
import { AudioEnv } from '../audio-tree'
import { PlayNode } from './play-node'

export { PlayNode } from './play-node'

/**
 * Plays a song defined by a SongTree.
 */
export class SongPlayer {
  /**
   * How often to traverse the PlayTree in ms. Each time we traverse the tree,
   * we look for new notes to play in the next few seconds.
   */
  public traversePeriod: number = 10;

  private audio: AudioEnv;
  private interval: number | null = null;

  public constructor(audio: AudioEnv | null = null) {
    this.audio = audio || new AudioEnv();
  }

  public playSong(song: SongTree, loop: boolean = false) : void {
    // Create a PlayNode representation of the SongTree.
    let playTree : PlayNode | null = new PlayNode(song.root);

    // Stop any other song we're playing.
    this.stopSong();

    // Traverse the tree repeatedly.
    // TODO: Figure out why I need `<any>` here.
    this.interval = <any>setInterval(() : void => {
      if (playTree !== null) {
        // `traverse` will return a new tree after deleting all nodes that have
        // already been played.
        playTree = this.playInterval(playTree);
      } else {
        // If it returns null, then there are no more nodes to play. That means
        // that the song must have ended.
        console.log('song ended!');
        this.stopSong();

        if (loop) {
          // Reset the audio time and start over.
          this.audio = new AudioEnv();
          this.playSong(song);
        }
      }
    }, this.traversePeriod);
  }

  public stopSong() {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  public playInterval(playTree : PlayNode) : PlayNode | null {
    return playTree.traverse(new SongTransformationStack(), this.audio);
  }
}
