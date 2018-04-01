import TinyHtmlCommentNode from '../src/tiny-html-comment-node';
import TinyHtmlElementNode from '../src/tiny-html-element-node';
import TinyHtmlNode from '../src/tiny-html-node';
import TinyHtmlTextNode from '../src/tiny-html-text-node';

describe('tiny html node test', () => {
  test('comment-node clone', () => {
    const node = new TinyHtmlCommentNode('aepkill');
    const cloneNode = node.cloneNode();
    expect(node).not.toBe(cloneNode);
    expect(node).toEqual(cloneNode);
  });
  test('text-node clone', () => {
    const node = new TinyHtmlTextNode('aepkill');
    const cloneNode = node.cloneNode();
    expect(node).not.toBe(cloneNode);
    expect(node).toEqual(cloneNode);
  });
  test('element-node clone: no have children', () => {
    const node = new TinyHtmlElementNode('div');
    const cloneNode = node.cloneNode();
    expect(node).not.toBe(cloneNode);
    expect(node).toEqual(cloneNode);
  });
  test('element-node addChild', () => {
    // todo ...
  });
});
