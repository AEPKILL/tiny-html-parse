import * as token from '../../src/parse/token';

describe('token', () => {
  test('Token::isBreakLine', () => {
    expect(token.isBreakLine('\n')).toBe(true);
    expect(token.isBreakLine('\r')).toBe(false);
    expect(token.isBreakLine('x')).toBe(false);
  });
  test('Token::isWhitespace', () => {
    expect(token.isWhitespace('\n')).toBe(true);
    expect(token.isWhitespace(' ')).toBe(true);
    expect(token.isWhitespace('\t')).toBe(true);
    expect(token.isWhitespace('f')).toBe(false);
  });
  test('Token::isEscaped', () => {
    expect(token.isEscaped('\\')).toBe(true);
    expect(token.isEscaped('/')).toBe(false);
    expect(token.isEscaped('x')).toBe(false);
  });
  test('Token::isQuote', () => {
    expect(token.isQuote(`'`)).toBe(true);
    expect(token.isQuote('"')).toBe(true);
    expect(token.isQuote('e')).toBe(false);
  });
});
