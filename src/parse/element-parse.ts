import Dictionary from '../model/dictionary';
import TinyHtmlElementNode from '../tiny-html-element-node';
import CommentParse from './comment-parse';
import Parse from './parse';
import ParseError from './parse-error';
import { StringStream } from './string-stream';
import TextParse from './text-parse';
import { isQuote, isWhitespace } from './token';

export default class ElementParse extends Parse {
  tagNameStack: string[] = [];
  parse() {
    const node = new TinyHtmlElementNode(this.readTagStartName());
    const stream = this.stream;
    this.tagNameStack.push(node.tagName);
    this.readAttributes(node);
    if (this.isSelfClose()) {
      this.stream.skip(2);
      return node;
    } else {
      this.stream.skip(1);
    }

    const error = new ParseError();

    while (!stream.done) {
      error.errorStart = this.stream.getPositionDetail();
      if (this.isEndTag()) {
        const tagName = this.readTagEndName();
        const lastTagStartName: string = this.tagNameStack.pop();
        if (tagName !== lastTagStartName) {
          error.errorEnd = stream.getPositionDetail();
          error.message = `[${stream.line}:${
            stream.col
          }]: Tagname (${tagName}) mismatch`;
        }
        return node;
      }
      if (this.tagNameStack.length === 0) {
        break;
      } else if (TextParse.canParse(this.stream)) {
        node.appendChild(new TextParse(this.stream).parse());
      } else if (CommentParse.canParse(this.stream)) {
        node.appendChild(new CommentParse(this.stream).parse());
      } else if (ElementParse.canParse(this.stream)) {
        node.appendChild(this.parse());
      }
    }
    if (this.tagNameStack.length) {
      error.errorEnd = stream.getPositionDetail();
      error.message = error.message = `[${error.errorStart.line}:${
        error.errorStart.col
      }]: Tag (${node.tagName}) mismatch `;
      throw error;
    }
    return node;
  }
  private readTagEndName() {
    const error = new ParseError();
    const stream = this.stream;
    error.errorStart = stream.getPositionDetail();

    stream.skip();

    const tagName = this.readTagStartName();

    stream.skipWhitespace();

    if (stream.current !== '>') {
      error.errorEnd = stream.getPositionDetail();
      error.message = `[${stream.line}:${stream.col}]: Expected '>' `;
      throw error;
    }
    stream.skip();
    return tagName;
  }
  private readTagStartName() {
    const error = new ParseError('');
    const stream = this.stream;
    let tagName = '';

    error.errorStart = this.stream.getPositionDetail();

    stream.skip();

    tagName = stream.readEscaped(ch => !/[a-zA-z-]/.test(ch));

    if (tagName.length <= 0) {
      error.errorEnd = stream.getPositionDetail();
      error.message = `[${stream.line}:${stream.col}]: Tag name can't be empty`;
      throw error;
    }
    if (stream.done) {
      error.errorEnd = stream.getPositionDetail();
      error.message = `[${stream.line}:${stream.col}]: Unexpected end`;
      throw error;
    }
    return tagName;
  }
  private readAttributes(node: TinyHtmlElementNode) {
    const error = new ParseError();
    const stream = this.stream;
    error.errorStart = stream.getPositionDetail();
    while (true) {
      stream.skipWhitespace();

      if (stream.done) {
        error.errorEnd = stream.getPositionDetail();
        error.message = `[${stream.line}:${stream.col}]: Unexpected end`;
        throw error;
      }

      if (this.isSelfClose() || this.isClose()) {
        break;
      }

      const parseAttrItemError = new ParseError();
      const attrName = stream.readEscaped(
        ch =>
          isWhitespace(ch) || ch === '=' || this.isSelfClose() || this.isClose()
      );

      parseAttrItemError.errorStart = stream.getPositionDetail();

      if (stream.done) {
        continue;
      }

      if (isWhitespace(stream.current)) {
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
        }]: Attribute (${attrName}) expected  a end quote`;
        throw parseAttrItemError;
      }

      stream.skip();
    }
  }
  private isClose() {
    return this.stream.current === '>';
  }
  private isSelfClose() {
    const { content, pos } = this.stream;
    return content[pos] === '/' && content[pos + 1] === '>';
  }
  private isEndTag() {
    const { content, pos } = this.stream;
    return content[pos] === '<' && content[pos + 1] === '/';
  }
  static isStartTag(stream: StringStream) {
    return (
      stream.current === '<' && /[z-zA-z]/.test(stream.content[stream.pos + 1])
    );
  }
  static canParse(stream: StringStream) {
    return ElementParse.isStartTag(stream);
  }
}
