import { isBreakLine, isEscaped, isWhitespace } from './token';
export class StringStream {
  private _content: string;
  private _line: number;
  private _col: number;
  private _pos: number;

  get content() {
    return this._content;
  }
  get line() {
    return this._line;
  }
  get col() {
    return this._col;
  }
  get pos() {
    return this._pos;
  }
  get current(): string | undefined {
    return this._content[this._pos];
  }

  get done() {
    return this._pos >= this._content.length;
  }
  constructor(content: string) {
    this._content = content;
    this._line = 0;
    this._col = 0;
    this._pos = 0;
  }
  next(): string | undefined {
    const ch = this._content[++this._pos];
    if (isBreakLine(ch)) {
      this._line++;
      this._col = 0;
    } else {
      this._col++;
    }
    return ch;
  }
  skip(value: number = 1) {
    while (value > 0) {
      value--;
      this.next();
    }
  }
  getPositionDetail() {
    return {
      pos: this._pos,
      col: this._col,
      line: this._line
    };
  }
  skipWhitespace() {
    while (!this.done) {
      if (!isWhitespace(this.current)) {
        break;
      }
      this.next();
    }
  }
  readEscaped(end: ((ch: string, stream?: StringStream) => boolean) | string) {
    const endTest =
      typeof end === 'string'
        ? (ch: string, stream?: StringStream) => ch === end
        : end;
    let str = '';
    let escaped = false;
    while (!this.done) {
      const ch = this.current;
      if (escaped) {
        escaped = false;
        str += ch;
      } else if (endTest(ch, this)) {
        break;
      } else if (isEscaped(ch)) {
        escaped = true;
      } else {
        str += ch;
      }
      this.next();
    }
    return str;
  }
}
