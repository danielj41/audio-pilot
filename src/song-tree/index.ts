import { SongNode } from './song-node'
import { SongTransformationCollection } from './song-transformation-collection'

export { SongNode } from './song-node'
export { SongTransformationCollection } from './song-transformation-collection'
export { Duration, Time, Velocity } from './time-transformation'
export { Steps, StepsPerStep } from './steps-transformation'
export { NoteSongNode } from './note-song-node'

export class SongTree {
  constructor(public root: SongNode) {}
}
