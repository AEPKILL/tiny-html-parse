import ParseError from '../../src/parse/parse-error';

describe('ParseError', () => {
  const message = 'fire in the hole';
  test('ParseError::Constructor', () => {
    const error = new ParseError(message);
    expect(error.message).toBe(message);
  });
});
