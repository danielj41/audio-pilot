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

export function addNode(parentId: number) : Action {
  return {
    type: 'ADD_NODE',
    songNode: new NoteSongNode(new SongTransformationCollection(0), 1),
    parentId
  };
}

export function duplicateNode(id: number, parentId: number) : Action {
  return {
    type: 'DUPLICATE_NODE',
    id,
    parentId
  };
}

export function editNode(id: number, time: Time, velocity: Velocity = 1,
 steps: Steps = 0, stepsPerStep: StepsPerStep = 1) {
  return {
    type: 'EDIT_NODE',
    id,
    newTransformations: new SongTransformationCollection(time, velocity, steps,
     stepsPerStep)
  }
}
