# Babel 7

[Babel文档](https://www.babeljs.cn/docs)

## Babel 是什么？

Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中。下面列出的是 Babel 能为你做的事情：

* 语法转换
* 通过 Polyfill 方式在目标环境中添加缺失的特性 (通过 [@babel/polyfill](https://www.babeljs.cn/docs/babel-polyfill) 模块)
* 源码转换 (codemods)

其目的是：

* ES2015+ 的语法转化（如箭头函数转成普通函数）
* ES2015+ 新增的方法转化（如数组新增的includes方法转化兼容低版本游览器）

## @babel/cli 与 babel-cli

babel-cli 为 `babel6` 使用的包，@babel/cli 为 `babel7` 以后使用的包. 除此之外还有 `@babel/core` 等等.

换言之，有@开头是babel7 反之为babel6.

## 插件

Babel 是一个编译器（输入源码 => 输出编译后的代码）。就像其他编译器一样，编译过程分为三个阶段：解析、转换和打印输出。

现在，Babel 虽然开箱即用，但是什么动作都不做。它基本上类似于 `const babel = code => code`; ，将代码解析之后再输出同样的代码。如果想要 Babel 做一些实际的工作，就需要为其添加插件。

## 预设（Presets）

`babel`提供了一个叫做 `preset` 的概念，其实就是 `插件包`，意味着babel会预先替我们做好了一系列的插件包.

### 插件包

常用的插件包

* @babel/preset-env
* @babel/preset-flow
* @babel/preset-react
* @babel/preset-typescript

## babel 配置

* @babel/cli

@babel/cli 是babel提供的命令行工具，主要是提供babel这个命令。 官网推荐安装在项目中，而不是安装在全局环境，因为每个项目用的babel的版本不一样。可以单独管理和升级。更主要是为了方便以后项目的迁移。

* @babel/core

Babel 的核心功能包含在 @babel/core 模块中。必须安装.

* @babel/plugin-transform-arrow-functions

编译 ES2015 箭头函数到 ES5

```js
// .babelrc
{
    "plugins": [
        "@babel/plugin-transform-arrow-functions"
    ]
}
```

* @babel/preset-env

预设 preset 插件包，包含 `@babel/plugin-transform-arrow-functions`. 具体说明：[preset-env](https://babeljs.io/docs/en/babel-preset-env)

预设包并不能完全转化所有es6新增语法，比如 `includes`. 这时可以使用 `@babel/polyfill`

或者配置 `useBuiltIns` 为 `usage`，就只会包含代码需要的 polyfill. 同时安装 `core-js@3` 库. 

```js
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "browsers": [
                        "> 1%",
                        "last 2 versions"
                    ]
                },
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ]
    ]
}
```

* @babel/polyfill

`polyfill` 我们又称垫片，见名知意，所谓垫片也就是垫平不同浏览器或者不同环境下的差异，因为有的环境支持这个函数，有的环境不支持这种函数，解决的是有与没有的问题，这个是靠单纯的 `@babel/preset-env` 不能解决的，因为 `@babel/preset-env` 解决的是将高版本写法转化成低版本写法的问题，因为不同环境下低版本的写法有可能不同而已。

```js
// app.js
import '@babel/polyfill';
```

* @babel/plugin-transform-runtime

所有帮助程序都将引用模块 `@babel/runtime`，这样就可以避免编译后的代码中出现重复的帮助程序，有效减少包体积. `@babel/plugin-transform-runtime` 需要和 `@babel/runtime` 配合使用.

`babel/plugin-transform-runtime` 通常仅在开发时使用，但是运行时最终代码需要依赖 `@babel/runtime`，所以 `@babel/runtime` 必须要作为生产依赖被安装，

```bash
$ npm install --save-dev @babel/plugin-transform-runtime
$ npm install --save @babel/runtime
```

```js
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIns": "usage",
                "corejs": 3
            }
        ]
    ],
    "plugins": [
        [
            "@babel/plugin-transform-runtime"
        ]
    ]
}
```