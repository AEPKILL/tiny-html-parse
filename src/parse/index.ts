import { TinyHtmlNode } from '../tiny-html-node';
import parseAsComment, { isCommentTagStart } from './parse-as-comment';
import parseAsElement, { isElementTagBeginStart } from './parse-as-element';
import parseAsText, { isTextStart } from './parse-as-text';
import { StringStream } from './string-stream';

export interface ParseOptions {
  skipWhitespaceText?: boolean;
}

export function parseString(content: string, option?: ParseOptions) {
  const stream = new StringStream(content);
  return parseStream(stream, option);
}

export function parseStream(stream: StringStream, option: ParseOptions = {}) {
  const { skipWhitespaceText } = option;
  const nodes: TinyHtmlNode[] = [];
  while (!stream.done) {
    if (skipWhitespaceText) {
      stream.skipWhitespace();
    }
    if (isTextStart(stream)) {
      nodes.push(parseAsText(stream));
    } else if (isCommentTagStart(stream)) {
      nodes.push(parseAsComment(stream));
    } else if (isElementTagBeginStart(stream)) {
      nodes.push(parseAsElement(stream, option));
    }
  }
  return nodes;
}

export default parseString;
