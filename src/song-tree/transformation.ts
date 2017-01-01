/**
 * Represents a transformation that should be applied to any child nodes.
 */
export abstract class Transformation<T> {
  protected identityValue: T;

  /**
   * Transforms from the child's relative value to the value with respect to
   * this node.
   */
  abstract transform(childValue: T): T;

  /**
   * Given the stack of transformations from the root node to this node, this
   * will return the absolute value of the value.
   */
  absolute(stack: Transformation<T>[], initialValue: T = this.identityValue) :
   T {
    let value = initialValue;

    for (let i = stack.length - 1; i >= 0; i--) {
      value = stack[i].transform(value);
    }

    let rootValue = value;

    return rootValue;
  }
}
