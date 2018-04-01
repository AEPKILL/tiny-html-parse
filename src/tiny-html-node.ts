export enum NODE_TYPE {
  ELEMENT = 1 /* Node.ELEMENT_NODE */,
  TEXT = 3 /* Node.TEXT_NODE */,
  COMMENT = 8 /* Node.COMMENT_NODE */
}
export interface TinyHtmlNodeJson {
  nodeType: NODE_TYPE;
  pre?: TinyHtmlNodeJson;
  next?: TinyHtmlNodeJson;
  parent?: TinyHtmlNodeJson;
}
export interface TinyHtmlNodeMetadata {
  start?: {
    line: number;
    col: number;
  };
}
export abstract class TinyHtmlNode {
  protected readonly _nodeType: NODE_TYPE;
  protected _parent: TinyHtmlNode | null;
  protected _pre: TinyHtmlNode | null;
  protected _next: TinyHtmlNode | null;
  protected _meta: TinyHtmlNodeMetadata;
  get nodeType() {
    return this._nodeType;
  }
  get parent() {
    return this._parent;
  }
  get pre() {
    return this._pre;
  }
  get next() {
    return this._next;
  }
  get meta() {
    return this._meta;
  }

  constructor(nodeType: NODE_TYPE) {
    this._nodeType = nodeType;
    this._parent = null;
    this._pre = null;
    this._next = null;
    this._meta = {};
  }
  abstract cloneNode(): TinyHtmlNode;
  abstract toJson(): TinyHtmlNodeJson;
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
