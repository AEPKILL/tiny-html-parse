import TinyHtmlCommentNode from '../tiny-html-comment-node';
import Parse from './parse';
import ParseError from './parse-error';
import { StringStream } from './string-stream';
export default class CommentParse extends Parse {
  parse() {
    return new TinyHtmlCommentNode(this.readCommentContent());
  }
  private readCommentContent() {
    const stream = this.stream;
    const error = new ParseError('');
    let str = '';

    stream.skip(4);
    error.errorStart = stream.getPositionDetail();

    while (true) {
      if (CommentParse.isEndTag(stream)) {
        stream.skip(3);
        break;
      }
      if (stream.done) {
        error.errorEnd = stream.getPositionDetail();
        error.message = `[${stream.line}:${stream.col}]: Unexpected end`;
        throw error;
      }
      str += stream.current;
      stream.next();
    }

    return str;
  }
  static isStartTag(stream: StringStream) {
    const { content, pos } = stream;
    return (
      content[pos] === '<' &&
      content[pos + 1] === '!' &&
      content[pos + 2] === '-' &&
      content[pos + 3] === '-'
    );
  }
  static isEndTag(stream: StringStream) {
    const { content, pos } = stream;
    return (
      content[pos] === '-' &&
      content[pos + 1] === '-' &&
      content[pos + 2] === '>'
    );
  }
  static canParse(stream: StringStream) {
    return CommentParse.isStartTag(stream);
  }
}
