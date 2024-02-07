# CSS

![](../../.vuepress/public/images/interview-questions/0002.png) 

## CSS基础

### 1. CSS选择器及其优先级

| 选择器 | 格式 | 优先级权重 |
| --- | --- | --- |
| 内联样式 | style="color: red;" | 1000 |
| id选择器 | #id | 100 |
| 类选择器 | .class | 10 |
| 属性选择器 | a[ref = "eee"] | 10 |
| 伪类选择器 | li:last-child | 10 |
| 标签选择器 | div | 1 |
| 伪元素选择器 | li:after | 1 |
| 相邻兄弟选择器 | h1 + p | 0 |
| 子选择器 | ul > li | 0 |
| 后代选择器 | li a | 0 |
| 通配符选择器 | * | 0 |

- !important 声明的样式优先级最高
- 如果优先级相同，最后出现的样式生效
- 集成得到的样式优先级最低
- 样式表的来源不同时，优先级顺序为：内联样式 > 内部样式 > 外部样式 > 浏览器用户自定义样式 > 浏览器默认样式。
- 在计算优先级时，选择器中每个部分的数量都会被考虑。例如，div p 的优先级比 p 高，因为它包含了更多的选择器部分。

### 2. CSS中可继承与不可继承属性有哪些

<b>一、无继承性的属性</b>

1. `display`：规定元素应该生成的框的类型

2. 文本属性

- `vertical-align`：垂直文本对齐
- `text-decoration`：规定添加到文本的装饰
- `text-shadow`：文本阴影
- `white-space`：空白符处理
- `unicode-bidi`：文本方向

3. 盒子模型的属性

`width`、`height`、`margin`、`border`、`padding`

4. 背景属性：

`background`、`background-color`、`background-image`、`background-repeat`、`background-pisition`、`background-attachment`

5. 定位属性：
`float`、`clear`、`position`、`top`、`right`、`bottom`、`left`、`min-width`、`min-height`、`max-width`、`max-height`、`overflow`、`clip`、`z-index`

6. 生成内容属性：
`content`、`counter-reset`、`counter-increment`

7. 轮廓样式属性：
`outline-style`、`outline-width`、`outline-color`、`outline`

8. 页面样式属性：
`size`、`page-break-before`、`page-break-after`

9. 声音样式属性：
`pause-before`、`pause-after`、`pause`、`cue-before`、`cue-after`、`cue`、`play-during`

<b>二、有继承性的属性</b>

1. 字体属性

- `font-family`：字体系列
- `font-weight`：字体的粗细
- `font-size`：字体的大小
- `font-style`：字体的风格

2. 文本属性

- `text-indent`：文本缩进
- `text-align`：文本水平对齐
- `line-height`：行高
- `word-spacing`：单词之间的间距
- `letter-spacing`：中文或者字母之间的间距
- `text-transform`：控制文本大小写（就是uppercase、lowercase、capitalize这三个）
- `color`：文本颜色

3. 元素可见性

- `visibility`：控制元素显示隐藏

4. 列表布局属性

- `list-style`：列表风格，包括list-style-type、list-style-image等

5. 光标属性

- `cursor`：光标显示为何种形态

### 3. display 的属性值及其作用

| 属性值 | 作用 |
| --- | --- |
| none | 元素不显示，并且会从文档流中移除。 |
| block | 块类型。默认宽度为父元素宽度，可设置宽高，换行显示。|
| inline | 行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。 |
| inline-block | 默认宽度为内容宽度，可以设置宽高，同行显示。 |
| list-item | 像块类型元素一样显示，并添加样式列表标记。 |
| table | 此元素会作为块级表格来显示。 |
| inherit | 规定应该从父元素继承display属性的值。 |

### 4. display 的 block、inline 和 inline-block 的区别

<b>`block`：</b>

- 元素独占一行，从上至下垂直排列
- 宽度默认为父元素的100%，可以设置宽度和高度
- 常见的块级元素有 `<div>`、`<p>`、`<h1>` 等

