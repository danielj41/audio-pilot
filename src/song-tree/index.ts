import { SongNode } from './song-node'
import { SongTransformationCollection } from './song-transformation-collection'

export { SongNode } from './song-node'
export { SongTransformationCollection } from './song-transformation-collection'
export { Duration, Time, Velocity } from './time-transformation'
export { Steps } from './steps-transformation'

export class SongTree {
  constructor(public root: SongNode) {}
}