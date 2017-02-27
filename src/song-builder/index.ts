/**
 * song-builder provides declarative syntax for creating a song-tree.
 */
import { createStore, Store } from 'redux'
import { SongState, toSongTree, SongStore } from './state'
import { reducer } from './reducer'
import { Action, addNode, addNoteNode, duplicateNode, editNode } from './action'
import { SongTree, NoteSongNode, SongTransformationCollection }
 from '../song-tree'

export { SongState, toSongTree } from './state'
export { addNode, addNoteNode, duplicateNode, editNode } from './action'
export { SongStore } from './state'
export { ActionInputVector } from './random'

/**
 * Creates a new Redux store for a song.
 */
export function newStore() : SongStore {
  let store: Store<SongState> = createStore(reducer);
  return store;
}

/**
 * Sample function for generating a SongTree. It's not very useful since it
 * only generates one song right now.
 */
export function generateSong() : SongStore {
  let store = newStore();

  // This is intended to be fairly declarative syntax. That way, I can
  // randomly generate songs by picking random actions and parameters
  // (in the future, when I get around to implementing it).
  store.dispatch(addNode(0));
  store.dispatch(addNoteNode(1));
  store.dispatch(addNoteNode(1));
  store.dispatch(addNoteNode(1));
  store.dispatch(editNode(3, 1, 1, 6));
  store.dispatch(editNode(4, 2, 1, 0));
  store.dispatch(duplicateNode(1, 0));
  store.dispatch(editNode(5, 3, 2, 6));

  return store;
}
