# Loader

:::tip
以 webpack4.x 为例
:::

## Loader 的本质

`Loader` 本质上是导出函数的 JavaScript 模块。所导出的函数，可用于实现内容转换。

```js
/**
 * @param {string|Buffer} content 源文件的内容
 * @param {object} [map] 可以被 https://github.com/mozilla/source-map 使用的 SourceMap 数据
 * @param {any} [meta] meta 数据，可以是任何内容
 */
function webpackLoader(content, map, meta) {
  // 你的webpack loader代码
  return content
}
module.exports = webpackLoader
```

## Normal Loader 与 Pitching Loader

模块导出的函数（若是 ES6 模块，则是默认导出的函数）就被称为 `Normal Loader`

* Normal Loader 与 Webpack Loader 分类中定义的 Loader 是不一样的

在 Webpack 中，loader 可以被分为 4 类：`pre`(前置)、`post`(后置)、`normal`(普通)和`inline`(行内)。其中 `pre` 和 `post loader`，可以通过 `rule` 对象的 `enforce` 属性来指定：

```js
// webpack.config.js
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: ["a-loader"],
        enforce: "post", // post loader
      },
      {
        test: /\.txt$/i,
        use: ["b-loader"], // normal loader
      },
      {
        test: /\.txt$/i,
        use: ["c-loader"],
        enforce: "pre", // pre loader
      },
    ]
  }
}
```

### Normal Loader

`Loader` 模块中导出的函数成为 `Normal Loader`

```js
// JS Module

module.exports = function () {}
```

[github Normal Loader](https://github.com/dengwb1991/lifelong-learning/blob/master/webpack/007_normal-loader/README.md)

### Pitching Loader

`Loader` 模块中导出函数的 `pitch` 属性所指向的函数称为 `Pitching Loader`

```js
/**
 * @remainingRequest 剩余请求
 * @precedingRequest 前置请求
 * @data 数据对象
 */
function (remainingRequest, precedingRequest, data) {
 // some code
}
```

1. 与 normal-loader 不同点是 `pitch` 执行顺序与其相反，normal 从右往左，pitch 从左往右
2. 当某个 `Pitching Loader` 返回非 undefined 值时，就会实现熔断效果，跳过剩下的loader

[github Pitching Loader](https://github.com/dengwb1991/lifelong-learning/blob/master/webpack/008_pitching-loader/README.md)

### Loader 的运行过程

#### loaderRunner

webpack 的 NormalModule 的 doBuild 函数调用了 loaderRunder 组件的 runLoaders 去 加载loader 并且 执行loader 工厂方法

#### 过程

1. 调用runLoader 执行初始化
2. iteratePitchingLoaders 遍历数组
3. loadLoader 加载loader，通过require() 方式加载。 并且把加载的工厂方法挂载到 loaderContext.loader 的 normal 中
4. 如果loader 包含pitch 函数，则立即执行
5. 如果是最后一个loader， 调用processResource 加载源码
6. 否则加载下一个loader
7. 调用processResource加载待编译的源代码 并将源码传递给 iterateNormalLoaders 执行
8. iterateNormalLoaders 调用 runSyncOrAsync
9. runSyncOrAsync 调用 loader 的工厂函数，获得编译后的结果


## 同步loader与异步loader

Loader 可以分为同步 Loader 和异步 Loader

* 同步：可以通过 `return` 语句或 `this.callback` 的方式来同步地返回转换后的结果。只是相比 `return` 语句，`this.callback` 方法则更灵活，因为它允许传递多个参数。
* 异步：可以通过 this.async 方法来获取 callback 函数

### 同步loader demo

```js
// sync-loader.js
module.exports = function(source) {
  return source + '-simple'
};
```

```js
// sync-loader-with-multiple-results.js
module.exports = function (source, map, meta) {
  this.callback(null, source + '-simple', map, meta)
  return // 当调用 callback() 函数时，总是返回 undefined
};
```

`this.callback` 方法支持 4 个参数，每个参数的具体作用如下所示：

```ts
interface Callback {
  err: Error | null,        // 错误信息
  content: string | Buffer, // content信息
  sourceMap?: SourceMap,    // sourceMap
  meta?: any                // 会被 webpack 忽略，可以是任何东西
}
```

### 异步loader demo

```js
// async-loader.js
module.exports = function(source) {
   var callback = this.async();
   setTimeout(function() {
     callback(null, source + '-async-simple')
   }, 50)
}
```

## 外链

[多图详解，一次性搞懂Webpack Loader](https://juejin.cn/post/6992754161221632030)