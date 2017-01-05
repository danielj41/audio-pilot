import { SongTree, SongNode, SongTransformationCollection } from '../song-tree'

// stub for now.
// TODO: Make this function actually useful.
export function generateSong() : SongTree {
  let t0 = new SongTransformationCollection(1, 1, 0, 1);

  let t1 = new SongTransformationCollection(0, 1, 0, 1);
  let t2 = new SongTransformationCollection(3, 2, 6, 1);

  let t3 = new SongTransformationCollection(0, 1, 0, 1);
  let t4 = new SongTransformationCollection(1, 1, 6, 1);
  let t5 = new SongTransformationCollection(2, 1, 0, 1);

  let s0 = new SongNode(t0);

  let s1 = new SongNode(t1);
  let s2 = new SongNode(t2);

  let s3 = new SongNode(t3);
  let s4 = new SongNode(t4);
  let s5 = new SongNode(t5);

  s1.duration = 0.5;
  s2.duration = 0.5;
  s3.duration = 1;
  s4.duration = 1;
  s5.duration = 1;

  s0.addChild(s1);
  s0.addChild(s2);

  s1.addChild(s3);
  s1.addChild(s4);
  s1.addChild(s5);

  s2.addChild(s3);
  s2.addChild(s4);
  s2.addChild(s5);

  let tree = new SongTree(s0);

  return tree;
}
