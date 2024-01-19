# HTML

![](../../.vuepress/public/images/interview-questions/0001.png) 

## src 和 href 的区别

1. src（source）属性：

* `src` <b>属性用于指定外部资源</b>，比如图像、音频、视频或者脚本文件等。它告诉浏览器从指定的路径获取资源，并将其嵌入到文档中。

```html
<img src="image.jpg" alt="Image"/>
<script src="script.js"></script>
```

2. href（hypertext reference）属性：

* `href` <b>属性用于建立当前元素与外部资源之间的链接。</b>它通常用于超链接，指向其他文档、样式表、图像、应用程序等

```html
<a href="https://www.example.com">Visit Example</a>
<link rel="stylesheet" href="style.css">
```

在 HTML 中，有一些元素可能同时支持 `src` 和 `href` 属性，这通常取决元素的类型和在文档中的角色

```html
<a href="https://www.example.com" src="image.jpg">Visit Example</a>
<link rel="stylesheet" href="style.css" src="icon.png">
<script src="script.js" href="fallback-script.js"></script>
```

## HTML 语义化的理解

<b>语义化是指根据内容的结构化（内容的语义化），选择合适的标签（代码语义化）</b>

语义化的优点如下：

* 对机器友好，带有语义的文字表现力丰富，更适合搜索引擎的爬虫爬取有效信息，有利于 SEO。除此之外，语义类还支持读屏软件，根据文章可以自动生成目录；
* 对开发者友好，使用语义类标签增强了可读性，结构更加清晰，开发者能清晰的看出网页的结构，便于团队的开发与维护。

常见语义化标签

```javascript
<header></header> // 头部

<nav></nav> // 导航栏

<section></section> // 区块（有语义化的div）

<main></main> // 主要区域

<article></article> // 主要内容

<aside></aside> // 侧边栏

<footer></footer> // 底部
```

## DOCTYPE（文档类型）的作用

DOCTYPE 是 HTML5 中一个标准通过标记语言的文档类型声明，它的目的是告诉浏览器（解析器）应该以什么样（html或xhtml）的文档类型定义来解析文档，不同的渲染模式会影响浏览器对 css 代码甚至 JavaScript 脚本的解析。它必须声明在 HTML 文档的第一行。

```html
<!DOCTYPE html>
```

浏览器渲染页面时有两种主要的模式，即标准模式（standards mode） 和混杂模式（quirks mode）。这两种模式的选择通常由文档的`<!DOCTYPE>`声明来确定。可以通过 `document.compatMode` 查看。

* 标准模式（standards mode）：CSS1Compat，浏览器使用W3C的标准解析渲染页面。文档开头包含了严格的 `<!DOCTYPE>` 声明；
* 混杂模式（quirks mode）：BackCompat，浏览器使用自己的怪异模式解析渲染页面。文档开头不包含了严格的 `<!DOCTYPE>` 声明；

## script 标签中 defer 和 async 的区别

在 HTML 中，`<script>` 标签用于包含 JavaScript 代码。`defer` 和 `async` 是两个属性，用于控制脚本的执行方式。

1. `defer` 属性
* **作用**：告诉浏览器该脚本将在文档解析完成后执行，但在 `DOMContentLoaded` 事件之前。
* **执行时机**：脚本按照它们在文档中的顺序依次执行。
* **适用场景**：适用于需要确保脚本在整个文档解析完成后执行，但又不需要阻塞其他页面渲染的情况。
* **优势**：`defer` 脚本会在文档解析完成后按照顺序执行，但不会阻塞页面的解析和渲染。
```html
<script defer src="example.js"></script>
```


2. `async` 属性
* **作用**：表示脚本将在下载完成后立即执行，而不会阻止页面的解析。
* **执行时机**：脚本将在下载完成后立即执行，不考虑其在文档中的位置。
* **适用场景**：适用于对页面渲染不会产生影响，且不依赖于页面其他部分的脚本。
* **优势**：`async` 允许浏览器并行下载多个脚本文件，而不会阻塞页面的解析，在非关键渲染脚本、脚本无依赖关系时，选择使用 `async` 从而提高页面加载速度。
```html
<script async src="example.js"></script>
```


