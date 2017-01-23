/**
 * song-builder provides declarative syntax for creating a song-tree.
 */
import { createStore, Store } from 'redux'
import { SongState, toSongTree } from './state'
import { reducer } from './reducer'
import { addNode, duplicateNode, editNode } from './action'
import { SongTree, NoteSongNode, SongTransformationCollection }
 from '../song-tree'

/**
 * Sample function for generating a SongTree. It's not very useful since it
 * only generates one song right now.
 */
export function generateSong() : SongTree {
  let store: Store<SongState> = createStore(reducer);

  // This is intended to be fairly declarative syntax. That way, I can
  // randomly generate songs by picking random actions and parameters
  // (in the future, when I get around to implementing it).
  store.dispatch(addNode(0));
  store.dispatch(addNode(1));
  store.dispatch(addNode(1));
  store.dispatch(addNode(1));
  store.dispatch(editNode(3, 1, 1, 6));
  store.dispatch(editNode(4, 2, 1, 0));
  store.dispatch(duplicateNode(1, 0));
  store.dispatch(editNode(5, 3, 2, 6));

  return toSongTree(store.getState());
}
