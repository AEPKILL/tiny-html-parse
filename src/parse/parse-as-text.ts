import TinyHtmlTextNode from '../tiny-html-text-node';
import { StringStream } from './string-stream';

export function isTextStart(stream: StringStream) {
  return !stream.done && stream.current !== '<';
}

export default function parseAsText(stream: StringStream) {
  const position = stream.getPositionDetail();
  const content = stream.readEscaped('<');
  const node = new TinyHtmlTextNode(content);
  node.meta.position = position;
  return node;
}
