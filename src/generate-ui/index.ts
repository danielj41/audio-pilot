/**
 * Creates a simple web browser UI for liking/disliking a song. This will cause
 * the song to change accordingly.
 */
import { generateSong, ActionInputVector, toSongTree, SongStore }
 from '../song-builder'
import { SongPlayer } from '../song-player'
import { ActionCreators } from 'redux-undo'

const LIKE_KEY = ' '; // Space bar
const DISLIKE_KEY = 'x'; // x keyboard key
const UNDO_KEY = 'u';
const REDO_KEY = 'r';

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
    } else if (ev.key === DISLIKE_KEY) {
      changeSong(store);
    } else if (ev.key === UNDO_KEY) {
      store.dispatch(ActionCreators.undo());
    } else if (ev.key === REDO_KEY) {
      store.dispatch(ActionCreators.redo());
    }
    console.log(store.getState());

    playSong(player, store);
  });
}

function changeSong(store: SongStore): void {
  store.dispatch((new ActionInputVector(store)).toAction());
}

function playSong(player: SongPlayer, store: SongStore): void {
  player.playSong(toSongTree(store.getState()), true);
}
