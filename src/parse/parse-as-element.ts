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

export default function parseAsElement(stream: StringStream) {
  const position = stream.getPositionDetail();
  const node = new TinyHtmlElementNode(readElementTagBeginName(stream));
  const error = new ParseError();
  node.meta.position = position;
  error.errorStart = position;

  // 解析属性
  readAttributes(stream, node);

  // 自闭合标签
  if (isElementTagSelfClose(stream)) {
    stream.skip(2);
    return {
      close: true,
      node
    };
  }

  // 特殊处理 script 和 style 标签，这两个标签的内容放入 text 字段中
  // 这两个标签没有子标签，属于闭合标签
  switch (node.tagName.toLowerCase()) {
    case 'script': {
      parseAsTextContentElement(stream, node);
      return {
        close: true,
        node
      };
    }
    case 'style': {
      parseAsTextContentElement(stream, node);
      return {
        close: true,
        node
      };
    }
  }

  // 跳过闭合符号 '>'
  stream.skip();

  // 等待闭合的标签
  return {
    close: false,
    node
  };
}

export function readElementTagBeginName(stream: StringStream) {
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

export function readAttributes(
  stream: StringStream,
  node: TinyHtmlElementNode
) {
  const parseAttrError = new ParseError();
  while (true) {
    if (stream.done) {
      const error = new ParseError();
      error.errorStart = node.meta.position!;
      error.errorEnd = stream.getPositionDetail();
      error.message = `[${stream.line}:${stream.col}]: Tag (${
        node.tagName
      }) unexpected end`;
      throw error;
    }

    stream.skipWhitespace();

    // 完成解析
    if (isElementTagSelfClose(stream) || isElementTagClose(stream)) {
      break;
    }

    const attrName = stream.readEscaped(
      (ch, s) =>
        isWhitespace(ch) ||
        ch === '=' ||
        ch === '<' ||
        isElementTagClose(s!) ||
        isElementTagSelfClose(s!)
    );

    if (attrName.length === 0) {
      parseAttrError.errorStart = stream.getPositionDetail();
      parseAttrError.errorEnd = stream
        .clone()
        .skip()
        .getPositionDetail();
      parseAttrError.message = `[${parseAttrError.errorStart.line}:${
        parseAttrError.errorStart.col
      }]: Tag <${node.tagName} ...> has unexpect attribute name token (${
        stream.current
      })`;
      throw parseAttrError;
    }
    // 跳过空白
    stream.skipWhitespace();

    // 完成对没有值的属性解析，例如 <checkbox checked/> 中的 checked
    if (stream.current !== '=') {
      node.attributes[attrName] = '';
      continue;
    }

    // 跳过等号
    stream.skip();

    // 跳过空白
    stream.skipWhitespace();

    // 开始解析 Attritube Vaule
    parseAttrError.errorStart = stream.getPositionDetail();

    const quote = stream.current;

    // 属性值必须以引号开头 " 或者 '
    if (!isQuote(quote)) {
      parseAttrError.errorEnd = stream.getPositionDetail();
      parseAttrError.message = `[${parseAttrError.errorStart.line}:${
        parseAttrError.errorStart.col
      }]: Attribute (${attrName}) expected a start quote`;
      throw parseAttrError;
    }

    // 跳过引号
    stream.skip();

    // 解析值
    node.attributes[attrName] = stream.readEscaped(quote);

    // 属性值必须以同等的引号结尾
    if (!isQuote(stream.current)) {
      parseAttrError.errorEnd = stream.getPositionDetail();
      parseAttrError.message = `[${parseAttrError.errorEnd.line}:${
        parseAttrError.errorEnd.col
      }]: Attribute (${attrName}) expected a end quote`;
      throw parseAttrError;
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
    error.message = `[${stream.line}:${
      stream.col
    }]: Tag end (</${tagName} ...) expected '>'`;
    throw error;
  }

  stream.skip();

  return tagName;
}

export function readElemetTagName(stream: StringStream) {
  let tagName = '';
  tagName = stream.readEscaped(ch => !elementTagStartReg.test(ch));
  tagName += stream.readEscaped(ch => !elementTagContentReg.test(ch));
  return tagName;
}

export function isElementTagEndStart(stream: StringStream) {
  const { content, pos } = stream;
  return content[pos] === '<' && content[pos + 1] === '/';
}

export function isElementTagSelfClose(stream: StringStream) {
  const { content, pos } = stream;
  return content[pos] === '/' && content[pos + 1] === '>';
}

export function isElementTagClose(stream: StringStream) {
  return stream.current === '>';
}