3. 若不设置 `defer` 和 `async` 属性，script 标签内的 JS 代码将默认按照同步（synchronous）方式执行。这意味着脚本将会阻塞页面的解析和渲染，直到脚本执行完成。这种同步执行方式可能会导致性能问题，特别是在加载大量脚本或脚本文件较大时，因为页面将会被阻塞，直到所有脚本都执行完毕。使用 defer 或 async 可以改变这种默认行为，以更好地优化页面加载性能。


## 常用的meta标签有哪些

`Meta` 标签是 HTML 文档头部的一种元素，用于提供关于 HTML 文档的元信息（metadata）。这些元信息可以影响文档的呈现方式、搜索引擎优化（SEO）、移动设备适配等。

```html
<!-- 
  作用：指定文档使用的字符集，通常设置为 UTF-8，以支付包含各种引言字符的文本
 -->
<meta charset="UTF-8">

<!-- 
  作用：用于控制页面在移动设备上的视图
  内容：width=device-width 表示页面宽度等于设备宽度；initial-scale=1.0 表示初始缩放比例为 1.
 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" >

<!-- 
  作用：用于指定页面的关键词，对搜索引擎优化（SEO）有一定影响
 -->
<meta name="keywords" content="关键词1,关键词2,...">

<!-- 
  作用：提供对网页内容的简短描述，用于搜索引擎结果中的显示
 -->
<meta name="description" content="页面描述">

<!-- 
  作用：用于指定文档的作者
 -->
<meta name="author" content="作者名">

<!-- 
  作用：页面自动刷新，content 属性中的数字代表几秒后刷新；url 属性表示刷新后跳转的页面
 -->
<meta http-equiv="refresh" content="5;url=https://example.com">

<!-- 
  作用：用于告诉搜索引擎是否应该索引页面以及是否应该跟踪页面中的链接
  内容：index 表示允许搜索引擎爬取；noindex 表示不允许；follow 表示允许索引页面；nofollow 表示不允许；
  不设置robos默认都允许；
 -->
<meta name="robots" content="index, follow">

<!-- 
  作用：禁用自动检测电话号码，防止将数字识别为电话号码
 -->
<meta name="format-detection" content="telephone=no">

<!-- 
  作用：使网页在移动设备上以全屏Web应用程序模式打开
 -->
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- 
  作用：控制移动设备上的状态栏样式
 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black">

<!-- 
  作用：防止自动检测邮箱地址
 -->
<meta name="format-detection" content="email=no">
```

## HTML5有哪些更新

HTML5 是 HTML 标记语言的第五个版本，它带来了许多新的特性和改进，涵盖了语义、多媒体、表单、API 等多个方面。以下是 HTML5 的一些主要更新：

1. **语义元素**： 引入了一系列新的语义元素，如 `<header>`、`<footer>`、`<nav>`、`<article>`、`<section>`、`<aside>` 等，使得 HTML 结构更具语义化，更易读和维护。
2. **新的表单元素**： 引入了新的表单元素，如 `<input>` 的 type 属性的新值，包括 email、url、number、date 等，以及 `<input>` 的 placeholder 属性，提供更强大和用户友好的表单控件。
3. **音频和视频**： 引入了 `<audio>` 和 `<video>` 元素，使得在不依赖第三方插件的情况下，可以直接在网页上嵌入音频和视频内容。
4. **Canvas** 元素： 引入了 `<canvas>` 元素，允许通过 JavaScript 在页面上绘制图形和动画，提供了更灵活的绘图能力。
5. **Web Workers**： 允许在后台运行脚本，提高页面性能，尤其在处理大量计算或需要长时间运行的任务时。
6. **本地存储**： 提供了 `localStorage` 和 `sessionStorage`，允许在客户端存储数据，以便在页面会话之间或在浏览器关闭后保留数据。
7. **WebSocket**： 支持通过 `WebSocket` 协议进行双向通信，使得实时应用程序的开发更加便捷。
8. **地理位置**： 提供了通过浏览器获取用户地理位置信息的 API，使得开发者能够基于用户位置创建更丰富的应用。
9. **WebRTC**： 提供了实时通信的 API，支持浏览器之间的音频和视频通话，以及共享数据。
10. **拖放 API**： 引入了原生的拖放支持，使得元素的拖动和放置变得更加容易实现。
11. **SVG 和 MathML 的集成**： HTML5 引入了对可缩放矢量图形（SVG）和数学标记语言（MathML）的本地支持，使得在 HTML 中使用这两种语言更为便捷。


