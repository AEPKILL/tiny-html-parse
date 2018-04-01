export interface ParsePosition {
  line: number;
  col: number;
  pos: number;
}

// 不继承 Error 对象可以大幅度提升性能 -.-!
export default class ParseError {
  errorStart!: ParsePosition;
  errorEnd!: ParsePosition;
  message: string;
  constructor(message: string = '') {
    this.message = message;
  }
}
