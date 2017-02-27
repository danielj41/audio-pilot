import { combineReducers } from 'redux'
import { Action } from './action'
import { SongState, initialSongNodeState, SongNodeState } from './state'
import undoable from 'redux-undo'

export function songNodesReducer(state: SongNodeState[] = initialSongNodeState,
 action: Action) : SongNodeState[] {
  switch (action.type) {

    case 'ADD_NODE': {
      // The id is the index into the array.
      let id = state.length;

      // Append the SongNode.
      let newState: SongNodeState[] = [...state, {
        childrenIds: new Array<number>(),
        songNode: action.songNode
      }];

      // Add it as a child of its parent.
      newState[action.parentId] = {
        ...newState[action.parentId],
        childrenIds: [...newState[action.parentId].childrenIds, state.length]
      };
      return newState;
    }

    case 'DUPLICATE_NODE': {
      // The id is the index into the array.
      let id = state.length;

      // Duplicate it and append it.
      let newState: SongNodeState[] = [...state, {
        ...state[action.id]
      }];

      // Add it as a child of its parent.
      newState[action.parentId] = {
        ...newState[action.parentId],
        childrenIds: [...newState[action.parentId].childrenIds, state.length]
      };
      return newState;
    }

    case 'EDIT_NODE':
      // Clone the actual SongNode and give it the new transformations.
      let newNode = state[action.id].songNode.clone();
      newNode.transformations = action.newTransformations;

      // Copy the array.
      let newState = [...state];

      // Edit the SongNodeState, now that we've made a copy of it.
      newState[action.id] = {
        ...newState[action.id],
        songNode: newNode
      }

      return newState;
  }

  return state;
}

export const reducer = combineReducers<SongState>({
  songNodeStates: undoable(songNodesReducer, {
    limit: 10
  })
});
