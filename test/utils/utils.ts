import parseAsElement from '../../src/parse/parse-as-element';
import ParseError from '../../src/parse/parse-error';
import { StringStream } from '../../src/parse/string-stream';

export function getRealMessage(error: ParseError) {
  // tslint:disable-next-line:no-any
  return (error as any)._message as string;
}
