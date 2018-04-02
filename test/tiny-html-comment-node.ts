import TinyHtmlCommentNode, {
  isTinyHtmlCommentNode
} from '../src/tiny-html-comment-node';
import { NODE_TYPE } from '../src/tiny-html-node';

describe('TinyHtmlCommentNode', () => {
  const content = 'aepkill';
  const node = new TinyHtmlCommentNode(content);
  test('TinyHtmlTextNode->content', () => {
    expect(node.content).toBe(content);
  });
  test('TinyHtmlTextNode->cloneNode()', () => {
    const cloneNode = node.cloneNode();
    expect(cloneNode).not.toBe(node);
    expect(cloneNode).toEqual(node);
  });
  test('TinyHtmlTextNode->toJson()', () => {
    expect(node.toJson()).toEqual({
      nodeType: NODE_TYPE.COMMENT,
      content
    });
  });
  test('TinyHtmlTextNode->toString()', () => {
    expect(node.toString()).toBe(`<!--${content}-->`);
  });
  test('TinyHtmlTextNode::isTinyHtmlTextNode()', () => {
    expect(isTinyHtmlCommentNode(node)).toBe(true);
    // tslint:disable-next-line:no-any
    expect(isTinyHtmlCommentNode(({} as any) as TinyHtmlCommentNode)).toBe(
      false
    );
  });
});
