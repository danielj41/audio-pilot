import { SongNode, SongTree, NoteSongNode, SongTransformationCollection }
 from '../song-tree'

export type SongStore = {
  songNodesStore: SongNodesStore[];
}

export type SongNodesStore = {
  parentId: number | null;
  songNode: SongNode;
}

export const initialStore: SongStore = {
  songNodesStore: [{
    parentId: null,
    songNode: new NoteSongNode(new SongTransformationCollection(0))
  }]
}

/**
 * Transforms the flat redux-friendly SongStore into a SongTree.
 */
export function toSongTree(store: SongStore) : SongTree {
  let songNodesStore = store.songNodesStore;

  songNodesStore = songNodesStore.map((store) => {
    return {
      ...store,
      songNode: store.songNode.clone()
    };
  });

  songNodesStore.forEach((store, id) => {
    if (store.parentId !== null) {
      let parentSongNode = songNodesStore[store.parentId].songNode;

      parentSongNode.children =
       parentSongNode.children.concat([store.songNode]);
    }
  });

  return new SongTree(songNodesStore[0].songNode);
}
