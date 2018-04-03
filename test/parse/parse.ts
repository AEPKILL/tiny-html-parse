import { TinyHtmlElementNode } from '../../src';
import { parseString } from '../../src/parse';
import ParseError from '../../src/parse/parse-error';
import TinyHtmlCommentNode from '../../src/tiny-html-comment-node';
import { NODE_TYPE } from '../../src/tiny-html-node';
import TinyHtmlTextNode from '../../src/tiny-html-text-node';
import { getRealMessage } from '../utils/utils';

function getParseError(html: string) {
  try {
    parseString(html);
  } catch (e) {
    return e as ParseError;
  }
}

function parseElementHelper(html: string) {
  return parseString(html)[0] as TinyHtmlElementNode;
}

function parseTextHelper(html: string) {
  return parseString(html)[0] as TinyHtmlTextNode;
}

function parseCommentHelper(html: string) {
  return parseString(html)[0] as TinyHtmlCommentNode;
}

describe('parse', () => {
  test('legal', () => {
    expect(parseTextHelper('xxxx').nodeType).toBe(NODE_TYPE.TEXT);
    expect(parseTextHelper('xxxx').text).toBe('xxxx');

    expect(parseCommentHelper('<!--hello-->').nodeType).toBe(NODE_TYPE.COMMENT);
    expect(parseCommentHelper('<!--hello-->').content).toBe('hello');

    expect(parseElementHelper('<div></div>').nodeType).toBe(NODE_TYPE.ELEMENT);
    expect(parseElementHelper('<div></div>').tagName).toBe('div');
  });

  test('illegal', () => {
    let error = getParseError('<div><');

    error = getParseError('<div><span></span>');
    expect(error.errorStart.pos).toBe(0);
    expect(error.errorEnd.pos).toBe(18);
    expect(getRealMessage(error)).toBe(`Tag <div> not close`);

    error = getParseError('<div></span>');
    expect(error.errorStart.pos).toBe(0);
    expect(error.errorEnd.pos).toBe(12);
    expect(getRealMessage(error)).toBe(`Tag name mismatch '<div>...</span>'`);

    error = getParseError('<div></div></span>');
    expect(error.errorStart.pos).toBe(11);
    expect(error.errorEnd.pos).toBe(18);
    expect(getRealMessage(error)).toBe(`Unexpected close tag '</span>'`);
  });
});
