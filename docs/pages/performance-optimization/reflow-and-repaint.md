# 回流与重绘

## 一、基本概念与触发条件

### 回流-Reflow

当渲染树中部分或者全部元素的尺寸、结构或者属性发生变化时，浏览器会重新渲染部分或者全部文档的过程就称为**回流**。

### 哪些操作会导致回流

1. 页面的首次渲染
2. 浏览器的窗口大小发生变化
3. 元素的内容发生变化
4. 元素的尺寸或者位置发生变化
5. 元素的字体大小发生变化
6. 激活CSS伪类
7. 查询某些属性或者调用某些方法
8. 添加或者删除可见的DOM元素

在触发回流（重排）的时候，由于浏览器渲染页面是基于流式布局的，所以当触发回流时，会导致周围的DOM元素重新排列，它的影响范围有两种：

* 全局范围：从根节点开始，对整个渲染树进行重新布局
* 局部范围：对渲染树的某部分或者一个渲染对象进行重新布局

### 重绘-Repaint

当页面中某些元素的样式发生变化，但是不会影响其在文档流中的位置时，浏览器就会对元素进行重新绘制，这个过程就是**重绘**。

### 哪些操作会导致重绘

1. color、background 相关属性：background-color、background-image 等
2. outline 相关属性：outline-color、outline-width 、text-decoration
3. border-radius、visibility、box-shadow

:::tip
当触发回流时，一定会触发重绘，但是重绘不一定会引发回流。
:::

## 二、如何避免回流与重绘

1. 操作DOM时，尽量在低层级的DOM节点进行操作
2. 不要使用 `table` 布局， 一个小的改动可能会使整个 `table` 进行重新布局
3. 使用CSS的表达式
4. 不要频繁操作元素的样式，对于静态页面，可以修改类名，而不是样式
5. 使用absolute或者fixed，使元素脱离文档流，这样他们发生变化就不会影响其他元素
6. 避免频繁操作DOM，可以创建一个文档片段 `documentFragment`，在它上面应用所有DOM操作，最后再把它添加到文档中
7. 将元素先设置display: none，操作结束后再把它显示出来。因为在display属性为none的元素上进行的DOM操作不会引发回流和重绘.
8. 将DOM的多个读操作（或者写操作）放在一起，而不是读写操作穿插着写。这得益于浏览器的渲染队列机制。

浏览器针对页面的回流与重绘，进行了自身的优化——**渲染队列**

:::tip
浏览器会将所有的回流、重绘的操作放在一个队列中，当队列中的操作到了一定的数量或者到了一定的时间间隔，浏览器就会对队列进行批处理。这样就会让多次的回流、重绘变成一次回流重绘。
:::

## 三、如何优化动画

对于如何优化动画，我们知道，一般情况下，动画需要频繁的操作DOM，就就会导致页面的性能问题，我们可以将动画的 `position` 属性设置为 `absolute` 或者 `fixed`，将动画脱离文档流，这样他的回流就不会影响到页面了。

## 四、documentFragment

[文档](https://developer.mozilla.org/zh-CN/docs/Web/API/DocumentFragment)