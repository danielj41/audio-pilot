/**
 * Creates a simple web browser UI for liking/disliking a song. This will cause
 * the song to change accordingly.
 */
import { generateSong, ActionInputVector, toSongTree, SongStore }
 from '../song-builder'
import { SongPlayer } from '../song-player'

const LIKE_KEY = ' '; // Space bar
const DISLIKE_KEY = 'x'; // x keyboard key

export function initializeUI() : void {
  let store = generateSong();
  let player = new SongPlayer();
  playSong(player, store);

  window.addEventListener('keypress', function(ev) {
    // The user liked or disliked the song. Change the song and play the new
    // version.
    //
    // TODO: It should do something different depending on whether the user
    //       likes it or not. If they dislike it, we should avoid doing similar
    //       song changes in the future.
    if (ev.key === LIKE_KEY) {
      changeSong(store);
      playSong(player, store);
    } else if (ev.key === DISLIKE_KEY) {
      changeSong(store);
      playSong(player, store);
    }
  });
}

function changeSong(store: SongStore): void {
  store.dispatch((new ActionInputVector(store)).toAction());
}

function playSong(player: SongPlayer, store: SongStore): void {
  player.playSong(toSongTree(store.getState()), true);
}
