import TinyHtmlNode, { NODE_TYPE } from './tiny-html-node';

export class TinyHtmlCommentNode extends TinyHtmlNode {
  content: string;

  constructor(content: string) {
    super(NODE_TYPE.COMMENT);
    this.content = content;
  }

  static isTinyCommentElementNode = isTinyCommentElementNode;
}

export function isTinyCommentElementNode(
  node: TinyHtmlNode
): node is TinyHtmlCommentNode {
  return node.nodeType === NODE_TYPE.COMMENT;
}

export default TinyHtmlCommentNode;
