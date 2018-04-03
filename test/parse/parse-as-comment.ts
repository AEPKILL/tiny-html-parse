import parseAsComment, {
  isCommentEndTag,
  isCommentTagStart
} from '../../src/parse/parse-as-comment';
import ParseError from '../../src/parse/parse-error';
import { StringStream } from '../../src/parse/string-stream';
import { getRealMessage } from '../utils/utils';

function parseComment(html: string) {
  return parseAsComment(new StringStream(html));
}

function getParseError(html) {
  try {
    parseComment(html);
  } catch (e) {
    return e as ParseError;
  }
}

describe('ParseAsComment', () => {
  test('ParseAsComment::isCommentTagStart', () => {
    expect(isCommentTagStart(new StringStream(''))).toBe(false);
    expect(isCommentTagStart(new StringStream('<!--xxxx-->'))).toBe(true);
    expect(isCommentTagStart(new StringStream('<div></div>'))).toBe(false);
    expect(isCommentTagStart(new StringStream('-->'))).toBe(false);
  });

  test('ParseAsComment::isCommentEndTag', () => {
    expect(isCommentEndTag(new StringStream(''))).toBe(false);
    expect(isCommentEndTag(new StringStream('-->'))).toBe(true);
    expect(isCommentEndTag(new StringStream('<div>'))).toBe(false);
    expect(isCommentEndTag(new StringStream('<!--'))).toBe(false);
  });

  test('ParseAsComment::parseAsComment', () => {
    const comment = parseComment('<!--hello-->');
    expect(comment.content).toBe('hello');

    const content = '<!--hello';
    const error = getParseError(content);
    expect(getRealMessage(error)).toBe('Comment tag has unexpected end');
    expect(error.errorStart.pos).toBe(0);
    expect(error.errorEnd.pos).toBe(content.length);
  });
});
