import { SongNode, SongTree, SongTransformationCollection } from '../song-tree'

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
