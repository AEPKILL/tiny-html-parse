import { TinyHtmlElementNode } from '..';
import { Stack } from '../stack';
import { TinyHtmlNode } from '../tiny-html-node';
import parseAsComment, { isCommentTagStart } from './parse-as-comment';
import parseAsElement, {
  isElementTagBeginStart,
  isElementTagEndStart,
  readElementTagEndName
} from './parse-as-element';
import parseAsText, { isTextStart } from './parse-as-text';
import ParseError from './parse-error';
import { StringStream } from './string-stream';

export interface ParseOptions {
  skipWhitespace?: boolean;
}

export function parseString(content: string, option?: ParseOptions) {
  const stream = new StringStream(content);
  return parseStream(stream, option);
}

export function parseStream(stream: StringStream, option: ParseOptions = {}) {
  const { skipWhitespace } = option;
  const nodes: TinyHtmlNode[] = [];
  const stack = new Stack<TinyHtmlElementNode>();
  const error = new ParseError();

  while (true) {
    if (skipWhitespace) {
      stream.skipWhitespace();
    }
    if (stream.done) {
      break;
    }
    if (isTextStart(stream)) {
      if (stack.isEmpty()) {
        nodes.push(parseAsText(stream));
      } else {
        stack.top!.appendChild(parseAsText(stream));
      }
    } else if (isCommentTagStart(stream)) {
      if (stack.isEmpty()) {
        nodes.push(parseAsComment(stream));
      } else {
        stack.top!.appendChild(parseAsComment(stream));
      }
    } else if (isElementTagBeginStart(stream)) {
      const result = parseAsElement(stream);
      const { close, node } = result;
      if (stack.isEmpty()) {
        if (close) {
          nodes.push(node);
        } else {
          stack.push(node);
        }
      } else {
        stack.top!.appendChild(node);
        if (!close) {
          stack.push(node);
        }
      }
    } else if (isElementTagEndStart(stream)) {
      const startPosition = stream.getPositionDetail();
      const tagName = readElementTagEndName(stream);
      const node = stack.top!;
      if (stack.isEmpty()) {
        error.errorStart = startPosition;
        error.messagePositon = startPosition;
        error.errorEnd = stream.getPositionDetail();
        error.message = `Unexpected close tag '</${tagName}>'`;
        throw error;
      }
      if (tagName !== node.tagName) {
        error.errorStart = node.meta.position!;
        error.errorEnd = stream.getPositionDetail();
        error.message = `Tag name mismatch '<${
          node.tagName
        }${node.getAttributeString()}>...</${tagName}>'`;
        throw error;
      }
      stack.pop();
      if (stack.isEmpty()) {
        nodes.push(node);
      }
    }
  }

  if (!stack.isEmpty()) {
    const node = stack.top!;
    error.messagePositon = node.meta.position!;
    error.errorStart = node.meta.position!;
    error.errorEnd = stream.getPositionDetail();
    error.message = `Tag <${
      node.tagName
    }${node.getAttributeString()}> not close`;
    throw error;
  }

  return nodes;
}

export default parseString;
