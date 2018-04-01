export interface ParsePosition {
  line: number;
  col: number;
  pos: number;
}
export default class ParseError extends Error {
  errorStart!: ParsePosition;
  errorEnd!: ParsePosition;
  constructor(message: string = '') {
    super(message);
  }
}
