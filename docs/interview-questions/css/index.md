# CSS

![](../../.vuepress/public/images/interview-questions/0002.png) 

## CSS基础

### CSS选择器及其优先级

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

### CSS中可继承与不可继承属性有哪些

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

### display 的属性值及其作用

| 属性值 | 作用 |
| --- | --- |
| none | 元素不显示，并且会从文档流中移除。 |
| block | 块类型。默认宽度为父元素宽度，可设置宽高，换行显示。|
| inline | 行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示。 |
| inline-block | 默认宽度为内容宽度，可以设置宽高，同行显示。 |
| list-item | 像块类型元素一样显示，并添加样式列表标记。 |
| table | 此元素会作为块级表格来显示。 |
| inherit | 规定应该从父元素继承display属性的值。 |