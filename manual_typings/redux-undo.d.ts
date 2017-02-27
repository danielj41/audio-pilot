import { Reducer, Action } from 'redux'

export interface UndoableState<T> {
  past: T[];
  present: T;
  future: T[];
}

export default function undoable<T>(reducer: Reducer<T>, config: {}) :
 Reducer<UndoableState<T>>;

export namespace ActionCreators {
  export function undo(): Action;
  export function redo(): Action;
}
