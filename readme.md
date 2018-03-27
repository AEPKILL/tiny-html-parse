# tiny-html-parse

一款简洁、高效的 html 解析器，用于将 html 字符串解析为 AST .

tiny-html-parse 设计的目的是用于支持 **前端框架的模板代码解析** ，所以并没有实现所有 html 标准，实际上它仅支持一个 html 语法子集。

同时 tiny-html-parse 是一个严格的 html 解析器，它会对不匹配的标签、未闭合的标签等发出错误警告。

eg:

```html
// bad
<div>hello world</span>
// bad
<div> hello world <div>
```



支持的 html 元素:

ELEMENT_NODE

TEXT_NODE

COMMENT_NODE

eg:

```html
// ok
<div> hello world </div>
// ok
hello world
// ok
<!-- hello world -->
// bad
<!DOCTYPE html>
<?xml version="1.0"?>
```
