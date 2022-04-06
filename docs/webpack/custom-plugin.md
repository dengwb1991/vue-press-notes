# 自定义 Plugin

:::tip
以 webpack4.x 为例
:::

## 什么是webpack插件

一个完成的 webpack 插件需要满足以下几点特征

1. 是一个独立的js模块
2. 模块对外暴露一个js函数
3. 函数的原型上定义了一个 `apply` 方法，方法注入了 `compiler` 对象作为参数
4. `apply` 方法中通过调用 `compiler` 对象挂载 webpack 事件钩子，钩子回调中能拿到当前编译 `compilation` 对象，如果是异步编译插件则拿到回调 callback.
5. 完成自定义编译流程，处理 compiltion 对象的内部数据
6. 如果是异步插件，则数据处理完后执行 callback 回调


## 以 some-webpack-plugin 为例

写法：

```js
// es5
var pluginName = 'some-webpack-plugin'
function SomeWebpackPlugin (opt) {
	this.options = opt
}
SomeWebpackPlugin.prototype.apply = function (compiler) {
	if (compiler.hooks) { // webpack4 +
    	compiler.hooks.emit.tapAsync(pluginName, function (compilation, callback) {
        // ...
        callback()
      })
    } else {
    	compiler.plugin('emit', function (compilation, callback) {
        // ...
        callback()
      })
    }
}

// es6
const pluginName = 'some-webpack-plugin'
class SomeWebpackPlugin {
	constructor (opt) {
    	this.options = opt
    }
    apply (compiler) {
    	const { hooks } = compiler
        if (hooks) {
        	hooks.emit.tapAsync(pluginName, (compilation, callback) => {})
        } else {
        	compiler.plugin('emit', (compilation, callback) => {})
        }
    }
}

module.exports = SomewebpackPlugin
```

## Compiler 与 Compilation

1. Compiler 对象包含了 Webpack 环境所有的配置信息；
2. Compilation 对象包含了当前的模块资源、编译生成资源、资源变化的文件等；
3. Compiler 与 Compilation 的区别在于：Compiler 代表了整个 Webpack 从启动到关闭的生命周期，而 Compilation 只代表了一次新的编译；

