export class Stack<T> {
  private _stack: T[] = [];
  get top(): T | undefined {
    return this._stack[this._stack.length - 1];
  }
  isEmpty() {
    return this._stack.length == 0;
  }
  push(value: T) {
    this._stack.push(value);
  }
  pop(): T | undefined {
    return this._stack.pop();
  }
}
