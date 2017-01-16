import { SongNode, SongTree, NoteSongNode, SongTransformationCollection }
 from '../song-tree'

export type SongStore = {
  songNodeStores: SongNodeStore[];
}

export type SongNodeStore = {
  childrenIds: number[];
  songNode: SongNode;
}

export const initialStore: SongStore = {
  songNodeStores: [{
    childrenIds: [],
    songNode: new NoteSongNode(new SongTransformationCollection(0))
  }]
}

/**
 * Transforms the flat redux-friendly SongStore into a SongTree.
 */
export function toSongTree(store: SongStore) : SongTree {
  let songNodeStores = store.songNodeStores;

  songNodeStores = songNodeStores.map((store) => {
    let songNode = store.songNode.clone();

    songNode.children = store.childrenIds.map(
     (id) => songNodeStores[id].songNode);

    return {
      ...store,
      songNode: songNode
    };
  });

  return new SongTree(songNodeStores[0].songNode);
}
