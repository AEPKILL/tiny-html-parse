import TinyHtmlElementNode from '../tiny-html-element-node';
import {
  isElementTagEndStart,
  readElementTagEndName
} from './parse-as-element';
import ParseError from './parse-error';
import { StringStream } from './string-stream';

export default function parseAsTextContentElement(
  stream: StringStream,
  node: TinyHtmlElementNode
) {
  const error = new ParseError();
  let text = '';
  error.errorStart = stream.getPositionDetail();
  while (!stream.done) {
    if (isElementTagEndStart(stream)) {
      // 尝试读取 tagEndName
      try {
        const tempStream = stream.clone();
        const tagName = readElementTagEndName(tempStream);
        if (tagName === node.tagName) {
          stream.skip(tempStream.pos - stream.pos);
          node.text = text;
          return node;
        }
      } catch {
        text += '</';
        stream.skip(2);
      }
    } else {
      text += stream.current;
    }
    stream.next();
  }
  error.errorEnd = stream.getPositionDetail();
  error.message = `Tag <${node.tagName}> unexpected end`;
  throw error;
}
