export enum NODE_TYPE {
  ELEMENT = Node.ELEMENT_NODE,
  TEXT = Node.TEXT_NODE,
  COMMENT = Node.COMMENT_NODE
}

export abstract class TinyHtmlNode {
  protected readonly _nodeType: NODE_TYPE;
  protected _parent: TinyHtmlNode | null;
  protected _pre: TinyHtmlNode | null;
  protected _next: TinyHtmlNode | null;

  get nodeType() {
    return this._nodeType;
  }
  get parent() {
    return this._parent || null;
  }
  get pre() {
    return this._pre || null;
  }
  get next() {
    return this._next || null;
  }
  constructor(nodeType: NODE_TYPE) {
    this._nodeType = nodeType;
  }
  protected static setPre(node: TinyHtmlNode, pre: TinyHtmlNode | null) {
    node._pre = pre;
  }
  protected static setNext(node: TinyHtmlNode, next: TinyHtmlNode | null) {
    node._next = next;
  }
  protected static setParent(node: TinyHtmlNode, parent: TinyHtmlNode | null) {
    node._parent = parent;
  }
}

export default TinyHtmlNode;
