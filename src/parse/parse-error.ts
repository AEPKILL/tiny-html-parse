export interface ParseErrorPosition {
  line: number;
  col: number;
  pos: number;
}
export default class ParseError extends Error {
  errorStart: ParseErrorPosition;
  errorEnd: ParseErrorPosition;
  constructor(message: string = '') {
    super(message);
  }
}
