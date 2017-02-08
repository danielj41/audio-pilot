/**
 * song-builder provides declarative syntax for creating a song-tree.
 */
import { createStore, Store } from 'redux'
import { SongState, toSongTree } from './state'
import { reducer } from './reducer'
import { Action, addNode, addNoteNode, duplicateNode, editNode } from './action'
import { SongTree, NoteSongNode, SongTransformationCollection }
 from '../song-tree'

export { SongState, toSongTree } from './state'
export { addNode, addNoteNode, duplicateNode, editNode } from './action'

export type SongStore = Store<SongState>;

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

/**
 * Sample function for duplicating a random node. It's not too useful right now,
 * but at some point, I want to make this an AI that chooses actions.
 */
export function randomAction(store: SongStore) : Action {
  let length = store.getState().songNodeStates.length;
  let duplicateId = Math.floor(Math.random() * length);
  let parentId = Math.floor(Math.random() * length);

  // Check for any cycles that this could cause.
  let ids = [duplicateId];
  // Keep going down the tree until we have no children.
  while (ids.length > 0) {
    let newIds: number[] = [];

    ids.forEach((id) => {
      newIds.push.apply(newIds,
       store.getState().songNodeStates[id].childrenIds);
    });

    ids = newIds;

    if (ids.indexOf(parentId) !== -1) {
      // If we run into our parent, then there's a cycle. Try again.
      return randomAction(store);
    }
  }

  return duplicateNode(duplicateId, parentId);
}
