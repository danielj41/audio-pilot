import { SongStore } from './state'
import { Action, duplicateNode, addNode, addNoteNode, editNode } from './action'

/**
 * Creates a random Action.
 */
export function randomAction(store: SongStore) : Action {
  return randomDuplicateNode(store);
}

/**
 * Duplicate a random node.
 */
function randomDuplicateNode(store: SongStore) : Action {
  let duplicateId = randomNodeId(store);
  let parentId = randomNodeId(store);

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
      return randomDuplicateNode(store);
    }
  }

  return duplicateNode(duplicateId, parentId);
}

function randomAddNode(store: SongStore) : Action {
  return addNode(randomNodeId(store));
}

function randomAddNoteNode(store: SongStore) : Action {
  return addNoteNode(randomNodeId(store));
}

function randomEditNode(store: SongStore) : Action {
  return editNode(randomNodeId(store), Math.random(), Math.random(),
   Math.random(), Math.random());
}

/**
 * Returns a random Node id that exists in the store.
 */
function randomNodeId(store: SongStore) : number {
  return Math.floor(Math.random() * store.getState().songNodeStates.length);
}