## img 的 srcset 属性的作用？

`<img>` 元素的 srcset 属性是 HTML5 引入的一个用于提供多个图像资源以适应不同显示屏密度和大小的属性。它有助于在不同的设备和屏幕尺寸下选择最合适的图像资源，从而提高页面性能和用户体验。

具体而言，`srcset` 属性的作用有以下几点：

1. **适应不同的屏幕密度（DPR）**： 通过提供不同分辨率的图像，srcset 允许浏览器在高密度屏幕（例如 Retina 显示屏）和低密度屏幕上选择最佳的图像资源。浏览器会根据设备的像素密度（DPR）自动选择合适的图像。
2. **适应不同的视口尺寸**： 在 sizes 属性的配合下，srcset 还可以根据视口的尺寸选择不同尺寸的图像。这使得在不同屏幕尺寸上显示最合适的图像，提高了响应性。

```html
<img src="image.jpg" 
     srcset="image-1x.jpg 1x, image-2x.jpg 2x, image-3x.jpg 3x" 
     sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw" 
     alt="Description">
```

* `srcset` 属性指定了不同密度的图像资源和它们的 DPR。
* `sizes` 属性定义了在不同视口尺寸下显示图像的宽度百分比。

浏览器将根据设备的 DPR 和视口尺寸选择最佳的图像。这样，对于不同的设备和屏幕，浏览器可以有选择地下载适当分辨率和大小的图像，从而提高页面加载速度和用户体验。

## 行内元素、块级元素、空（void）元素有哪些？

1. 行内元素（Inline Elements）
* 行内元素在页面中按照从左到右、从上到下的顺序依次显示，它们只占据它们实际包含内容的宽度。
* 常见的行内元素包括 `<span>`、`<a>`、`<strong>`、`<em>`、`<img>`、`<br>` 等。

2. 块级元素（Block-level Elements）
* 块级元素在页面中显示为独立的块，它们会从新行开始，并占据整个可用宽度，它们会垂直排列。
* 常见的块级元素包括 `<div>`、`<p>`、`<h1>` 到 `<h6>`、`<ul>`、`<ol>`、`<li>`、`<table>`、`<form>` 等。

3. 空（void）元素
* 空元素是指没有内容的元素，它们在 HTML 中没有关闭标签，通常用一个单独的标签来表示。
* 常见的空元素包括 `<img>`、`<br>`、`<hr>`、`<input>`、`<meta>` 等。

需要注意的是，HTML5 引入了一些新的元素，例如 `<article>`、`<section>`、`<nav>`、`<header>`、`<footer>` 等，它们有时候被称为 "HTML5 元素"，它们的行为可能有些类似块级元素，但也有一些特殊的语义用途。这些新元素的使用取决于文档的结构和语义。


## 说一下 web worker

Web Worker 是 HTML5 引入的一项技术，允许在浏览器中运行后台线程，以便在主线程外执行一些计算密集型的任务，从而提高页面的性能和响应性。Web Worker 的主要目标是允许开发者在不影响用户界面的情况下执行一些长时间运行的任务。

以下是一些关键特点和用法：

1. **后台运行**： Web Worker 在后台运行，与主线程相分离，不会阻塞用户界面的渲染和交互。这使得在 Web 应用程序中执行一些计算密集型或需要长时间运行的任务成为可能。

2. **独立的全局作用域**： Web Worker 有自己的全局作用域，与主线程的全局作用域相互独立。这意味着它们不能访问主线程的 DOM，也不能共享变量。通信是通过消息传递机制实现的。

3. **消息传递**： 主线程和 Web Worker 之间通过消息传递进行通信。主线程可以通过 postMessage() 方法将消息发送给 Web Worker，而 Web Worker 可以通过监听 onmessage 事件接收消息。这种通信方式确保了数据的安全性和线程之间的隔离。

4. **支持多线程**： 通过创建多个 Web Worker，可以在多个后台线程中并行执行任务，从而更有效地利用多核 CPU。

