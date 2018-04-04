import TinyHtmlElementNode, {
  TinyHtmlElementNodeJson
} from '../src/tiny-html-element-node';
import TinyHtmlNode, { NODE_TYPE } from '../src/tiny-html-node';
import TinyHtmlTextNode from '../src/tiny-html-text-node';

describe('TinyHtmlElementNode', () => {
  const tagName = 'div';
  const node = new TinyHtmlElementNode(tagName);

  test('TinyHtmlElementNode->parent', () => {
    const t1 = node.cloneNode();
    const t2 = node.cloneNode();
    expect(t1.parent).toBeNull();
    t1.appendChild(t2);
    expect(t2.parent).toBe(t1);
  });

  test('TinyHtmlElementNode->tagName', () => {
    expect(node.tagName).toBe(tagName);
  });

  test('TinyHtmlElementNode->attributes', () => {
    const t1 = node.cloneNode();
    expect(t1.attributes).toEqual({});
    t1.attributes.class = 'hi';
    expect(t1.attributes).toEqual({
      class: 'hi'
    });
  });

  test('TinyHtmlElementNode->clone()', () => {
    const cloneNode = node.cloneNode();
    expect(node).not.toBe(cloneNode);
    expect(node.attributes).not.toBe(cloneNode.attributes);
    expect(node.children).not.toBe(cloneNode.children);

    expect(node).toEqual(cloneNode);
  });

  test('TinyHtmlElementNode->appendChild()', () => {
    const t1 = node.cloneNode();
    const t2 = node.cloneNode();
    const t3 = node.cloneNode();
    t1.appendChild(t2);
    expect(t2.parent).toBe(t1);
    expect(t2.next).toBeNull();
    expect(t2.pre).toBeNull();
    t1.appendChild(t3);
    expect(t2.next).toBe(t3);
    expect(t3.pre).toBe(t2);
    expect(t1.children).toEqual([t2, t3]);
  });

  test('TinyHtmlElementNode->removeChild()', () => {
    const t1 = node.cloneNode();
    const t2 = node.cloneNode();
    const t3 = node.cloneNode();
    const t4 = node.cloneNode();

    t1.appendChild(t2);
    t1.appendChild(t3);
    t1.appendChild(t4);

    t1.removeChild(t2);

    expect(t2.parent).toBe(null);
    expect(t2.pre).toBeNull();
    expect(t2.next).toBeNull();
    expect(t3.pre).toBeNull();
    expect(t1.children).toEqual([t3, t4]);

    t1.removeChild(t4);

    expect(t3.next).toBeNull();
    expect(t3.pre).toBeNull();

    t1.removeChild(new TinyHtmlElementNode('div'));
    expect(t1.children).toEqual([t3]);
  });

  test('TinyHtmlElementNode->toJson()', () => {
    const t1 = node.cloneNode();
    const t2 = node.cloneNode();
    const t3 = node.cloneNode();
    const json1 = t1.toJson();
    const jsonR = {
      nodeType: NODE_TYPE.ELEMENT,
      attributes: node.attributes,
      children: [],
      tagName
    };

    expect(json1.attributes).toEqual(t1.attributes);
    expect(json1.attributes).not.toBe(t1.attributes);
    expect(json1).toEqual(jsonR);

    t1.appendChild(t2);
    t1.appendChild(t3);

    const json2 = t1.toJson();
    expect(json2.children.length).toBe(2);
    expect(json2.children[0]).toEqual(jsonR);
    expect(json2.children[0].parent).toBe(json2);

    expect(json2.children[0].pre).toBe(undefined);
    expect(json2.children[0].next).toBe(json2.children[1]);

    expect(json2.children[1].pre).toBe(json2.children[0]);
    expect(json2.children[1].next).toBe(undefined);
  });

  test('TinyHtmlElementNode->toString()', () => {
    const t1 = node.cloneNode();
    const t2 = node.cloneNode();
    const attrValue = 'wtf xxx heee';
    const attrValue2 = `"fuck"`;

    expect(t1.toString()).toEqual('<div></div>');
    t1.attributes.test = attrValue;
    expect(t1.toString()).toEqual(`<div test="${attrValue}"></div>`);
    t1.attributes.test = attrValue2;
    expect(t1.toString()).toEqual(`<div test='${attrValue2}'></div>`);
    t1.appendChild(t2);
    expect(t1.toString()).toEqual(
      `<div test='${attrValue2}'><div></div></div>`
    );
  });

  test('TinyHtmlElementNode::isTinyHtmlElementNode()', () => {
    expect(TinyHtmlElementNode.isTinyHtmlElementNode(node)).toBe(true);
    expect(
      TinyHtmlElementNode.isTinyHtmlElementNode(
        // tslint:disable-next-line:no-any
        ({} as any) as TinyHtmlElementNode
      )
    ).toBe(false);
  });
});
