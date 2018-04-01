import { TinyHtmlNode } from '../tiny-html-node';
import parseAsComment, { isCommentTagStart } from './parse-as-comment';
import parseAsElement, { isElementTagBeginStart } from './parse-as-element';
import parseAsText, { isTextStart } from './parse-as-text';
import { StringStream } from './string-stream';

export function parseString(content: string) {
  const stream = new StringStream(content);
  return parseStream(stream);
}

export function parseStream(stream: StringStream) {
  const nodes: TinyHtmlNode[] = [];
  while (!stream.done) {
    if (isTextStart(stream)) {
      nodes.push(parseAsText(stream));
    } else if (isCommentTagStart(stream)) {
      nodes.push(parseAsComment(stream));
    } else if (isElementTagBeginStart(stream)) {
      nodes.push(parseAsElement(stream));
    }
  }
  return nodes;
}

export default parseString;
