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
      // 尝试读取 tagEndName
      try {
        const tempStream = stream.clone();
        const tagName = readElementTagEndName(tempStream);
        if (tagName === node.tagName) {
          stream.skip(tempStream.pos - stream.pos);
          break;
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
  node.text = text;
  return node;
}
