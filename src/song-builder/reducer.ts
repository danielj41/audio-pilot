import { combineReducers } from 'redux'
import { Action } from './action'
import { SongStore, initialStore, SongNodeStore } from './store'

export function songNodesReducer(state: SongNodeStore[], action: Action) :
 SongNodeStore[] {
  switch (action.type) {
    case 'ADD_NODE': {
      let newState: SongNodeStore[] = [...state, {
        childrenIds: new Array<number>(),
        songNode: action.songNode
      }];
      newState[action.parentId] = {
        ...newState[action.parentId],
        childrenIds: [...newState[action.parentId].childrenIds, state.length]
      };
      return newState;
    }
    case 'DUPLICATE_NODE': {
      let newState: SongNodeStore[] = [...state, {
        ...state[action.id]
      }];
      newState[action.parentId] = {
        ...newState[action.parentId],
        childrenIds: [...newState[action.parentId].childrenIds, state.length]
      };
      return newState;
    }
    case 'EDIT_NODE':
      let newNode = state[action.id].songNode.clone();
      newNode.transformations = action.newTransformations;

      let newState = [...state];

      newState[action.id] = {
        ...newState[action.id],
        songNode: newNode
      }

      return newState;
  }

  return state;
}

export const reducer = combineReducers<SongStore>({
  songNodesStore: songNodesReducer
});
