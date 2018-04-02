import TinyHtmlTextNode from '../tiny-html-text-node';
import { StringStream } from './string-stream';

export function isTextStart(stream: StringStream) {
  return !stream.done && stream.current !== '<';
}

export default function parseAsText(stream: StringStream) {
  const position = stream.getPositionDetail();
  let content = '';
  let node: TinyHtmlTextNode;

  // 不要用 stream.readEscaped('<')
  // <div>\</div> 这种情况会识别错误

  while (!stream.done) {
    if (stream.current === '<') {
      break;
    }
    content += stream.current;
    stream.next();
  }

  node = new TinyHtmlTextNode(content);
  node.meta.position = position;

  return node;
}