```css
.block-element {
  display: block;
  width: 100%; /* 默认宽度为父元素宽度 */
  height: 50px; /* 可设置高度 */
}
```

<b>`inline`：</b>

- 元素在同一行内水平排列，不独占一行
- 宽度和高度仅占据内容所需的空间
- 不能设置宽度和高度
- 常见的行内元素有 `<span>`、`<a>`、`<strong>` 等

```css
.inline-element {
  display: inline;
  /* 不能设置宽度和高度 */
}
```

<b>`inline-block`：</b>

- 元素在同一行内水平排列，但可以设置宽度和高度
- 宽度和高度仅占据内容所需的空间
- 常用于需要水平排列但同时设置宽度和高度的情况
- 允许元素有块级元素的宽度和高度属性

```css
.inline-block-element {
  display: inline-block;
  width: 50px;
  height: 50px;
}
```

### 5. 隐藏元素的方法有哪些

常见的6种方式：

- `display: none`：将元素完全从页面中移除，不占据任何空间，元素及其子元素都会隐藏
- `visibility: hidden`：元素在页面上不可见，但仍然占据空间，元素及其子元素仍然存在于文档流中
- `opacity: 0`：使元素完全透明，但仍然占据空间，元素及其子元素仍然存在于文档流中
- `position: absolute | fixed`：通过设置 left 或 right 来将元素移出可视区域
- `clip: rect(0, 0, 0, 0)`：将元素裁剪为不可见的区域，该属性已被废弃，不推荐使用
- `transform: scale(0,0)`：将元素缩放为 0，但仍然占据空间，元素及其子元素仍然存在于文档流中

### 6. link和@import的区别

<b>1. 语法和用法</b>

- `<link>`：HTML标签，用于在 HTML 中引入外部资源，如 CSS 文件、favicon、字体文件等。
```html
<link rel="stylesheet" type="text/css" href="styles.css">
```

- `@import`：CSS 的一种指令，用于在 CSS 文件中引入其他 CSS 文件。
```css
@import url("styles.css")
```

<b>2. 加载方式</b>

- `<link>`：标签会在页面加载时同时加载外部资源，并行请求，不会阻塞页面渲染。
- `@import`：指令会在页面加载后加载样式表，会等待 HTML 页面加载完毕后再加载，可能会阻塞页面的渲染（下面介绍）。

<b>3. 兼容性</b>

- `<link>`：HTML 的标准元素，支持所有现代浏览器，也支持旧版本浏览器。
- `@import`：CSS2.1 引入的特性，不支持 IE5和IE6，虽然现代浏览器都支持，但有时候会引发一些兼容性问题。

<b>4. 使用场景</b>

- `<link>`：更常用于在 HTML 文件中引入外部样式表，以及引入网站图标、字体文件等。
- `@import`：通常用于在 CSS 文件中引入其他 CSS 文件，例如在模块化开发中，或者在某些特定场景下需要动态加载 CSS 的情况。


#### @import阻塞页面渲染的情况

- 当页面包含多个 `@import` 指令时，浏览器需要等待所有样式表加载完成后才能开始渲染页面内容，这可能导致页面加载速度变慢，用户感知到的页面加载时间延长。
- 如果某个 `@import` 指向的样式表文件很大或者网络情况不佳，那么加载该样式表可能会花费较长的时间，延迟页面的渲染。
- `@import`指令是顺序加载的，即使在 CSS 文件中使用了异步加载也不会生效。如果某个样式表加载时间较长，后续的页面渲染会被阻塞。

虽然 `@import` 指令有可能会影响页面的加载和渲染速度，但具体影响程度取决于多个因素，包括网络情况、样式表大小、样式表加载顺序等。在实际开发中，为了提升页面加载性能，可以尽量减少 `@import` 的使用，或者将 `@import` 放置在页面底部，以减少其对页面渲染的阻塞。

### transition和animation的区别