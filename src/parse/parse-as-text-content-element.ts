import TinyHtmlElementNode from '../tiny-html-element-node';
import {
  isElementTagEndStart,
  readElementTagEndName
} from './parse-as-element';
import { StringStream } from './string-stream';

export default function parseAsTextContentElement(
  stream: StringStream,
  node: TinyHtmlElementNode
) {
  let text = '';
  while (!stream.done) {
    if (isElementTagEndStart(stream)) {
      const tempStream = stream.clone();
      try {
        const tagName = readElementTagEndName(tempStream);
        if (tagName === node.tagName) {
          stream.skip(tempStream.pos - stream.pos);
          break;
        }
      } catch {
        // nothing to do
      }
    }
    text += stream.current;
    stream.next();
  }
  node.text = text;
  return node;
}
