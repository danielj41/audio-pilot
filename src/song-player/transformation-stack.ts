/**
 * When traversing a SongTree, this represents the current stack of
 * transformations from each parent node.
 */
export class TransformationStack<T> {
  private stackArray: T[];

  constructor() {
    this.stackArray = [];
  }

  /**
   * Return a new stack with an additional element on the top.
   */
  add(newElement: T) : TransformationStack<T> {
    let newStack = new TransformationStack<T>();
    newStack.stackArray = this.stackArray.concat(newElement);
    return newStack;
  }

  /**
   * Returns one slice of the stack. For example, this can be used to get just
   * an array of TimeTransformations or StepsTransformations, rather than
   * `stack`, which is an array of SongTransformationCollections.
   */
  getSlice<K extends keyof T>(sliceName: K) : T[K][] {
    return this.stackArray.map(function(transformations: T, index, array) :
     T[K] {
      return transformations[sliceName];
    });
  }
}
