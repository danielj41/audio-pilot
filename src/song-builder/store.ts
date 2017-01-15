import { SongNode, SongTree } from '../song-tree'

export type SongStore = {
  songNodes: SongNodeStore[];
}

export type SongNodeStore = {
  id: number;
  parentId: number | null;
  songNode: SongNode;
}

export function toSongTree(store: SongStore) : void {//SongTree {
  console.log('test');
}