5. **限制**： Web Worker 有一些限制，例如不能直接访问 DOM、不能使用一些浏览器全局对象（如 window、document 等），也不能执行一些和 DOM 操作相关的任务。这是为了确保安全性和避免竞态条件。

示例：
```js
// 主线程
const worker = new Worker('worker.js');

worker.postMessage('Hello from the main thread!');

worker.onmessage = function (event) {
  console.log('Received message from worker:', event.data);
};

// worker.js（Web Worker 文件）
onmessage = function (event) {
  console.log('Received message in worker:', event.data);

  // 在后台执行一些任务
  const result = performHeavyTask();

  // 将结果发送回主线程
  postMessage(result);
};

function performHeavyTask() {
  // 执行一些耗时的任务
  return 'Result from heavy task';
}
```

示例：大型数组排序
```js
// main.js
// 创建一个包含大量数据的数组
const bigArray = Array.from({ length: 1000000 }, () => Math.random());

// 创建一个 Web Worker
const worker = new Worker('sortWorker.js');

// 发送数据给 Web Worker
worker.postMessage(bigArray);

// 监听 Web Worker 返回的结果
worker.onmessage = function (event) {
  const sortedArray = event.data;
  console.log('Sorted Array:', sortedArray);
};
```

```js
// sortWorker.js
onmessage = function (event) {
  const unsortedArray = event.data;

  // 在后台线程中进行排序
  const sortedArray = performSort(unsortedArray);

  // 将排序后的数组发送回主线程
  postMessage(sortedArray);
};

function performSort(array) {
  // 在这里使用适当的排序算法，例如快速排序
  return array.slice().sort((a, b) => a - b);
}
```

1. <b>并行计算</b>： Web Worker 允许在后台线程中并行执行排序算法，不会阻塞主线程。这样，页面的响应性不会受到排序操作的影响。

2. <b>利用多核 CPU</b>： 如果用户的设备支持多核 CPU，可以创建多个 Web Worker 来并行执行排序操作，充分利用硬件资源，提高排序速度。

3. <b>提高用户体验</b>： 由于排序操作在后台线程中进行，用户仍然可以与页面进行交互，而不感到明显的卡顿或延迟。

4. <b>避免主线程阻塞</b>： 在大规模数据处理中，使用 Web Worker 避免了在主线程中进行计算密集型任务而导致的阻塞，确保了页面的平滑运行。


## HTML5的离线存储怎么使用，它的工作原理是什么

HTML5 提供了一种离线存储的机制，通常被称为离线 Web 应用（Offline Web Application）。这个机制主要通过两个关键的技术来实现：Application Cache（应用缓存）和 Web Storage（Web 存储）。

### Application Cache（应用缓存）

<b>工作原理</b>：当用户访问页面时，浏览器会下载并缓存指定的资源文件。在用户离线时，浏览器将使用缓存的资源来渲染页面，而不需要从服务器重新获取。浏览器会定期检查 Cache Manifest 文件是否有更新，如果有更新，将会重新下载缓存的资源。

<b>使用步骤</b>：

1. 在 HTML 文件中引用 Manifest 文件： 在 HTML 文件的 `<html>` 标签中添加 manifest 属性，指向 Cache Manifest 文件。

```html
<!DOCTYPE html>
<html manifest="example.appcache">
<head>
  <!-- 页面的其他头部信息 -->
</head>
<body>
  <!-- 页面的内容 -->
</body>
</html>
```

2. 创建一个 Cache Manifest 文件：这是一个简单的文本文件，列出了需要缓存的资源文件，例如 HTML 文件、CSS 文件、JavaScript 文件、图像等。这个文件需要被服务器正确地配置为 MIME 类型 text/cache-manifest。文件名为 example.appcache。

```js
CACHE MANIFEST
# Version 1.0

CACHE:
css/style.css
js/script.js
img/image.jpg

NETWORK:
*

FALLBACK:
/ offline.html

```

* `CACHE`：表示需要离线存储的资源列表，由于包含 manifest 文件的页面将自动离线存储，所以不需要把页面自身也列出来。
* `NETWORK`：表示只有在线的情况下才能访问，
* `FALLBACK`：定义了一个替代资源，当某个文件无法访问时会使用替代资源。


