  import { SongTree, SongNode, SongTransformationCollection, Time }
 from '../song-tree'
import { SongTransformationStack } from './song-transformation-stack'
import { AudioEnv, AudioNodeChain } from '../audio-tree'

/**
 * A wrapper around a SongNode that has methods for actually playing notes.
 */
export class PlayNode {
  children: PlayNode[];
  audioNodes: AudioNodeChain | null;
  duration: Time;

  /**
   * Construct a PlayNode for a SongNode. If `children` is null, then child
   * PlayNodes will be recursively constructed to match the SongNode structure.
   */
  constructor(public songNode: SongNode,
                     children: PlayNode[] | null = null,
                     duration: Time | null = null,
                     audioNodes: AudioNodeChain | null = null) {

    this.children = children || this.calculateChildren(songNode);
    this.duration = duration || this.calculateDuration(this.children, songNode);
    this.audioNodes = audioNodes;
  }

  /**
   * Recursively construct children based on our SongNode's children.
   */
  private calculateChildren(songNode: SongNode) : PlayNode[] {
    return songNode.children.map((node) => {
      return new PlayNode(node);
    });
  }

  /**
   * Infer duration from our children's durations.
   */
  private calculateDuration(children: PlayNode[], songNode: SongNode) : Time {
    if (this.isLeaf(children)) {
      // Leafs have explicit durations.
      return songNode.duration;
    } else {
      // Infer our duration from our last child's end time, relative to this.
      return Math.max.apply(Math, children.map((child) => {
        return child.songNode.transformations.time.transform(child.duration);
      }));
    }
  }

  public isLeaf(children: PlayNode[] | null = null) : boolean {
    return (children || this.children).length === 0;
  }

  /**
   * Traverse this node and its children recursively. If any nodes need to play
   * soon, they will be scheduled to play. Returns a new PlayNode after deleting
   * any already-played child nodes. Returns null if this node and all of its
   * children have been played.
   */
  public traverse(parentStack: SongTransformationStack, audio: AudioEnv,
   parentAudioNodes: AudioNodeChain | null = null) :
   PlayNode | null {
    // Push any new transformations onto the stack.
    let stack = parentStack.add(this.songNode.transformations);

    // Get the absolute start time for this SongNode.
    let start = this.songNode.transformations.time.absolute(
     stack.getSlice('time'));

    if (audio.shouldSchedule(start)) {
      let newNode: PlayNode = this;

      // If the absolute start time is soon, then schedule the note to play
      // soon.
      if (!this.audioNodes) {
        newNode = this.scheduleToPlay(stack, audio, parentAudioNodes);
      }

      // Also, check if any children need to be scheduled soon. Return the
      // new PlayNode with new children.
      return newNode.traverseChildren(stack, audio);
    } else {
      // If we're not playing this node soon, then just return this part of the
      // tree without any modifications.
      return this;
    }
  }

  /**
   * Traverse the children of this PlayNode. If any of them get scheduled to
   * play, return a new PlayNode with less children. Return null if this node
   * and all its children are done.
   */
  private traverseChildren(stack: SongTransformationStack, audio: AudioEnv) :
   PlayNode | null {
    let newChildren: PlayNode[] = [];

    for (let i in this.children) {
      let newChild = this.children[i].traverse(stack, audio, this.audioNodes);

      if (newChild !== null) {
        newChildren.push(newChild);
      }
    }

    if (newChildren.length > 0) {
      return new PlayNode(this.songNode, newChildren, this.duration,
       this.audioNodes);
    } else {
      return null;
    }
  }

  /**
   * Add the node to the WebAudio API.
   */
  private scheduleToPlay(stack: SongTransformationStack, audio: AudioEnv,
   parentAudioNodes: AudioNodeChain | null) :
   PlayNode {
    // TODO: Make it one function call to get all of the absolute transforms.
    let start = this.songNode.transformations.time.absolute(
     stack.getSlice('time'));
    let end = this.songNode.transformations.time.absolute(
     stack.getSlice('time'), this.duration);
    let steps = this.songNode.transformations.time.absolute(
     stack.getSlice('steps'));

    let audioNodes = this.songNode.getAudioNodeChain(audio.context);
    audioNodes.schedule(audio, start, end, steps, parentAudioNodes);

    return new PlayNode(this.songNode, this.children, this.duration,
     audioNodes);
  }
}
