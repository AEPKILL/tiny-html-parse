import parseAsElement from '../../src/parse/parse-as-element';
import ParseError from '../../src/parse/parse-error';
import { StringStream } from '../../src/parse/string-stream';
import TinyHtmlElementNode from '../../src/tiny-html-element-node';
import { getRealMessage } from '../utils/utils';

export function parseElement(html: string) {
  return parseAsElement(new StringStream(html));
}
export function getParseError(html) {
  try {
    parseElement(html);
  } catch (e) {
    return e as ParseError;
  }
}

describe('ParseAsElement', () => {
  test('legal tag', () => {
    const node = new TinyHtmlElementNode('div');
    expect(parseElement(`<div>`).node.tagName).toEqual(node.tagName);
    node.attributes.id = 'main';
    expect(parseElement(`<div id="main">`).node.attributes).toEqual(
      node.attributes
    );
    node.attributes.name = `tokyo ' hot `;
    expect(
      parseElement(`<div id="main" name="tokyo ' hot ">`).node.attributes
    ).toEqual(node.attributes);

    expect(parseElement(`<input />`).close).toBe(true);
    expect(parseElement(`<input/>`).close).toBe(true);
    expect(parseElement('<div></div>').close).toBe(false);

    expect(
      parseElement('<script>const xxx="<div>fuck</div>"</script>').close
    ).toBe(true);
    expect(
      parseElement('<script>const xxx="<div>fuck</div>"</script>').node.text
    ).toEqual(`const xxx="<div>fuck</div>"`);

    expect(parseElement('<style>.a{color:red;}</style>').close).toBe(true);
    expect(parseElement('<style>.a{color:red;}</style>').node.text).toBe(
      '.a{color:red;}'
    );
  });

  test('illegal tag', () => {
    let error: ParseError = getParseError('<div <>');
    expect(error.errorStart.pos).toBe(5);
    expect(error.errorEnd.pos).toBe(5);
    expect(getRealMessage(error)).toBe(
      `Tag <div ...> attribute name has unexpected token '<'`
    );

    error = getParseError('<div id=23333>');
    expect(error.messagePositon).toEqual(error.errorStart);
    expect(error.errorStart.pos).toBe(5);
    expect(error.errorEnd.pos).toBe(8);
    expect(getRealMessage(error)).toBe(
      `Tag div attribute 'id' required a start quotes`
    );

    error = getParseError('<div!');
    expect(error.errorStart.pos).toBe(1);
    expect(error.errorEnd.pos).toBe(4);
    expect(getRealMessage(error)).toBe(`Token '!' can't be tag name`);

    error = getParseError('<div id="23333>');
    expect(error.messagePositon).toEqual(error.errorStart);
    expect(error.errorStart.pos).toBe(5);
    expect(error.errorEnd.pos).toBe(15);
    expect(getRealMessage(error)).toBe(
      `Tag div attribute 'id' required a end quotes`
    );

    error = getParseError('<script id="23333">const xxx="<div>fuck</div>"');
    expect(error.errorStart.pos).toBe(0);
    expect(error.errorEnd.pos).toBe(46);
    expect(getRealMessage(error)).toBe(`Tag <script> unexpected end`);
  });
});
