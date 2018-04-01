import { TinyHtmlNode } from '../tiny-html-node';
import CommentParse from './comment-parse';
import ElementParse from './element-parse';
import { StringStream } from './string-stream';
import TextParse from './text-parse';

const parseClasss = [CommentParse, ElementParse, TextParse];
export function parseString(content: string) {
  const stream = new StringStream(content);
  return parseStream(stream);
}

export function parseStream(stream: StringStream) {
  const nodes: TinyHtmlNode[] = [];
  while (!stream.done) {
    for (const Parse of parseClasss) {
      if (Parse.canParse(stream)) {
        nodes.push(new Parse(stream).parse());
      }
    }
  }
}

export default parseString;
