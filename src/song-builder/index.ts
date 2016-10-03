import { SongTree, SongNode, SongTransformationCollection } from '../song-tree'

// stub for now.
// TODO: Make this function actually useful.
export function generateSong() : SongTree {
    let t1 = new SongTransformationCollection(3, 2, 4, 2);
    let t2 = new SongTransformationCollection(3, 2, 4, 2);
    let t3 = new SongTransformationCollection(3, 2, 4, 2);

    let s1 = new SongNode(t1);
    let s2 = new SongNode(t2);
    let s3 = new SongNode(t3);

    s1.addChild(s2);
    s2.addChild(s3);

    let tree = new SongTree(s1);

    return tree;
}
