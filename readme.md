# tiny-html-parse

`tiny-html-parse` 一款简单高效的 `html ` 解析器，将 html 字符串解析为 AST .

`tiny-html-parse` 设计的目的是用于支持 **前端框架的模板代码解析** ，所以它仅 **仅支持一个 html 语法子集**。

`tiny-html-parse` 是一个 严格的 html 解析器 ，**它会对不匹配的标签、未闭合的标签等发出错误警告**。

## 支持解析的元素

* ELEMENT_NODE [ 普通HTML标签 ]
* TEXT_NODE [ 文本 ]
* COMMENT_NODE [ 注释 ]

```html
// 正确
<!-- hello world -->
// 正确
<div>balabala</div>
// 正确
balabala

// 不支持
<!DOCTYPE html>
// 不支持
<?xml version="1.0"?>

// 错误，标签不匹配
<div>hello world</span>
// 错误，标签不匹配
<div> hello world <div>
// 错误，标签不匹配, div 与 Div 大小写需要严格匹配
<div>lalala</Div>
```

# 安装

```shell
npm install tiny-html-parse --save
```



# 用法

```typescript
import { parseString , ParseError } from 'tiny-html-parse';
try {
    const node = parseString('<div></div>');
} catch(e) {
    const error: ParseError = e;
}
```

# DEMOS

*  [即时解析 HTML](http://blog.aepkill.com/demos/tiny-html-parse/)

# API & Class

## API

* parseString( content, option )

  content 是一段 html 文本

  options 是解析选项，它包含以下选项:

  * skipWhitespace: 是否跳过空白行，默认 false

    eg:

    ```html
    <div>     <span></span></div>
    ```

    如果 skipWhitespace  为 `ture` 那么 div 和 span 之间那段空白将被忽略，否则这段空白内容将被解析成一个 `TinyTextNode`。

  如果解析成功 `parseString` 返回一个 `TinyHtmlNode` 数组。

  如果解析失败 `parseString` 抛出一个 `ParseError` 异常。

* isTinyHtmlTextNode(node)

  判断一个 `TinyHtmlNode` 是否是一个 `TinyHtmlTextNode`

* isTinyHtmlCommentNode(node)

  判断一个 `TinyHtmlNode` 是否是一个 `TinyHtmlCommentNode`

* isTinyHtmlElementNode(node)

  判断一个 `TinyHtmlNode` 是否是一个 `TinyHtmlElementNode`


## Class

* ParseError

  ParseError 是一个承载解析异常信息的类，它包含以下字段:

  * errorStart: 错误开始的位置
  * errorEnd: 错误结束的位置
  * message: 具体的错误信息

  errorStart 和 errorEnd 是一个 ParsePosition 对象

* ParsePosition

  ParsePosition 是一个承载解析位置信息的类，它包含以下字段：

  - line: 行号
  - col: 列号
  - pos: 当前位置

* TinyHtmlNode

* TinyHtmlElementNode

* TinyHtmlCommentNode

* TinyHtmlTextNode

