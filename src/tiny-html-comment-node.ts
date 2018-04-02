import TinyHtmlNode, { NODE_TYPE, TinyHtmlNodeJson } from './tiny-html-node';

export interface TinyHtmlCommentNodeJson extends TinyHtmlNodeJson {
  content: string;
}

export class TinyHtmlCommentNode extends TinyHtmlNode {
  content: string;

  constructor(content = '') {
    super(NODE_TYPE.COMMENT);
    this.content = content;
  }
  cloneNode() {
    return new TinyHtmlCommentNode(this.content);
  }
  toJson(): TinyHtmlCommentNodeJson {
    return {
      nodeType: NODE_TYPE.COMMENT,
      content: this.content
    };
  }
  toString() {
    return `<!--${this.content}-->`;
  }
  static isTinyHtmlCommentNode = isTinyHtmlCommentNode;
}

export function isTinyHtmlCommentNode(
  node: TinyHtmlNode
): node is TinyHtmlCommentNode {
  return node && node.nodeType === NODE_TYPE.COMMENT;
}

export default TinyHtmlCommentNode;
