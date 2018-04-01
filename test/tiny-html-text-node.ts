import { NODE_TYPE } from '../src/tiny-html-node';
import TinyHtmlTextNode, {
  isTinyHtmlTextNode
} from '../src/tiny-html-text-node';

describe('tiny-html-text-node', () => {
  const text = 'aepkill';
  const node = new TinyHtmlTextNode(text);
  test('TinyHtmlTextNode normal', () => {
    expect(node.text).toBe(text);
  });
  test('TinyHtmlTextNode::cloneNode', () => {
    const cloneNode = node.cloneNode();
    expect(cloneNode).not.toBe(node);
    expect(cloneNode).toEqual(node);
  });
  test('TinyHtmlTextNode::toJson', () => {
    expect(node.toJson()).toEqual({
      nodeType: NODE_TYPE.TEXT,
      text
    });
  });
  test('TinyHtmlTextNode::toString', () => {
    expect(node.toString()).toBe(text);
  });
  test('isTinyHtmlTextNode', () => {
    expect(isTinyHtmlTextNode(node)).toBe(true);
    // tslint:disable-next-line:no-any
    expect(isTinyHtmlTextNode(({} as any) as TinyHtmlTextNode)).toBe(false);
  });
});
