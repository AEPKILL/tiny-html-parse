import TinyHtmlNode, { NODE_TYPE, TinyHtmlNodeJson } from './tiny-html-node';

export interface TinyHtmlTextNodeJson extends TinyHtmlNodeJson {
  text: string;
}
export class TinyHtmlTextNode extends TinyHtmlNode {
  text: string;
  constructor(text = '') {
    super(NODE_TYPE.TEXT);
    this.text = text;
  }
  cloneNode() {
    return new TinyHtmlTextNode(this.text);
  }
  toJson(): TinyHtmlTextNodeJson {
    return {
      nodeType: NODE_TYPE.TEXT,
      text: this.text
    };
  }
  toString() {
    // don't care unsafe text
    return this.text;
  }
  static isTinyHtmlTextNode = isTinyHtmlTextNode;
}

export function isTinyHtmlTextNode(
  node: TinyHtmlNode
): node is TinyHtmlTextNode {
  return node && node.nodeType === NODE_TYPE.TEXT;
}

export default TinyHtmlTextNode;
