import { SongStore } from './state'
import { Action, duplicateNode, addNode, addNoteNode, editNode } from './action'

/**
 * Creates random Actions that can be represented by a vector of integers.
 */
export class ActionInputVector {
  private actionTypeInputs: number[] = [];
  private nodeIdInputs: number[] = [];
  private transformInputs: number[] = [];

  constructor(private store: SongStore) {
    this.setRandomInputs(store);
  }

  private setRandomInputs(store: SongStore) {
    let inputs : number[] = [];

    this.actionTypeInputs[0] = randomInt(0, 4);
    this.nodeIdInputs[0] = randomNodeId(store);
    this.nodeIdInputs[1] = randomNodeId(store);
    this.transformInputs[0] = randomInt(0, 10);
    this.transformInputs[1] = randomInt(1, 4);
    this.transformInputs[2] = randomInt(-12, 13);
    this.transformInputs[3] = randomInt(1, 3);
  }

  public toVector(): number[] {
    return [
      ...this.actionTypeInputs,
      ...this.nodeIdInputs,
      ...this.transformInputs
    ];
  }

  public toAction(): Action {
    switch (this.actionTypeInputs[0]) {
      case 0:
        return addNode(this.nodeIdInputs[1]);
      case 1:
        return addNoteNode(this.nodeIdInputs[1]);
      case 2:
        return safeDuplicateNode(this.store, this.nodeIdInputs[0],
         this.nodeIdInputs[1]);
      case 3:
        return editNode(this.nodeIdInputs[0], this.transformInputs[0],
         this.transformInputs[1], this.transformInputs[2],
         this.transformInputs[3]);
      default:
        return addNode(this.nodeIdInputs[1]);
    }
  }
}

/**
 * Duplicate a random node without creating a cycle.
 */
function safeDuplicateNode(store: SongStore, duplicateId : number,
 parentId : number) : Action {
  // Check for any cycles that this could cause.
  let ids = [duplicateId];
  // Keep going down the tree until we have no children.
  while (ids.length > 0) {
    let newIds: number[] = [];

    ids.forEach((id) => {
      newIds.push.apply(newIds,
       store.getState().songNodeStates.present[id].childrenIds);
    });

    ids = newIds;

    if (ids.indexOf(parentId) !== -1) {
      // If we run into our parent, then there's a cycle. Do something else.
      return addNode(parentId);
    }
  }

  return duplicateNode(duplicateId, parentId);
}

function randomInt(minInclusive : number, maxExclusive : number) {
  return Math.floor(Math.random() * (maxExclusive - minInclusive)) +
   minInclusive;
}

/**
 * Returns a random Node id that exists in the store.
 */
function randomNodeId(store: SongStore) : number {
  return randomInt(0, store.getState().songNodeStates.present.length);
}