* [Compiler](https://github.com/webpack/webpack/blob/main/lib/Compiler.js)

compiler 对象是 webpack 的编译器对象，webpack 的核心就是编译器，compiler 对象会在启动 webpack 的时候被一次性的初始化，compiler 对象中包含了所有 webpack 可自定义操作的配置，例如 loader 的配置，plugin 的配置，entry 的配置等各种原始 webpack 配置等，在 webpack 插件中的自定义子编译流程中，我们肯定会用到 compiler 对象中的相关配置信息，我们相当于可以通过 compiler 对象拿到 webpack 的主环境所有的信息。


* [Compilation](https://github.com/webpack/webpack/blob/main/lib/Compilation.js)

这里首先需要了解一下什么是编译资源，编译资源是 webpack 通过配置生成的一份静态资源管理 Map（一切都在内存中保存），以 key-value 的形式描述一个 webpack 打包后的文件，编译资源就是这一个个 key-value 组成的 Map。而编译资源就是需要由 compilation 对象生成的。

compilation 实例继承于 compiler，compilation 对象代表了一次单一的版本 webpack 构建和生成编译资源的过程。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，一次新的编译将被创建，从而生成一组新的编译资源以及新的 compilation 对象。一个 compilation 对象包含了 当前的模块资源、编译生成资源、变化的文件、以及 被跟踪依赖的状态信息。编译对象也提供了很多关键点回调供插件做自定义处理时选择使用。

由此可见，如果开发者需要通过一个插件的方式完成一个自定义的编译工作的话，如果涉及到需要改变编译后的资源产物，必定离不开这个 compilation 对象。

如果需要了解 compiler 和 compilation 对象的详情，可以通过在插件中 console.log(compilation) 的方式进行查看对象所包含的内容，然而如果还想了解的更加透彻的话，看源码是一个非常好的途径，将会使你对 webpack 的认识更加深刻。

## webpack插件机制

webpack 以插件的形式提供了灵活强大的自定义 api 功能。使用插件，我们可以为 webpack 添加功能。另外，webpack 提供生命周期钩子以便注册插件。在每个生命周期点，webpack 会运行所有注册的插件，并提供当前 webpack 编译状态信息。

作为 webpack 的使用者和开发者，如果想要玩转 webpack，自定义一些自己的 webpack 插件是非常有必要的，而想要更好的写出更加完善的 webpack 插件，需要更加深刻的了解 webpack 的插件机制，以及了解整个 webpack 插件机制是如何运作起来的，webpack 插件机制为 webpack 平台带来了极大的灵活性，而这一插件机制追根溯源却离不开一个叫做 Tapable 的库。


### Tapable & Tapable 实例

* [Tapable 文档](https://github.com/webpack/tapable)

webpack 的插件架构主要基于 Tapable 实现的，Tapable 是 webpack 项目组的一个内部库，主要是抽象了一套插件机制。webpack 源代码中的一些 Tapable 实例都继承或混合了 Tapable 类。Tapable 能够让我们为 javaScript 模块添加并应用插件。 它可以被其它模块继承或混合。它类似于 NodeJS 的 EventEmitter 类，专注于自定义事件的触发和操作。 除此之外, Tapable 允许你通过回调函数的参数访问事件的生产者。


1. tapable 这个小型 library 是 webpack 的一个核心工具
2. Webpack 的 Tapable 事件流机制保证了插件的有序性，使得整个系统扩展性良好
3. Tapable 为 webpack 提供了统一的插件接口（钩子）类型定义，它是 webpack 的核心功能库

:::tip
简单来说Tapable就是webpack用来创建钩子的库，为webpack提供了插件接口的支柱。
:::

它就是暴露了9个 `Hooks` 类，以及3种方法(`tap`、`tapAsync`、`tapPromise`)，可用于为插件创建钩子。

```js
const {
	SyncHook, // 同步串行钩子，在触发事件之后，会按照事件注册的先后顺序执行所有的事件处理函数，不关心返回值
	SyncBailHook, // 同步串行钩子，如果事件处理函数执行时有一个返回值不为空。则跳过剩下未执行的事件处理函数
	SyncWaterfallHook, // 同步串行钩子，上一个事件处理函数的返回值作为参数传递给下一个事件处理函数，依次类推
	SyncLoopHook, // 同步循环钩子，事件处理函数返回true表示继续循环，如果返回false的话，表示结束循环
	AsyncParallelHook, // 异步并发钩子，不关心返回值
	AsyncParallelBailHook, // 异步并发钩子，只要监听函数的返回值不为 null，就会忽略后面的监听函数执行，直接跳跃到callAsync等触发函数绑定的回调函数，然后执行这个被绑定的回调函数
	AsyncSeriesHook, // 异步串行钩子，不关心callback()的参数
	AsyncSeriesBailHook, // 异步串行钩子，callback()的参数不为null，就会忽略后续的函数，直接执行callAsync函数绑定的回调函数
	AsyncSeriesWaterfallHook // 异步串行钩子，上一个函数的callback(err, data)的第二个参数会传给下一个监听函数
 } = require('tapable')
```

9种`Hooks`类与3种方法之间的关系：

* `Hooks` 类表示的是你的钩子是哪一种类型的，比如 `done`，它就属于 `AsyncSeriesHook` 这个类
* `tap`、`tapAsync`、`tapPromise` 这三个方法是用于注入不同类型的自定义构建行为，因为我们的钩子可能有同步的钩子，也可能有异步的钩子，而我们在注入钩子的时候就得选对这三种方法了。

* `tap`：可以注册同步钩子也可以注册异步钩子
* `tapAsync`：回调方式注册异步钩子
* `tapPromise`：Promise方式注册异步钩子


Tapable 实例对象都有四组成员函数:

* `plugin(name<string>, handler<function>)` - 这个方法允许给 Tapable 实例事件注册一个自定义插件。 这个操作类似于 EventEmitter 的 on(), 注册一个处理函数 -> 监听器到某个信号 -> 事件发生时执行（开发者自定义的插件需要频繁的用到此方法来自定义事件钩子的处理函数，以便被主编译流程 emit 触发）。
* `apply(...pluginInstances<AnyPlugin|function>[])` - AnyPlugin 是 AbstractPlugin 的子类，或者是一个有 apply 方法的类（或者，少数情况下是一个对象），或者只是一个有注册代码的函数。这个方法只是 apply 插件的定义，所以正真的事件监听器会被注册到 Tapable 实例的注册表。
* `applyPlugins*(name<string>, ...)` - 这是一组函数，使用这组函数，Tapable 实例可以对指定 hash 下的所有插件执行 apply。 这些方法执行类似于 EventEmitter 的 emit(), 可以针对不同的使用情况采用不同的策略控制事件发射（webpack 内部实现机制中在主流程的编译过程中频繁的使用此方法来 emit 外界插件的自定义的插件自定义的事件钩子）。
* `mixin(pt<Object>)` - 一个简单的方法能够以混合的方式扩展 Tapable 的原型，而非继承。 


Tapable 的 [README](https://github.com/webpack/tapable/blob/master/README.md) 中也有详细的描述，值得注意的是这组 applyPlugins* 方法，* 表示着不同情况的事件注册，这组 applyPlugins* 方法在 webpack 的源码中随处可见，它们也涉及到 webpack 插件的执行顺序，不同的 applyPlugins* 对应着以下不同的情况：

* 同步串行执行插件 - applyPlugins()
* 并行执行插件 - applyPluginsParallel()
* 插件一个接一个的执行,并且每个插件接收上一个插件的返回值(瀑布) - applyPluginsWaterfall()
* 异步执行插件 - applyPluginsAsync()
* 保护模式终止插件执行: 一旦某个插件返回 非 undefined，会退出运行流程并返回 这个插件的返回值。这看起来像 EventEmitter 的 once()，但他们是完全不同的 - applyPluginsBailResult()

很多 webpack 中的对象都继承了 Tapable 类，暴露了一个 plugin 方法。插件可以使用 plugin 方法注入自定义的构建步骤。在各种 webpack 插件中你可以看到 compiler.plugin 和 compilation.plugin 被频繁使用。基本上，每个插件的调用都在构建流程中绑定了回调来触发特定的步骤。每个插件会在 webpack 启动时被安装一次，webpack 通过调用插件的 apply 方法来安装它们，并且传递一个 webpack compiler 对象的引用。然后你可以调用 compiler.plugin 来访问资源的编译和它们独立的构建步骤。


下面是一个 webpack 插件示例：

```js
// MyPlugin.js

function MyPlugin(options) {
    // Configure your plugin with options...
}

MyPlugin.prototype.apply = function (compiler) {
    compiler.plugin('compile', function (params) {
        console.log('The compiler is starting to compile...');
    });

    compiler.plugin('compilation', function (compilation) {
        console.log('The compiler is starting a new compilation...');

        compilation.plugin('optimize', function () {
            console.log('The compilation is starting to optimize files...');
        });
    });

    // 异步的事件钩子
    compiler.plugin('emit', function (compilation, callback) {
        console.log('The compilation is going to emit files...');
        callback();
    });
};

module.exports = MyPlugin;
```

通过源码阅读或者 webpack plugin 的文档都能够看出，compiler, compilation 对象都是 Tapable 实例，对于 webpack 插件的开发者来说，知道 webpack 源代码中有哪些 Tapable 实例是非常重要的。这些实例提供各种 事件钩子，以便开发者附加自定义插件。

> 通过阅读 webpack 源码，可以发现一个有意思的设计，webpack 的核心是 webpack 的 compiler 对象，而 compiler 对象本身就是一个 Tapable 实例。compiler 对象的职责是编译 webpack 的配置对象，并返回一个 Compilation 实例。当 Compilation 实例运行时，它会创建所需的 bundle（也就是编译结果了）。

## webpack 运行流程

在这里需要先深入的了解一下 webpack 的整个运行流程，在写一个 webpack 插件的时候，我们需要在恰当的时候做恰当的处理，而 webpack 对外暴露的事件钩子都是基于 webpack 的生命周期的基础上。下面是一张 webpack 运行流程示意图（细粒度的太复杂了，webpack 最受人诟病的就是因为它的复杂，然而最吸引人的也是因为它的复杂）

![](http://vuetool.dengwb.com/static/process-principle-of-webpack.jpeg)

## webpack 插件相关的事件钩子

通过以上的了解，webpack 插件中的自定义子编译流程都是需要配合 webpack 主编译流程发挥功效的，我们如何保证我们的插件中所定义的编译逻辑能够准确的在合适的时机运行呢？

其实，之前已经了解过 webpack 的两个重要的对象，compiler 和 compilation 对象在这里发挥了重要的作用，我们也已经了解到这两个对象都是 Tapable 实例，webpack 通过继承的 Tapable 实例的方法，分别在 compile 对象和 compilation 对象都注册了一系列的事件钩子，这样可以使得开发者能够在 webpack 编译的任何过程中都能够插入自己的自定义处理逻辑。

webpack 的做法就是使用 Tapable 实例的 applyPlugins* 方法来预先设定好这些事件钩子，当然，webpack 在一些其他的 Tapable 实例对象中也定义了一些内部或外部的事件钩子，在这里我们主要了解和插件相关的 compiler 对象和 compilation 对象一共有哪些事件钩子。


### compiler 事件钩子

| 事件钩子 | 触发时机 | 参数 | 类型 |
| -- | -- | -- | -- |
| entry-option | 在 entry 配置项处理过之后，执行插件 | - | SyncBailHook 同步保险 |
| run | 开始读取 records 之前，钩入(hook into) compiler | compiler | AsyncSeriesHook 异步串行 |
| compile | 一个新的编译(compilation)创建之后，钩入(hook into) compiler | compilationParams | 	SyncHook 同步 |
| compilation | 编译(compilation)创建之后，执行插件 | compilation | 	SyncHook 同步 |
| make | 从 entry 开始递归分析依赖，准备对每个模块进行 build | compilation | AsyncParallelHook 异步并行 |
| after-compile | 编译 build 过程结束 | compilation | AsyncSeriesHook 异步串行 |
| emit | 生成资源到 output 目录之前 | compilation | AsyncSeriesHook 异步串行 |
| after-emit | 生成资源到 output 目录之后 | compilation | AsyncSeriesHook 异步串行 |
| done | 编译(compilation)完成 | stats | SyncHook 同步 |
| failed | 编译失败 | error | SyncHook 同步 |

compiler 对象如何绑定事件钩子呢？由于 webpack 自身在继承于 Tapable 的 compiler 对象的各个关键时间点已经通过 `applyPlugins*()` 方法注册了事件钩子，开发者只需要绑定事件就行，compiler 会在合适的时机去 emit 开发者绑定的事件，compiler 的绑定事件钩子的方式如下：

```js
// 前提是先要拿到 compiler 对象，apply 方法的回调中就能拿到，这里假设能拿到 compiler 对象
compiler.plugin('emit', function (compilation, callback) {
    // 可以得到 compilation 对象，如果是异步的事件钩子，能拿到 callback 回调。
    // 做一些异步的事情
    setTimeout(function () {
        console.log("Done with async work...");
        callback();
    }, 1000);
});
```

可参考在顶部标题2中有 es5、es6示例，可以明显的看出，compiler 的事件钩子是建立在整个编译过程的基础上的，粒度较粗，通常对编译的结果要做细粒度的处理的时候，少不了 compilation 对象上定义的事件钩子。

### compilation 事件钩子

前面已经介绍过 compilation 对象，compilation 对象代表了一次单一的版本 webpack 构建和生成编译资源的过程，compilation 对象可以访问所有的模块和它们的依赖（大部分是循环依赖）。在编译阶段，模块被 加载，封闭，优化，分块，哈希 和 重建 等等，这将是编译中任何操作主要的生命周期。

要处理模块层面的逻辑，非常有必要了解 compilation 的事件钩子，当然，非常多的 webpack 插件在都巧妙的应用这些事件钩子完成了很多不可思议的工作。具体的 compilation 事件钩子都有哪些呢？还是挑一些比较常用和重要的来解释一下，具体完整的 complation 的事件钩子可以参考官方文档

* normal-module-loader

普通模块 loader，真实地一个一个加载模块图(分析之后的所有模块一种数据结构)中所有的模块的函数。

```js
// 前提是能先取到 complation 对象（可以通过 compiler 事件钩子取到）
compilation.plugin('normal-module-loader', function (loaderContext, module) {
    // 这里是所有模块被加载的地方
    // 一个接一个，此时还没有依赖被创建，想拿到啥模块直接通过 module 取
});
```

* seal

编译的封闭已经开始，这个时候再也收不到任何的模块了，进入编译封闭阶段（参考 webpack 流程图）。

```js
compilation.plugin('seal', function () {
    // 你已经不能再接收到任何模块
    // 回调没有参数
});
```

* optimize

优化编译，这个事件钩子特别重要，很多插件的优化工作都是基于这个事件钩子，表示 webpack 已经进入优化阶段。

```js
compilation.plugin('optimize', function () {
    // webpack 已经进入优化阶段
    // 回调没有参数
});
```

* optimize-modules

模块的优化

```js
compilation.plugin('optimize-modules', function (modules) {
    // 等待处理的模块数组
    console.log(modules);
});
```

* optimize-chunks

这是个重要的事件钩子，webpack 的 chunk 优化阶段。可以拿到模块的依赖，loader 等，并进行相应的处理。

```js
compilation.plugin('optimize-chunks', function (chunks) {
    //这里一般只有一个 chunk，除非你在配置中指定了多个入口
    chunks.forEach(function (chunk) {
        // chunk 含有模块的循环引用
        chunk.modules.forEach(function (module) {
            console.log(module);
            // module.loaders, module.rawRequest, module.dependencies 等。
        });
    });
});
```

* additional-assets

这是一个异步的事件钩子，在这个阶段可以为 compilation 对象创建额外的 assets，也就是说可以异步的在最后的产物中加入自己自定义的一些资源，可以看一下往 assets 里面新增一个 svg 资源的例子：

```js
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('additional-assets', function (callback) {
        download('https://some.host/some/path/some.svg', function (resp) {
            if (resp.status === 200) {
                compilation.assets['webpack-version.svg'] = toAsset(resp);
                callback();
            }
            else {
                callback(new Error('[webpack-example-plugin] Unable to download the image'));
            }
        })
    });
});
```

* optimize-chunk-assets

优化 chunk 的 assets 的事件钩子，这个优化阶段可以改变 chunk 的 assets 以达到重新改变资源内容的目。assets 被存储在 this.assets 中，但是它们并不都是 chunk 的 assets。一个 chunk 有一个 files 属性指出这个 chunk 创建的所有文件。附加的 assets 被存储在 this.additionalChunkAssets 中。

下面是一个为每个 chunk 添加注释头信息的例子：

```js
compilation.plugin("optimize-chunk-assets", function (chunks, callback) {
    chunks.forEach(function (chunk) {
        chunk.files.forEach(function (file) {
            compilation.assets[file] = '/**some comments info**/\n' + compilation.assets[file];
        });
    });
    callback();
});
```

* optimize-assets

优化所有的 assets 的异步事件钩子，在这个阶段可以直接通过 this.assets 拿到所有的 assets，并进行自定义操作。类似 optimize-chunk-assets，但是这个事件钩子的回调是拿不到 chunks 的。

```js
compilation.plugin("optimize-assets", function (asstes, callback) {
    console.log(assets);
    // 可以直接操作 assets 里面的 file
    callback();
});
```

compilation 对象还有一些其他的事件钩子，可以直接阅读 webpack 官方文档，文档这块写的不是很详细，最好是都试一试这些事件钩子，放到代码中 console.log() 跑一跑，看看具体的实现和结果就能够加深理解了。

## 传统形式compiler.plugin 与 推荐形式compiler.hooks

1. `compiler.plugin`

```js
apply (compiler) {
    compiler.plugin('done', () => {
    })
}
```

2. `compiler.hooks` [plugin API](https://www.webpackjs.com/api/plugins/#tapable)

```js
apply (compiler) {
  compiler.hooks.done.tap('NAME', () => {
  })
}
```

* **compiler**：一个扩展至 `Tapable` 的对象
* **compiler.hooks**：`compiler` 对象上的一个属性，允许我们使用不同的钩子函数
* **.done**：`hooks`中常用的一种钩子，表示在一次编译完成后执行，它有一个回调参数 `stats`(暂时没用上)
* **.tap**：表示可以注册同步的钩子和异步的钩子，而在此处因为 `done` 属于异步 `AsyncSeriesHook` 类型的钩子，所以这里表示的是注册done异步钩子。
* **.tap('NAME')**：`tap()` 的第一个参数 `'NAME'`，其实 `tap()` 这个方法它的第一个参数是可以允许接收一个字符串或者一个Tap类的对象的，不过在此处我们不深究，你先随便传一个字符串就行了，我把它理解为这次调用钩子的方法名。


### compile 和 compilation 执行案例

```js
function webpackPlugin (options) {
  this.options = options
}
webpackPlugin.prototype.apply = function (compiler) {
  compiler.hooks.compile.tap('NAME', () => {
    console.log('compile-text')
  })
  compiler.hooks.compilation.tap('NAME', () => {
    console.log('compilation-text')
  })
}
module.exports = webpackPlugin
```

在这个插件中，分别调用了 `compile` 和 `compilation` 两个钩子函数

当执行 `build` 时，`compile-text` 会打印一次，`compilation-text` 打印次数与打包产出文件的个数相等.


## 示例

### Compiler 和 Compilation

```js
class AddModePlugin {
  constructor () {
  }
  apply (compiler) {
    compiler.hooks.compilation.tap('NAME', (compilation) => {
      compilation.hooks.chunkAsset.tap('NAME', (chunk, filename) => {
        console.log(chunk)
        console.log(filename)
      })
    })
  }
}

module.exports = AddModePlugin
```

[chunkAsset文档](https://www.webpackjs.com/api/compilation-hooks/#chunkasset)

* `chunk`：表示的应该就是当前的模块吧
* `filename`：模块的名称

### 记录打包文件到md文件

```js
function FileListPlugin (options) {
  this.options = options || {};
  this.filename = this.options.filename || 'fileList.md'
}

FileListPlugin.prototype.apply = function (compiler) {
  // 1.
  compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
    // 2.
    const fileListName = this.filename;
    // 3.
    let len = Object.keys(compilation.assets).length;
    // 4.
    let content = `# 一共有${len}个文件\n\n`;
    // 5.
    for (let filename in compilation.assets) {
      content += `- ${filename}\n`
    }
    // 6.
    compilation.assets[fileListName] = {
      // 7.
      source: function () {
        return content;
      },
      // 8.
      size: function () {
        return content.length;
      }
    }
    // 9.
    cb();
  })
}
module.exports = FileListPlugin;
```

1. 通过 `compiler.hooks.emit.tapAsync()` 来触发生成资源到 `output` 目录之前的钩子，且回调函数会有两个参数，一个是 `compilation`，一个是cb回调函数
2. 要生成的markdown文件的名称
3. 通过compilation.assets获取到所有待生成的文件，这里是获取它的长度
4. 定义markdown文件的内容，也就是先定义一个一级标题，\n表示的是换行符
5. 将每一项文件的名称写入markdown文件内
6. 给我们即将生成的dist文件夹里添加一个新的资源，资源的名称就是fileListName变量
7. 写入资源的内容
8. 指定新资源的大小，用于webpack展示
9. 由于我们使用的是tapAsync异步调用，所以必须执行一个回调函数cb，否则打包后就只会创建一个空的dist文件夹。


#### 使用tapPromise重写

延迟1秒后执行，同时也可以使用 async/await

```js
compiler.hooks.emit.tapPromise('FileListPlugin', (compilation) => {
    return new Promise(resolve => {
    setTimeout(() => {
        resolve()
    }, 1000)
    }).then(() => {
    const fileListName = this.filename
    let len = Object.keys(compilation.assets).length
    let content = `# 一共有${len}个文件\n\n`
    for (let filename in compilation.assets) {
        content += `- ${filename}\n`
    }
    compilation.assets[fileListName] = {
        source: function () {
        return content;
        },
        size: function () {
        return content.length;
        }
    }
    })
})
```

### Watch-plugin 监听文件案例

#### 需求

1. 当项目在开启观察者watch模式的时候，监听每一次资源的改动
2. 当每次资源变动了，将改动资源的个数以及改动资源的列表输出到控制台中

#### API

* watchRun

类型：AsyncSeriesHook

监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前。

参数：compiler

* watchClose

类型：SyncHook

监听模式停止。

#### 代码

```js
// package.json
{
  "script": "webpack --watch --mode development"
}
```

```js
function WatcherPlugin (options) {
  this.options = options || {};
}

WatcherPlugin.prototype.apply = function (compiler) {
  compiler.hooks.watchRun.tapAsync('WatcherPlugin', (compiler, cb) => {
    // let mtimes = compiler.watchFileSystem.watcher.mtimes;
    // let mtimesKeys = Object.keys(mtimes);
    // if (mtimesKeys.length > 0) {
    //   console.log(`本次一共改动了${mtimesKeys.length}个文件,目录为:`)
    //   console.log(mtimesKeys)
    //   console.log('------------分割线-------------')
    // }

    const fileWatchers = compiler.watchFileSystem.watcher.fileWatchers;
    console.log(fileWatchers)
    let paths = fileWatchers.map(watcher => watcher.path).filter(path => !/(node_modules)/.test(path))
    
    if (paths.length > 0) {
      console.log(`本次一共改动了${paths.length}个文件,目录为:`)
      console.log(paths)
      console.log('------------分割线-------------')
    }

    cb()
  })
  compiler.hooks.watchClose.tap('WatcherPlugin', () => {
    console.log('done')
  })
}
module.exports = WatcherPlugin

```

`compiler.watchFileSystem.watcher.mtimes` 可以获得变动后的文件路径 

`compiler.watchFileSystem.watcher.fileWatchers` 可以获得更加详细的信息

默认情况下 Webpack 只会监视入口和其依赖的模块是否发生变化，在有些情况下项目可能需要引入新的文件，例如引入一个 HTML 文件。 由于 JavaScript 文件不会去导入 HTML 文件，Webpack 就不会监听 HTML 文件的变化，编辑 HTML 文件时就不会重新触发新的 Compilation。 为了监听 HTML 文件的变化，我们需要把 HTML 文件加入到依赖列表中，为此可以使用如下代码：

```js
compiler.plugin('after-compile', (compilation, callback) => {
  // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
  compilation.fileDependencies.push(filePath)
  callback()
})

```

### Decide-html-plugin 检测是否使用某个plugin

```js
DecideHtmlPlugin.prototype.apply = function (compiler) {
  compiler.hooks.afterPlugins.tap('DecideHtmlPlugin', compiler => {
    const plugins = compiler.options.plugins;
    const hasHtmlPlugin = plugins.some(plugin => {
      return plugin.__proto__.constructor.name === 'HtmlWebpackPlugin'
    })
    if (hasHtmlPlugin) {
      console.log('使用了html-webpack-plugin')
    }
  })
}
```

### 对打包后的文件进行修改

```js
const ConcatSource = require('webpack-sources').ConcatSource;

class CustomPlugin {
  constructor () {}
  apply (compiler) {
    compiler.hooks.compilation.tap('CustomPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tap('CustomPlugin', (chunks) => {
        chunks.forEach((chunk) => {
          chunk.files.forEach((fileName) => {
            // 判断具体要修改的文件，假设简单通过 chunk 的文件名称判断入口
            if (fileName.indexOf('app') > -1) {
              // 在源码头尾各增加内容
              compilation.assets[fileName] = new ConcatSource(
                `console.log(123);`,
                compilation.assets[fileName],
                `console.log(234);`,
              );

              // 替换
              const contents = compilation.assets[fileName].source()
              const withoutComments = contents.replace('abc', '123')
              compilation.assets[fileName] = {
                  source: () => withoutComments,
                  size: () => withoutComments.length
              }
            }
          })
        })
      })
    })
      
  }
}

module.exports = CustomPlugin
```

## 链接

[看清楚真正的 Webpack 插件](https://zoumiaojiang.com/article/what-is-real-webpack-plugin/#webpack-3)

[webpack4核心模块tapable源码解析](https://www.cnblogs.com/tugenhua0707/p/11317557.html)

[深入浅出 Webpack](http://webpack.wuhaolin.cn/5%E5%8E%9F%E7%90%86/5-4%E7%BC%96%E5%86%99Plugin.html)

[define-plugin 实现条件编译](https://github.com/dengwb1991/lifelong-learning/tree/master/webpack/001_define-plugin)

[terser-webpack-plugin 实现删除console](https://github.com/dengwb1991/lifelong-learning/tree/master/webpack/002_remove-console)

[手写plugin 实现条件编译](https://github.com/dengwb1991/lifelong-learning/tree/master/webpack/004_conditional-compile-plugin)

[手写plugin 详解教程](https://github.com/dengwb1991/lifelong-learning/tree/master/webpack/005_handwritten-plugin)

[手写plugin 对编译后的文件内容进行修改](https://github.com/dengwb1991/lifelong-learning/tree/master/webpack/006_polymorphism-plugin)