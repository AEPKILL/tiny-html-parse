import { StringStream } from '../../src';

describe('StringStream', () => {
  test('normal', () => {
    const content = 'ae\\"p"kill\n23333';
    const stream = new StringStream(content);
    const tempStream = stream.clone();

    expect(stream).not.toBe(tempStream);
    expect(stream).toEqual(tempStream);
    expect(stream.content).toEqual(content);
    expect(stream.line).toBe(0);
    expect(stream.col).toBe(0);
    expect(stream.pos).toBe(0);
    expect(stream.readEscaped(`"`)).toBe(`ae"p`);
  });
});
