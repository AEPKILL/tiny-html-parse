# tiny-html-parse

`tiny-html-parse` 一款简单高效的 `html ` 代码解析器，用于将 html 字符串解析为 AST .

`tiny-html-parse` 设计的目的是用于支持 **前端框架的模板代码解析** ，所以它仅 **仅支持一个 html 语法子集**。

`tiny-html-parse` 是一个 严格的 html 解析器 ，**它会对不匹配的标签、未闭合的标签等发出错误警告**。

## 支持解析的元素

* ELEMENT_NODE [ 普通HTML标签 ]
* TEXT_NODE [ 文本 ]
* COMMENT_NODE [ 注释 ]

## 例子

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
```

