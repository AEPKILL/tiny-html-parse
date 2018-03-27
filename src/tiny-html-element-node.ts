import TinyHtmlNode, { NODE_TYPE } from './tiny-html-node';

export class TinyHtmlElementNode extends TinyHtmlNode {
  private readonly _tagName: string;
  private _children: TinyHtmlNode[] = [];
  protected _selfClose: boolean = false;

  get tagName() {
    return this._tagName;
  }
  get children() {
    return this._children.slice();
  }
  get selfClose() {
    return this._selfClose;
  }
  constructor(tagName: string) {
    super(NODE_TYPE.ELEMENT);
    this._tagName = tagName;
  }
  addChild(node: TinyHtmlNode) {
    const children = this._children;
    if (children.length) {
      const lastNode = children[children.length - 1];
      TinyHtmlNode.setNext(lastNode, node);
      TinyHtmlNode.setPre(node, lastNode);
    }
    TinyHtmlNode.setParent(node, this);
    this._children.push(node);
  }
  removeChild(node: TinyHtmlNode) {
    const children = this._children;
    const index = children.indexOf(node);
    if (index === -1) {
      return;
    }
    const pre = children[index - 1];
    const next = children[index + 1];
    if (pre) {
      TinyHtmlNode.setNext(pre, next);
    }
    if (next) {
      TinyHtmlNode.setPre(next, pre);
    }
    TinyHtmlNode.setParent(node, null);
    children.splice(index, 1);
  }
  static isTinyHtmlElementNode = isTinyHtmlElementNode;
}

export function isTinyHtmlElementNode(
  node: TinyHtmlNode
): node is TinyHtmlElementNode {
  return node.nodeType === NODE_TYPE.ELEMENT;
}

export default TinyHtmlNode;
