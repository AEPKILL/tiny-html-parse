import TinyHtmlElementNode from '../tiny-html-element-node';
import parseAsComment, { isCommentTagStart } from './parse-as-comment';
import parseAsText, { isTextStart } from './parse-as-text';
import ParseError from './parse-error';
import { StringStream } from './string-stream';
import { isQuote, isWhitespace } from './token';

const elementTagStartReg = /[a-zA-Z]/;
const elementTagContentReg = /[a-zA-Z]-/;

export function isElementTagBeginStart(stream: StringStream) {
  const { content, pos } = stream;
  return stream.current === '<' && elementTagStartReg.test(content[pos + 1]);
}

export default function parseAsElement(stream: StringStream) {
  const position = stream.getPositionDetail();
  const node = new TinyHtmlElementNode(readElementTagBeginName(stream));

  node.meta.position = position;

  readAttributes(stream, node);

  if (isElementTagSelfClose(stream)) {
    stream.skip(2);
    return node;
  }

  stream.skip();

  const error = new ParseError();

  while (!stream.done) {
    error.errorStart = stream.getPositionDetail();
    if (isElementTagEndStart(stream)) {
      const tagName = readElementTagEndName(stream);
      if (tagName !== node.tagName) {
        error.errorEnd = stream.getPositionDetail();
        error.message = `[${node.meta.position.line}:${
          node.meta.position.col
        }]: Tagname (${node.tagName}) mismatch`;
        throw error;
      }
      break;
    }
    if (isTextStart(stream)) {
      node.appendChild(parseAsText(stream));
    } else if (isCommentTagStart(stream)) {
      node.appendChild(parseAsComment(stream));
    } else if (isElementTagBeginStart(stream)) {
      node.appendChild(parseAsElement(stream));
    }
  }

  return node;
}

function readElementTagBeginName(stream: StringStream) {
  const error = new ParseError('');
  let tagName = '';

  error.errorStart = stream.getPositionDetail();
  stream.skip();
  tagName = readElemetTagName(stream);

  if (tagName.length <= 0) {
    error.errorEnd = stream.getPositionDetail();
    error.message = `[${stream.line}:${
      stream.col
    }]: Tag begin name can't be empty`;
    throw error;
  }

  return tagName;
}

function readAttributes(stream: StringStream, node: TinyHtmlElementNode) {
  const error = new ParseError();
  error.errorStart = stream.getPositionDetail();
  while (true) {
    stream.skipWhitespace();

    if (stream.done) {
      error.errorEnd = stream.getPositionDetail();
      error.message = `[${stream.line}:${stream.col}]: Unexpected end`;
      throw error;
    }

    if (isElementTagSelfClose(stream) || isElementTagClose(stream)) {
      break;
    }

    const parseAttrItemError = new ParseError();
    const attrName = stream.readEscaped(
      (ch, s) =>
        isWhitespace(ch) ||
        ch === '=' ||
        isElementTagClose(s!) ||
        isElementTagSelfClose(s!)
    );

    parseAttrItemError.errorStart = stream.getPositionDetail();

    if (stream.done) {
      continue;
    }

    if (isWhitespace(stream.current!)) {
      stream.skipWhitespace();
    }

    if (stream.current !== '=') {
      node.attributes[attrName] = '';
      continue;
    }

    stream.skip();

    if (isWhitespace(stream.current)) {
      stream.skipWhitespace();
    }

    const quote = stream.current;

    if (!isQuote(quote)) {
      stream.skipWhitespace();
      parseAttrItemError.errorEnd = stream.getPositionDetail();
      parseAttrItemError.message = `[${parseAttrItemError.errorStart.line}:${
        parseAttrItemError.errorStart.col
      }]: Attribute (${attrName}) expected a start quote`;
      throw parseAttrItemError;
    }

    stream.skip();

    node.attributes[attrName] = stream.readEscaped(quote);

    if (!isQuote(stream.current)) {
      parseAttrItemError.errorEnd = stream.getPositionDetail();
      parseAttrItemError.message = `[${parseAttrItemError.errorStart.line}:${
        parseAttrItemError.errorStart.col
      }]: Attribute (${attrName}) expected a end quote`;
      throw parseAttrItemError;
    }

    stream.skip();
  }
}

function readElementTagEndName(stream: StringStream) {
  const error = new ParseError();
  error.errorStart = stream.getPositionDetail();
  stream.skip(2);
  const tagName = readElemetTagName(stream);

  if (tagName.length <= 0) {
    error.errorEnd = stream.getPositionDetail();
    error.message = `[${stream.line}:${
      stream.col
    }]: Tag end name can't be empty`;
    throw error;
  }

  stream.skipWhitespace();

  if (stream.current !== '>') {
    error.errorEnd = stream.getPositionDetail();
    error.message = `[${stream.line}:${stream.col}]: Tag end expected '>' `;
    throw error;
  }

  stream.skip();

  return tagName;
}

function readElemetTagName(stream: StringStream) {
  let tagName = '';
  tagName = stream.readEscaped(ch => !/[0-9a-zA-z]/.test(ch));
  tagName += stream.readEscaped(ch => !/[0-9a-zA-z-]/.test(ch));
  return tagName;
}

function isElementTagEndStart(stream: StringStream) {
  const { content, pos } = stream;
  return content[pos] === '<' && content[pos + 1] === '/';
}

function isElementTagSelfClose(stream: StringStream) {
  const { content, pos } = stream;
  return content[pos] === '/' && content[pos + 1] === '>';
}

function isElementTagClose(stream: StringStream) {
  return stream.current === '>';
}
