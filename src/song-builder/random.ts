import { SongStore } from './state'
import { Action, duplicateNode } from './action'

/**
 * Sample function for duplicating a random node. It's not too useful right now,
 * but at some point, I want to make this an AI that chooses actions.
 */
export function randomAction(store: SongStore) : Action {
  let length = store.getState().songNodeStates.length;
  let duplicateId = Math.floor(Math.random() * length);
  let parentId = Math.floor(Math.random() * length);

  // Check for any cycles that this could cause.
  let ids = [duplicateId];
  // Keep going down the tree until we have no children.
  while (ids.length > 0) {
    let newIds: number[] = [];

    ids.forEach((id) => {
      newIds.push.apply(newIds,
       store.getState().songNodeStates[id].childrenIds);
    });

    ids = newIds;

    if (ids.indexOf(parentId) !== -1) {
      // If we run into our parent, then there's a cycle. Try again.
      return randomAction(store);
    }
  }

  return duplicateNode(duplicateId, parentId);
}
