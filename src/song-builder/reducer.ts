import { combineReducers } from 'redux'
import { Action } from './action'
import { SongStore, initialStore, SongNodesStore } from './store'

export function songNodesReducer(state: SongNodesStore[], action: Action) :
 SongNodesStore[] {
  switch (action.type) {
    case 'ADD_NODE':
      return [...state, {
        songNode: action.songNode,
        parentId: action.parentId
      }];
    case 'DUPLICATE_NODE':
      return [...state, {
        songNode: state[action.id].songNode,
        parentId: action.parentId
      }];
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
