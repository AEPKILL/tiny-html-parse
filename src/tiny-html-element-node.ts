import Dictionary from './model/dictionary';
import TinyHtmlNode, { NODE_TYPE, TinyHtmlNodeJson } from './tiny-html-node';

export interface TinyHtmlElementNodeJson extends TinyHtmlNodeJson {
  tagName: string;
  children: TinyHtmlNodeJson[];
  attributes: Dictionary<string>;
}
export class TinyHtmlElementNode extends TinyHtmlNode {
  private readonly _tagName: string;
  private readonly _children: TinyHtmlNode[];
  private _attributes: Dictionary<string>;
  private _text?: string;
  get tagName() {
    return this._tagName;
  }
  get children() {
    return this._children.slice();
  }
  get attributes() {
    return this._attributes;
  }
  get text() {
    return this._text || '';
  }
  set text(value: string) {
    this._text = value;
  }
  constructor(tagName: string) {
    super(NODE_TYPE.ELEMENT);
    this._tagName = tagName;
    this._attributes = {};
    this._children = [];
  }
  appendChild(node: TinyHtmlNode) {
    const children = this._children;
    const lastNode = children[children.length - 1];
    if (node.parent) {
      (node.parent as TinyHtmlElementNode).removeChild(node);
    }
    if (lastNode) {
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
      TinyHtmlNode.setNext(pre, next || null);
    }
    if (next) {
      TinyHtmlNode.setPre(next, pre || null);
    }
    TinyHtmlNode.setParent(node, null);
    TinyHtmlNode.setNext(node, null);
    TinyHtmlNode.setPre(node, null);
    children.splice(index, 1);
  }
  cloneNode() {
    const node = new TinyHtmlElementNode(this._tagName);
    // shallow copy
    node._attributes = {
      ...this._attributes
    };
    for (const child of this._children) {
      node.appendChild(child.cloneNode());
    }
    return node;
  }
  toJson(): TinyHtmlElementNodeJson {
    const json: TinyHtmlElementNodeJson = {
      nodeType: NODE_TYPE.ELEMENT,
      tagName: this.tagName,
      attributes: { ...this._attributes },
      children: []
    };
    for (const child of this._children) {
      const childJson = child.toJson();
      const lastNode = json.children[json.children.length - 1];
      childJson.parent = json;
      if (lastNode) {
        childJson.pre = lastNode;
        lastNode.next = childJson;
      }
      json.children.push(childJson);
    }
    return json;
  }
  getAttributeString() {
    const attrsKeys = Object.keys(this.attributes);
    if (attrsKeys.length) {
      return ` ${attrsKeys
        .reduce(
          (attrs, key) => {
            const value = this._attributes[key];
            const quote = value.indexOf(`"`) >= 0 ? `'` : `"`;
            return [...attrs, `${key}=${quote}${value}${quote}`];
          },
          [] as string[]
        )
        .join(' ')}`;
    }
    return '';
  }
  toString() {
    let result = `<${this.tagName}${this.getAttributeString()}>`;
    for (const child of this.children) {
      result = `${result}${child.toString()}`;
    }
    return `${result}</${this.tagName}>`;
  }
  static isTinyHtmlElementNode = isTinyHtmlElementNode;
}

export function isTinyHtmlElementNode(
  node: TinyHtmlNode
): node is TinyHtmlElementNode {
  return node && node.nodeType === NODE_TYPE.ELEMENT;
}

export default TinyHtmlElementNode;
