import { createStore, Store } from 'redux'
import { SongStore, toSongTree } from './store'
import { reducer } from './reducer'
import { SongTree, NoteSongNode, SongTransformationCollection }
 from '../song-tree'

export function generateSong2() : SongTree {
  let store: Store<SongStore> = createStore(reducer);

  return toSongTree(store.getState());
}

// stub for now.
// TODO: Make this function actually useful.
export function generateSong() : SongTree {
  let t0 = new SongTransformationCollection(1, 1, 0, 1);

  let t1 = new SongTransformationCollection(0, 1, 0, 1);
  let t2 = new SongTransformationCollection(3, 2, 6, 1);

  let t3 = new SongTransformationCollection(0, 1, 0, 1);
  let t4 = new SongTransformationCollection(1, 1, 6, 1);
  let t5 = new SongTransformationCollection(2, 1, 0, 1);

  let s0 = new NoteSongNode(t0);

  let s1 = new NoteSongNode(t1);
  let s2 = new NoteSongNode(t2);

  let s3 = new NoteSongNode(t3, 1);
  let s4 = new NoteSongNode(t4, 1);
  let s5 = new NoteSongNode(t5, 1);

  s1.addChild(s3);
  s1.addChild(s4);
  s1.addChild(s5);

  s2.addChild(s3);
  s2.addChild(s4);
  s2.addChild(s5);

  s0.addChild(s1);
  s0.addChild(s2);

  let tree = new SongTree(s0);

  return tree;
}
