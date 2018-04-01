import TinyHtmlCommentNode from '../tiny-html-comment-node';
import ParseError from './parse-error';
import { StringStream } from './string-stream';

export function isCommentTagStart(stream: StringStream) {
  const { content, pos } = stream;
  return (
    content[pos] === '<' &&
    content[pos + 1] === '!' &&
    content[pos + 2] === '-' &&
    content[pos + 3] === '-'
  );
}

export function isCommentEndTag(stream: StringStream) {
  const { content, pos } = stream;
  return (
    content[pos] === '-' && content[pos + 1] === '-' && content[pos + 2] === '>'
  );
}

export default function parseAsComment(stream: StringStream) {
  const error = new ParseError('');
  let content = '';
  stream.skip(4);
  error.errorStart = stream.getPositionDetail();
  while (true) {
    if (isCommentEndTag(stream)) {
      stream.skip(3);
      break;
    }
    if (stream.done) {
      error.errorEnd = stream.getPositionDetail();
      error.message = `[${stream.line}:${stream.col}]: Unexpected end`;
      throw error;
    }
    content += stream.current;
    stream.next();
  }
  const node = new TinyHtmlCommentNode(content);
  node.meta.position = error.errorStart;
  return node;
}
