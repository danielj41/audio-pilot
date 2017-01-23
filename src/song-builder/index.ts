import { createStore, Store } from 'redux'
import { SongState, toSongTree } from './state'
import { reducer } from './reducer'
import { addNode, duplicateNode, editNode } from './action'
import { SongTree, NoteSongNode, SongTransformationCollection }
 from '../song-tree'

export function generateSong() : SongTree {
  let store: Store<SongState> = createStore(reducer);

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