3. 服务器配置： 确保服务器正确配置了 Cache Manifest 文件的 MIME 类型。

Nginx 服务器：在 Nginx 服务器的配置文件中，你可以添加以下代码：

```js
types {
    text/cache-manifest appcache;
}
```

这会将文件扩展名为 .appcache 的文件的 MIME 类型设置为 text/cache-manifest。

4. 操作 window.applicationCache

https://zhuanlan.zhihu.com/p/70883817

https://mp.weixin.qq.com/s/Q-Z8kYWSUJpkpAkTBv1Igw

### Service Worker 

https://zhuanlan.zhihu.com/p/44858068

## 浏览器是如何对 HTML5 的离线存储资源进行管理和加载

* <b>在线情况</b>

浏览器发现 `html` 头部有 `manifest` 属性，它会请求 manifest 文件，如果是第一次访问页面，那么浏览器就会根据 manifest 文件的内容下载相应的资源并且进行离线存储。如果已经访问过页面并且资源已经进行离线存储了，那么浏览器会使用离线的资源加载页面，然后浏览器会对比新的 manifest 文件和旧的 manifest 文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，就会重新下载文件中的资源并进行离线存储。

* <b>离线情况</b>

浏览器会直接使用离线存储的资源。

## title 与 h1 的区别、b 与 strong 的区别、i 与 em 的区别

* title 属性没有明确意义，只是页面的标题；H1 表示层次明确的标题，对SEO有帮助；
* b 标签为字体加粗；strong 标签有加重语义的效果，对SEO有帮助；
* i 表示内容展示为斜体；em 表示强调文本，对SEO有帮助；

## iframe 有哪些优缺点

`iframe`（内联框架）是一种HTML元素，用于在网页中嵌入另一个文档

<b>优点:</b>

1. <b>嵌入其他页面或内容</b>：iframe 允许在一个页面中嵌入另一个页面或内容，使得可以在同一个页面上展示不同来源的信息；
2. <b>模块化</b>：可以将网页分为多个模块，每个模块使用单独的iframe加载，便于管理和维护；
3. <b>异步加载</b>：iframe可以异步加载，不会阻塞整个页面的加载，提高页面性能；
4. <b>独立性</b>：iframe内部的内容是相对独立的，不受外部页面的影响，这有助于隔离样式和脚本；

<b>缺点:</b>

1. <b>性能问题</b>：加载多个 iframe 可能会导致性能问题，特别是在移动设备上；
2. <b>可访问性问题</b>：使用 iframe 可能导致可访问性问题，因为内部内容可能不容易被屏幕阅读器等辅助技术获取；
3. <b>SEO问题</b>：搜索引擎可能难以正确解析和索引iframe中的内容，影响网页的搜索排名；
4. <b>安全性问题</b>： 如果嵌入的内容不受信任，可能存在安全风险，例如跨站脚本攻击（XSS）；
5. <b>浏览器兼容性</b>：不同浏览器对iframe的处理方式可能略有差异，需要额外的注意和测试；

### 父页面 与 iframe 通信

1. postMessage 方法通信；
2. window.name 通信；
3. 通过 URL 参数
4. localStorage 或 SessionStorage 通信；

父页面与 `iframe` 之间使用 `postMessage` 进行相互通信代码：

父页面：
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Parent Page</title>
</head>
<body>

<iframe src="child.html" id="myIframe" width="400" height="300"></iframe>

<script>
  // 获取 iframe 元素
  const iframe = document.getElementById('myIframe');

  // 向 iframe 发送消息
  iframe.contentWindow.postMessage('Hello from parent!', 'https://example.com');

  // 监听来自 iframe 的消息
  window.addEventListener('message', function (event) {
    if (event.origin === 'https://example.com') {
      console.log('Message from iframe:', event.data);
    }
  });
</script>

</body>
</html>
```

iframe 内部代码（child.html）：
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Child Page</title>
</head>
<body>

<script>
  // 监听来自父页面的消息
  window.addEventListener('message', function (event) {
    if (event.origin === 'https://example.com') {
      console.log('Message from parent:', event.data);

      // 向父页面发送回应消息
      event.source.postMessage('Hello from iframe!', 'https://example.com');
    }
  });
</script>

</body>
</html>
```
