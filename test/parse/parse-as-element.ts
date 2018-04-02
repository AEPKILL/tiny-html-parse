// import parseAsElement, {
//   isElementTagBeginStart,
//   isElementTagEndStart,
//   readElementTagEndName
// } from '../../src/parse/parse-as-element';
// import ParseError from '../../src/parse/parse-error';
// import { StringStream } from '../../src/parse/string-stream';
// import TinyHtmlElementNode from '../../src/tiny-html-element-node';
// import { TinyHtmlTextNode } from '../../src/tiny-html-text-node';

describe('ParseAsElement', () => {
  test('', () => {
    // todo
  });
  //   const s1 = new StringStream('fire the hole');
  //   const s2 = new StringStream('< div></div>');
  //   const s3 = new StringStream(`<script `);
  //   const s4 = new StringStream('<div></div>');
  //   const s5 = new StringStream('</div>');
  //   const s6 = new StringStream('<   /');
  //   const s7 = new StringStream('</    ');
  //   const s8 = new StringStream('</div');

  //   test('ParseAsElement::isElementTagBeginStart', () => {
  //     expect(isElementTagBeginStart(s1)).toBe(false);
  //     expect(isElementTagBeginStart(s2)).toBe(false);
  //     expect(isElementTagBeginStart(s3)).toBe(true);
  //     expect(isElementTagBeginStart(s4)).toBe(true);
  //   });

  //   test('ParseAsElement::isElementTagEndStart', () => {
  //     expect(isElementTagEndStart(s6)).toBe(false);
  //     expect(isElementTagEndStart(s5)).toBe(true);
  //   });

  //   test('ParseAsElement::readElementTagEndName', () => {
  //     // </div>
  //     expect(readElementTagEndName(s5.clone())).toBe('div');

  //     // </
  //     expect(() => readElementTagEndName(s7.clone())).toThrow();
  //     try {
  //       readElementTagEndName(s7.clone());
  //     } catch (e) {
  //       const error: ParseError = e;
  //       expect(error.message).toBe(`[0:2]: Tag end name can't be empty`);
  //     }

  //     // </div
  //     expect(() => readElementTagEndName(s8.clone())).toThrow();
  //     try {
  //       readElementTagEndName(s8.clone());
  //     } catch (e) {
  //       const error: ParseError = e;
  //       expect(error.errorStart).toEqual({
  //         line: 0,
  //         col: 0,
  //         pos: 0
  //       });
  //       expect(error.errorEnd).toEqual({
  //         line: 0,
  //         col: 5,
  //         pos: 5
  //       });
  //       expect(error.message).toBe(`[0:5]: Tag end expected '>'`);
  //     }
  //   });

  //   test('ParseAsElement::parseAsElement -- element', () => {
  //     const ss1 = new StringStream(
  //       '<div name="xxxxx" checked><span>aepkill</span><!-- yes --></div>'
  //     );
  //     const ss2 = new StringStream('<input checked/>');
  //     const n1 = parseAsElement(ss1);
  //     const n2 = parseAsElement(ss2);

  //     expect(n1.tagName).toBe('div');
  //     expect(n1.attributes).toEqual({
  //       name: 'xxxxx',
  //       checked: ''
  //     });

  //     const span = n1.children[0] as TinyHtmlElementNode;
  //     expect(span.tagName).toBe('span');
  //     expect(span.parent).toBe(n1);

  //     const text = span.children[0] as TinyHtmlTextNode;
  //     expect(text.text).toBe('aepkill');

  //     expect(n2.tagName).toBe('input');
  //     expect(n2.attributes.checked).toBe('');
  //   });
  //   test('ParseAsElement::parseAsElement -- script', () => {
  //     const scriptContent = `
  //       const name = "aepkill";
  //       function aepkill(){
  //         // fire in the hole
  //       }
  //     `;
  //     const ss1 = new StringStream(
  //       `<body><script>${scriptContent}</script></body>`
  //     );
  //     const node = parseAsElement(ss1);
  //     const script = node.children[0] as TinyHtmlElementNode;

  //     expect(script.tagName).toBe('script');
  //     expect(script.text).toBe(scriptContent);
  //   });
  //   test('ParseAsElement::parseAsElement -- tag_attr_error', () => {
  //     const ss1 = new StringStream('<div name="xxxxx checked></div>');
  //     const ss2 = new StringStream('<div name=xxxxx ></div>');
  //     expect(() => parseAsElement(ss1.clone())).toThrow();
  //     try {
  //       parseAsElement(ss1.clone());
  //     } catch (e) {
  //       const error: ParseError = e;
  //       expect(error.message).toBe(
  //         `[0:31]: Attribute (name) expected a end quote`
  //       );
  //       expect(error.errorStart.pos).toBe(10);
  //     }

  //     expect(() => parseAsElement(ss2.clone())).toThrow();
  //     try {
  //       parseAsElement(ss2.clone());
  //     } catch (e) {
  //       const error: ParseError = e;
  //       expect(error.message).toBe(
  //         `[0:10]: Attribute (name) expected a start quote`
  //       );
  //       expect(error.errorStart.pos).toBe(10);
  //     }
  //   });

  //   test('ParseAsElement::parseAsElement -- tag_mismatch', () => {
  //     const ss1 = new StringStream('<span>vvvvv</div>');

  //     expect(() => parseAsElement(ss1.clone())).toThrow();
  //     try {
  //       parseAsElement(ss1.clone());
  //     } catch (e) {
  //       const error: ParseError = e;
  //       expect(error.message).toBe(
  //         `[0:0]: Tag name mismatch (<span ...>*</div>)`
  //       );
  //       expect(error.errorStart.pos).toBe(0);
  //       expect(error.errorEnd.pos).toBe(17);
  //     }
  //   });

  //   test('ParseAsElement::parseAsElement -- tag not close', () => {
  //     const ss1 = new StringStream('<span>vvvvv<div>yes</div>emmm');

  //     expect(() => parseAsElement(ss1.clone())).toThrow();
  //     try {
  //       parseAsElement(ss1.clone());
  //     } catch (e) {
  //       const error: ParseError = e;
  //       expect(error.message).toBe(
  //         `[0:${ss1.content.length}]: Unexpected end, tag (span) not close.`
  //       );
  //       expect(error.errorStart.pos).toBe(0);
  //       expect(error.errorEnd.pos).toBe(ss1.content.length);
  //     }
  //   });

  //   test('ParseAsElement::parseAsElement -- tag unexpected end', () => {
  //     const ss1 = new StringStream('<input checked');
  //     expect(() => parseAsElement(ss1.clone())).toThrow();
  //     try {
  //       parseAsElement(ss1.clone());
  //     } catch (e) {
  //       const error: ParseError = e;
  //       expect(error.message).toBe(
  //         `[0:${ss1.content.length}]: Tag (input) unexpected end`
  //       );
  //       expect(error.errorStart.pos).toBe(0);
  //       expect(error.errorEnd.pos).toBe(ss1.content.length);
  //     }
  //   });
});
