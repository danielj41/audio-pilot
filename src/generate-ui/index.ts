/**
 * Creates a simple web browser UI for liking/disliking a song.
 */
import { generateSong, randomAction, toSongTree } from '../song-builder'
import { SongPlayer } from '../song-player'

const LIKE_KEY = ' ';
const DISLIKE_KEY = 'x';

export function initializeUI() : void {
  let store = generateSong();

  window.addEventListener('keypress', function(ev) {
    if (ev.key === LIKE_KEY) {
      changeSong();
    } else if (ev.key === DISLIKE_KEY) {
      changeSong();
    }
  });
}

function changeSong() {

}
