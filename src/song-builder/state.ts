import { SongNode, SongTree, NoteSongNode, SongTransformationCollection }
 from '../song-tree'

export type SongState = {
  songNodeStates: SongNodeState[];
}

export type SongNodeState = {
  childrenIds: number[];
  songNode: SongNode;
}

// Start with one item with id 0, it will be the root SongNode.
export const initialSongNodeState: SongNodeState[] = [{
  childrenIds: [],
  songNode: new SongNode(new SongTransformationCollection(0))
}];

/**
 * Transforms the flat redux-friendly SongState into a SongTree.
 */
export function toSongTree(state: SongState) : SongTree {
  let songNodeStates = state.songNodeStates;

  // Clone all the SongNodes so we can mutate them within this function.
  songNodeStates = songNodeStates.map((state) => {
    let songNode = state.songNode.clone();

    return {
      ...state,
      songNode: songNode
    };
  });

  // Get rid of the ids and actually fill in the `children` arrays.
  songNodeStates = songNodeStates.map((state) => {
    state.songNode.children = state.childrenIds.map(
     (id) => songNodeStates[id].songNode);

    return state;
  });

  return new SongTree(songNodeStates[0].songNode);
}
