import parseAsText, { isTextStart } from '../../src/parse/parse-as-text';
import { StringStream } from '../../src/parse/string-stream';
import { NODE_TYPE } from '../../src/tiny-html-node';

describe('ParseAsText', () => {
  const c1 = 'just text content';
  const c2 = '<div></div>';
  test('ParseAsText::isTextStart', () => {
    expect(isTextStart(new StringStream(c1))).toBe(true);
    expect(isTextStart(new StringStream(c2))).toBe(false);
  });
  test('ParseAsText::parseAsText', () => {
    const s1 = new StringStream(c1);
    const s2 = new StringStream(c2);
    const n1 = parseAsText(s1);
    const n2 = parseAsText(s2);

    expect(n1.text).toBe(c1);
    expect(n1.nodeType).toBe(NODE_TYPE.TEXT);
    expect(n2.text).toBe('');
    expect(s2.pos).toBe(0);
  });
});
