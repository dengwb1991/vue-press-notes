# DllPlugin

`DLLPlugin` 和 `DLLReferencePlugin` 提供了一种可以显著提高构建时性能的方式来拆分包的方法。

## DllPlugin

这个插件是在一个额外的独立的 `webpack` 设置中创建一个只有 `dll` 的 bundle(dll-only-bundle)。 这个插件会生成一个名为 `manifest.json` 的文件，这个文件是用来让 `DLLReferencePlugin` 映射到相关的依赖上去的。

* context (optional): manifest 文件中请求的上下文(context)(默认值为 webpack 的上下文(context))
* name: 暴露出的 DLL 的函数名 (TemplatePaths: [hash] & [name] )
* path: manifest.json 文件的绝对路径 (输出文件)

```js
new webpack.DllPlugin(options)
```

在给定的 `path` 路径下创建一个名为 `manifest.json` 的文件。 这个文件包含了从 require 和 import 的request到模块 id 的映射。 DLLReferencePlugin 也会用到这个文件。

这个插件与 output.library 的选项相结合可以暴露出 (也叫做放入全局域) dll 函数。

## DllReferencePlugin

个插件是在 webpack 主配置文件中设置，把只有 dll 的 bundle (dll-only-bundle(s)) 引用到需要的预编译的依赖。

* context: (绝对路径) manifest (或者是内容属性)中请求的上下文
* manifest: 包含 content 和 name 的对象，或者在编译时(compilation)的一个用于加载的 JSON manifest 绝对路径
* content (optional): 请求到模块 id 的映射 (默认值为 manifest.content)
* name (optional): dll 暴露的地方的名称 (默认值为 manifest.name) (可参考 externals)
* scope (optional): dll 中内容的前缀
* sourceType (optional): dll 是如何暴露的 (libraryTarget)

```js
new webpack.DllReferencePlugin(options)
```

通过引用 dll 的 manifest 文件来把依赖的名称映射到模块的 id 上，之后再在需要的时候通过内置的 __webpack_require__ 函数来 require 他们

与 output.library 保持 name 的一致性。

## 使用

5步配置 DllPlugin

### 第一步

创建 build 文件

```js
// build/webpack.dll.config.js

var path = require("path");
var webpack = require("webpack");

module.exports = {
  // 要打包的模块的数组
  entry: {
    vendor: ['vue/dist/vue.esm.js','vue-router']
  },
  output: {
    path: path.join(__dirname, '../static/js'), // 打包后文件输出的位置
    filename: '[name].dll.js',// vendor.dll.js中暴露出的全局变量名。
    library: '[name]_library' // 与webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library', 
      context: __dirname
    }),
  ]
};
```

### 第二步

在 package.json 的 scripts 里添加命令

```js
"dll": "webpack --config build/webpack.dll.config.js"
```

### 第三步

执行命令，生成 `manifest.json` 和 `vendor.dll.js` 文件。

```bash
$ npm run dll
```

### 第四步

在 webpack.base.conf.js 添加上 DllReferencePlugin

```js
// build/webpack.base.config.js
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    })
  ],
```

### 第五步

在 index.html 中引入 vendor.dll.js

```html
<!-- index.html -->

<div id="app"></div>
<script src="./static/js/vendor.dll.js"></script>
```

## 外链

[webpack plugins dll-plugin](https://webpack.js.org/plugins/dll-plugin/)