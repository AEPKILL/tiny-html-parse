import TinyHtmlNode from '../tiny-html-node';
import { StringStream } from './string-stream';
import { isEscaped } from './token';

export abstract class Parse {
  protected stream: StringStream;
  constructor(stream: StringStream) {
    this.stream = stream;
  }
  abstract parse(): TinyHtmlNode;

  // warn: overwite this static method.
  static canParse(stream: StringStream) {
    console.warn(`You need overwrite [${this.name}.canParse] method`);
    return false;
  }
}

export default Parse;
