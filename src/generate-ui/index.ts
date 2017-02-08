/**
 * Creates a simple web browser UI for liking/disliking a song.
 */
import { generateSong, randomAction, toSongTree, SongStore }
 from '../song-builder'
import { SongPlayer } from '../song-player'

const LIKE_KEY = ' ';
const DISLIKE_KEY = 'x';

export function initializeUI() : void {
  let store = generateSong();
  let player = new SongPlayer();
  playSong(player, store);

  window.addEventListener('keypress', function(ev) {
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
  store.dispatch(randomAction(store));
}

function playSong(player: SongPlayer, store: SongStore): void {
  player.playSong(toSongTree(store.getState()), true);
}
