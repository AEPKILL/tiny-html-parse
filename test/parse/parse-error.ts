import { StringStream } from '../../src';
import ParseError from '../../src/parse/parse-error';

describe('ParseError', () => {
  const message = 'fire in the hole';
  test('ParseError::Constructor', () => {
    const stream = new StringStream('');
    let error = new ParseError(message);

    expect(error.message).toBe(`[??:??]: ${message}`);
    error.errorStart = stream.getPositionDetail();
    expect(error.message).toBe(`[??:??]: ${message}`);
    error.errorEnd = stream.getPositionDetail();
    expect(error.message).toBe(`[1:1]: ${message}`);
    error.messagePositon = stream.getPositionDetail();
    expect(error.message).toBe(`[1:1]: ${message}`);

    error = new ParseError('');
    expect(error.message).toBe(`[??:??]: Unkown error`);
  });
});
