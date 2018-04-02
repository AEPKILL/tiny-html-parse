import TinyHtmlElementNode from '../tiny-html-element-node';
import { ParseOptions } from './index';
import parseAsComment, { isCommentTagStart } from './parse-as-comment';
import parseAsText, { isTextStart } from './parse-as-text';
import parseAsTextContentElement from './parse-as-text-content-element';
import ParseError from './parse-error';
import { StringStream } from './string-stream';
import { isQuote, isWhitespace } from './token';

const elementTagStartReg = /[a-zA-Z_]/;
const elementTagContentReg = /[0-9a-zA-Z_-]/;

export function isElementTagBeginStart(stream: StringStream) {
  const { content, pos } = stream;
  return stream.current === '<' && elementTagStartReg.test(content[pos + 1]);
}

export default function parseAsElement(
  stream: StringStream,
  option: ParseOptions = {}
) {
  const { skipWhitespaceText } = option;
  const position = stream.getPositionDetail();
  const node = new TinyHtmlElementNode(readElementTagBeginName(stream));
  const error = new ParseError();

  let closed = false;

  node.meta.position = position;
  error.errorStart = position;

  // 解析属性
  readAttributes(stream, node);

  // 标签自闭合
  if (isElementTagSelfClose(stream)) {
    stream.skip(2);
    return node;
  }

  // 跳过闭合符号 '>'
  stream.skip();

  // 特殊处理 script 和 style 标签，这两个标签的内容放入 text 字段中
  switch (node.tagName.toLowerCase()) {
    case 'script': {
      return parseAsTextContentElement(stream, node);
    }
    case 'style': {
      return parseAsTextContentElement(stream, node);
    }
  }

  // 解析 Children
  while (!stream.done) {
    if (skipWhitespaceText) {
      stream.skipWhitespace();
    }
    // 解析到标签闭合
    if (isElementTagEndStart(stream)) {
      const tagName = readElementTagEndName(stream);
      if (tagName !== node.tagName) {
        error.errorEnd = stream.getPositionDetail();
        error.message = `[${error.errorStart.line}:${
          error.errorStart.col
        }]: Tag name mismatch (<${node.tagName} ...>*</${tagName}>)`;
        throw error;
      }
      closed = true;
      break;
    }

    if (isTextStart(stream)) {
      node.appendChild(parseAsText(stream));
    } else if (isCommentTagStart(stream)) {
      node.appendChild(parseAsComment(stream));
    } else if (isElementTagBeginStart(stream)) {
      node.appendChild(parseAsElement(stream, option));
    }
  }

  // 标签未闭合
  if (!closed) {
    error.errorStart = node.meta.position!;
    error.errorEnd = stream.getPositionDetail();
    error.message = `[${error.errorEnd.line}:${
      error.errorEnd.col
    }]: Unexpected end, tag (${node.tagName}) not close.`;
    throw error;
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
  while (true) {
    stream.skipWhitespace();

    if (stream.done) {
      const error = new ParseError();
      error.errorStart = node.meta.position!;
      error.errorEnd = stream.getPositionDetail();
      error.message = `[${stream.line}:${stream.col}]:Tag (${
        node.tagName
      }) unexpected end`;
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

    if (stream.done) {
      continue;
    }

    if (isWhitespace(stream.current!)) {
      stream.skipWhitespace();
    }

    // 完成对没有值的属性解析，例如 <checkbox checked/> 中的 checked
    if (stream.current !== '=') {
      node.attributes[attrName] = '';
      continue;
    }

    // 跳过等号
    stream.skip();

    // 开始解析 Attritube Vaule
    parseAttrItemError.errorStart = stream.getPositionDetail();

    if (isWhitespace(stream.current)) {
      stream.skipWhitespace();
    }

    const quote = stream.current;

    // 属性值必须以引号开头 " 或者 '
    if (!isQuote(quote)) {
      stream.skipWhitespace();
      parseAttrItemError.errorEnd = stream.getPositionDetail();
      parseAttrItemError.message = `[${parseAttrItemError.errorStart.line}:${
        parseAttrItemError.errorStart.col
      }]: Attribute (${attrName}) expected a start quote`;
      throw parseAttrItemError;
    }

    // 跳过引号
    stream.skip();

    // 解析值
    node.attributes[attrName] = stream.readEscaped(quote);

    // 属性值必须以同等的引号结尾
    if (!isQuote(stream.current)) {
      parseAttrItemError.errorEnd = stream.getPositionDetail();
      parseAttrItemError.message = `[${parseAttrItemError.errorStart.line}:${
        parseAttrItemError.errorStart.col
      }]: Attribute (${attrName}) expected a end quote`;
      throw parseAttrItemError;
    }

    // 跳过引号
    stream.skip();
  }
}
export function readElementTagEndName(stream: StringStream) {
  const error = new ParseError();
  let tagName = '';

  error.errorStart = stream.getPositionDetail();
  stream.skip(2);
  tagName = readElemetTagName(stream);

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

  tagName = stream.readEscaped(ch => !elementTagStartReg.test(ch));
  tagName += stream.readEscaped(ch => !elementTagContentReg.test(ch));
  return tagName;
}

export function isElementTagEndStart(stream: StringStream) {
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
