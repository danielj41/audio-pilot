/**
 * Creates a simple web browser UI for liking/disliking a song. This will cause
 * the song to change accordingly.
 */
import { generateSong, ActionInputVector, toSongTree, SongStore }
 from '../song-builder'
import { SongPlayer } from '../song-player'
import { ActionCreators } from 'redux-undo'
import { Network } from '../action-learn'

const LIKE_KEY = ' '; // Space bar
const DISLIKE_KEY = 'x'; // x keyboard key
const UNDO_KEY = 'u';
const REDO_KEY = 'r';
const FILL_KEY = 'f';

export function initializeUI() : void {
  let store = generateSong();

  let player = new SongPlayer();
  let network = new Network();

  changeSong(store, network, 0, 1);
  playSong(player, store);

  window.addEventListener('keypress', function(ev) {
    // The user liked or disliked the song. Change the song and play the new
    // version.
    if (ev.key === LIKE_KEY) {
      network.propagate(1);
      changeSong(store, network, 0.3, 3);
    } else if (ev.key === DISLIKE_KEY) {
      network.propagate(0);
      store.dispatch(ActionCreators.undo());
      store.dispatch(ActionCreators.undo());
      store.dispatch(ActionCreators.undo());
      changeSong(store, network, 0.5, 5);
    } else if (ev.key === UNDO_KEY) {
      store.dispatch(ActionCreators.undo());
    } else if (ev.key === REDO_KEY) {
      store.dispatch(ActionCreators.redo());
    } else if (ev.key === FILL_KEY) {
      for (let i = 0; i < 5; i++) {
        changeSong(store, network, 0.7, 10);
      }
    }

    playSong(player, store);
  });
}

function changeSong(store: SongStore, network: Network,
 minResult: number, maxTries: number) : void {
  let actionVectors: ActionInputVector[] = [];

  let result = -1;

  while (result < minResult && maxTries--) {
    actionVectors = [
      new ActionInputVector(store),
      new ActionInputVector(store),
      new ActionInputVector(store)
    ];

    let input = actionVectors.reduce((prev: number[], actionVector) => {
      return [...prev, ...actionVector.toArray()];
    }, []);

    result = network.activate(input);
    console.log('Estimated score ' + maxTries +': ' + result);
  }



  actionVectors.forEach((actionVector) => {
    store.dispatch(actionVector.toAction());
  });
}

function playSong(player: SongPlayer, store: SongStore): void {
  player.playSong(toSongTree(store.getState()), true);
}
