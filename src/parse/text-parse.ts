import TinyHtmlTextNode from '../tiny-html-text-node';
import Parse from './parse';
import { StringStream } from './string-stream';

export default class TextParse extends Parse {
  parse() {
    const content = this.stream.readEscaped('<');
    return new TinyHtmlTextNode(content);
  }
  static canParse(stream: StringStream) {
    if (!stream.done && stream.current !== '<') {
      return true;
    }
    return false;
  }
}
