import { readFileSync } from 'fs';
import parseString from '../src/parse/index';
import TinyHtmlElementNode from '../src/tiny-html-element-node';

const zhihu = readFileSync('./test/site/zhihu.html').toString();

describe('site test', () => {
  test('zhihu', () => {
    expect(() =>
      parseString(zhihu, {
        skipWhitespaceText: true
      })
    ).not.toThrow();
    const nZhihu = parseString(zhihu, {
      skipWhitespaceText: true
    })[0] as TinyHtmlElementNode;
    expect(nZhihu.tagName).toBe('body');
    expect((nZhihu.children[0] as TinyHtmlElementNode).attributes.id).toBe(
      'root'
    );
    expect((nZhihu.children[2] as TinyHtmlElementNode).attributes).toEqual({
      src:
        'https://static.zhihu.com/heifetz/main.raven.f3d7c6e55fc98c076a11.js',
      async: ''
    });
  });
});
