import TinyHtmlTextNode from '../tiny-html-text-node';
import { isCommentTagStart } from './parse-as-comment';
import {
  isElementTagBeginStart,
  isElementTagEndStart
} from './parse-as-element';
import { StringStream } from './string-stream';

export function isTextStart(stream: StringStream) {
  return !(
    isElementTagBeginStart(stream) ||
    isCommentTagStart(stream) ||
    isElementTagEndStart(stream)
  );
}

export default function parseAsText(stream: StringStream) {
  const position = stream.getPositionDetail();
  let content = '';
  let node: TinyHtmlTextNode;

  // 不要用 stream.readEscaped('<')
  // <div>\</div> 这种情况会识别错误

  while (!stream.done) {
    if (stream.current === '<' && !isTextStart(stream)) {
      break;
    }
    content += stream.current;
    stream.next();
  }

  node = new TinyHtmlTextNode(content);
  node.meta.position = position;

  return node;
}
