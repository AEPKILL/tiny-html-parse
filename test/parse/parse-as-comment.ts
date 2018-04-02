import parseAsComment, {
  isCommentEndTag,
  isCommentTagStart
} from '../../src/parse/parse-as-comment';
import ParseError from '../../src/parse/parse-error';
import { StringStream } from '../../src/parse/string-stream';

describe('ParseAsComment', () => {
  const c1 = ' fire in the hole ';
  const c2 = `<!--${c1}-->`;
  const c3 = '<div></div>';
  const c4 = '-->';
  const s1 = new StringStream(c1);
  const s2 = new StringStream(c2);
  const s3 = new StringStream(c3);
  const s4 = new StringStream(c4);

  test('ParseAsComment::isCommentTagStart', () => {
    expect(isCommentTagStart(s1)).toBe(false);
    expect(isCommentTagStart(s2)).toBe(true);
    expect(isCommentTagStart(s3)).toBe(false);
    expect(isCommentTagStart(s4)).toBe(false);
  });

  test('ParseAsComment::isCommentEndTag', () => {
    expect(isCommentEndTag(s1)).toBe(false);
    expect(isCommentEndTag(s2)).toBe(false);
    expect(isCommentEndTag(s3)).toBe(false);
    expect(isCommentEndTag(s4)).toBe(true);
  });

  test('ParseAsComment::parseAsComment', () => {
    const n1 = parseAsComment(s2);
    const error = new ParseError(`[0:${c1.length}]: Unexpected end`);

    expect(n1.content).toBe(c1);
    expect(s2.pos).toBe(s2.content.length);
    expect(() => parseAsComment(s1.clone())).toThrow();

    error.errorStart = s1.getPositionDetail();
    try {
      parseAsComment(s1);
    } catch (e) {
      error.errorEnd = {
        line: 0,
        col: c1.length,
        pos: c1.length
      };
      expect(e).toEqual(error);
      expect(s1.pos).toEqual(c1.length);
    }
  });
});
