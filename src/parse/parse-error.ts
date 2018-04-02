export interface ParsePosition {
  line: number;
  col: number;
  pos: number;
}

// 不继承 Error 对象可以大幅度提升性能 -.-!
export default class ParseError {
  errorStart!: ParsePosition;
  errorEnd!: ParsePosition;
  messagePositon?: ParsePosition;
  private _message?: string;
  get message() {
    let pos = this.messagePositon;
    if (!pos) {
      pos = this.errorEnd;
    }
    return `[${pos && pos.line + 1}:${pos && pos.col + 1}]: ${this._message ||
      'Unkown error'}`;
  }
  set message(msg: string) {
    this._message = msg;
  }
  constructor(message?: string) {
    if (message) {
      this._message = message;
    }
  }
}
