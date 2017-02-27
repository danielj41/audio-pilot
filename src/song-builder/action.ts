import { SongNode, NoteSongNode, SongTree, SongTransformationCollection, Time,
 Velocity, Steps, StepsPerStep } from '../song-tree'

export type Action = {
  type: 'ADD_NODE',
  songNode: SongNode,
  parentId: number
} | {
  type: 'DUPLICATE_NODE',
  id: number,
  parentId: number
} | {
  type: 'EDIT_NODE',
  id: number,
  newTransformations: SongTransformationCollection
};

/**
 * Creates an action that will create a blank SongNode, attaching it to
 * parentId.
 */
export function addNode(parentId: number) : Action {
  return {
    type: 'ADD_NODE',
    songNode: new SongNode(new SongTransformationCollection(0), 1),
    parentId
  };
}

/**
 * Creates an action that will create a blank NoteSongNode, attaching it to
 * parentId
 *
 * TODO: Figure out a way to make addNode more generic and accept a type.
 */
export function addNoteNode(parentId: number) : Action {
  return {
    type: 'ADD_NODE',
    songNode: new NoteSongNode(new SongTransformationCollection(0), 1),
    parentId
  };
}

/**
 * Creates an action that duplicates a SongNode, including a shallow copy
 * of all its children.
 */
export function duplicateNode(id: number, parentId: number) : Action {
  return {
    type: 'DUPLICATE_NODE',
    id, // id of the node to duplicate.
    parentId
  };
}

/**
 * Takes an existing node and modifies its transformations.
 */
export function editNode(id: number, time: Time, velocity: Velocity = 1,
 steps: Steps = 0, stepsPerStep: StepsPerStep = 1) : Action {
  return {
    type: 'EDIT_NODE',
    id,
    newTransformations: new SongTransformationCollection(time, velocity, steps,
     stepsPerStep)
  }
}
