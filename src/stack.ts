export class Stack<T> {
  private _stack: T[] = [];
  get top() {
    if (this.isEmpty()) {
      return null;
    } else {
      return this._stack[this._stack.length - 1] as T;
    }
  }
  isEmpty() {
    return this._stack.length == 0;
  }
  push(value: T) {
    this._stack.push(value);
  }
  pop() {
    return this._stack.pop();
  }
}
