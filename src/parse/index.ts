import { TinyHtmlNode } from '../tiny-html-node';
import { StringStream } from './string-stream';

export function parseString(content: string) {
  const stream = new StringStream(content);
  return parseStream(stream);
}

export function parseStream(stream: StringStream) {
  const nodes: TinyHtmlNode[] = [];
}

export default parseString;
