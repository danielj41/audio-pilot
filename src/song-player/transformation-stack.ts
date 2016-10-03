/**
 * When traversing a SongTree, this represents the current stack of
 * transformations from each parent node.
 */
export class TransformationStack<T> {
  stack: T[];

  constructor() {
    this.stack = [];
  }

  push(transformationCollection: T) : void {
    this.stack.push(transformationCollection);
  }

  pop() : void {
    this.stack.pop();
  }

  /**
   * Returns one slice of the stack. For example, this can be used to get just
   * an array of TimeTransformations or StepsTransformations, rather than
   * `stack`, which is an array of SongTransformationCollections.
   */
  getSlice<K extends keyof T>(sliceName: K) : T[K][] {
    return this.stack.map(function(transformations: T, index, array): T[K] {
      return transformations[sliceName];
    });
  }
}
