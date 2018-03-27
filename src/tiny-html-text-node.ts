import TinyHtmlNode, { NODE_TYPE } from './tiny-html-node';

export class TinyHtmlTextNode extends TinyHtmlNode {
  text: string;
  constructor(text: string) {
    super(NODE_TYPE.TEXT);
    this.text = text;
  }
  static isTinyHtmlTextNode = isTinyHtmlTextNode;
}

export function isTinyHtmlTextNode(
  node: TinyHtmlNode
): node is TinyHtmlTextNode {
  return node.nodeType === NODE_TYPE.TEXT;
}

export default TinyHtmlTextNode;
