import { SongNode, SongTree, NoteSongNode, SongTransformationCollection }
 from '../song-tree'

export type SongState = {
  songNodeStates: SongNodeState[];
}

export type SongNodeState = {
  childrenIds: number[];
  songNode: SongNode;
}

export const initialSongNodeState: SongNodeState[] = [{
  childrenIds: [],
  songNode: new NoteSongNode(new SongTransformationCollection(0))
}];

/**
 * Transforms the flat redux-friendly SongState into a SongTree.
 */
export function toSongTree(store: SongState) : SongTree {
  let songNodeStates = store.songNodeStates;

  songNodeStates = songNodeStates.map((state) => {
    let songNode = state.songNode.clone();

    return {
      ...state,
      songNode: songNode
    };
  });

  songNodeStates = songNodeStates.map((state) => {
    state.songNode.children = state.childrenIds.map(
     (id) => songNodeStates[id].songNode);

    return state;
  });

  return new SongTree(songNodeStates[0].songNode);
}
