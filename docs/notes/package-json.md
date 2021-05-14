# package.json

## package.json 属性合集

[官方参考文档](https://docs.npmjs.com/files/package.json)

### yarn相关字段

`yarn` 和 `npm` 类似都属于依赖管理工具，但 `yarn` 缓存了每个下载过的包，所以再次使用时无需重复下载，同时利用并行下载以最大化资源利用率，因此安装速度更快。

#### flag

强制安装给定依赖版本

如果你的包只允许给定依赖的一个版本，你想强制和命令行上 yarn install --flat 相同的行为，把这个值设为 `true`。

```json
{
  "flat": true
}
```

#### resolutions

允许你覆盖特定嵌套依赖项的版本

```json
{
  "resolutions": {
    "transitive-package-1": "0.0.29",
    "transitive-package-2": "file:./local-forks/transitive-package-2",
    "dependencies-package-1/transitive-package-3": "^2.1.1"
  }
}
```

### unpkg相关字段

让 `npm` 上所有的文件都开启 `cdn` 服务。

[unpkg](https://unpkg.com/)

```json
{
  "unpkg": "dist/jquery.js"
}
```

### TypeScript相关字段

#### types、typings

就像 main 字段一样，定义一个针对 TypeScript 的入口文件。

```json
{
  "main": "./lib/main.js",
  "types": "./lib/main.d.ts"
}
```

[TypeScript documentation](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)


### browserslist相关字段

#### browserslist

设置项目的浏览器兼容情况。

```json
{
  "browserslist": [
    "> 1%",
    "last 2 versions"
  ]
}
```

支持的工具: 
* [autoprefixer](https://github.com/postcss/autoprefixer)
* [Babel](https://github.com/babel/babel/tree/master/packages/babel-preset-env)
* [postcss-preset-env](https://github.com/csstools/postcss-preset-env)
* [eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat)
* [stylelint-no-unsupported-browser-features](https://github.com/ismay/stylelint-no-unsupported-browser-features)
* [postcss-normalize](https://github.com/csstools/postcss-normalize)

更多参考 [browserslist](https://github.com/browserslist/browserslist)

### 发型打包相关字段

相关 [Setting up multi-platform npm packages](https://2ality.com/2017/04/setting-up-multi-platform-packages.html#support-by-bundlers)

#### module

```json
{
  "main": "./lib/main.js",
  "module": "./lib/main.m.js"
}
```

就像 `main` 字段一样，定义一个针对 es6 模块及语法的入口文件。

构建工具在构建项目的时候，如果发现了这个字段，会首先使用这个字段指向的文件，如果未定义，则回退到 `main` 字段指向的文件。

支持工具:

* [rollup](https://github.com/rollup/rollup-plugin-node-resolve)
* [webpack](https://webpack.js.org/configuration/resolve/#resolve-mainfields)

详细参考[rollup-pkg.module](https://github.com/rollup/rollup/wiki/pkg.module)

#### browser

```json
{
  "main": "./lib/main.js",
  "browser": "./lib/main.b.js"
}
```

指定该模块供浏览器使用的入口文件。

如果这个字段未定义，则回退到 `main` 字段指向的文件。

支持的工具：

* [rollup](https://github.com/rollup/rollup-plugin-node-resolve)
* [webpack](https://webpack.js.org/configuration/resolve/#resolve-mainfields)
* [browserify](https://github.com/browserify/browserify-handbook#browser-field)

详细参考 [babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver/issues/41)

#### esnext

```json
{
  "main": "main.js",
  "esnext": "main-esnext.js"
}

# or

{
  "main": "main.js",
  "esnext": {
    "main": "main-esnext.js",
    "browser": "browser-specific-main-esnext.js"
  }
}
```

使用 `es` 模块化规范，`stage 4` 特性的源代码

详细参考 [Transpiling dependencies with Babel](https://2ality.com/2017/04/transpiling-dependencies-babel.html), [Delivering untranspiled source code via npm](https://2ality.com/2017/06/pkg-esnext.html).

#### es2015

```json
{
  "main": "main.js",
  "es2015": "main-es2015.js"
}
```

Angular 定义的未转码的 es6 源码 [详细参考](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/edit#)

#### esm

[详细参考](https://github.com/nodejs/node-eps/pull/60)

### webpack 相关字段

#### sideEffects

```json
{
  "sideEffects": true|false
}
```

声明该模块是否包含 sideEffects（副作用），从而可以为 tree-shaking 提供更大的优化空间。


详细参考 [sideEffects example](https://github.com/webpack/webpack/tree/master/examples/side-effects), [proposal for marking functions as pure](https://github.com/rollup/rollup/issues/1293), [eslint-plugin-tree-shaking](https://www.npmjs.com/package/eslint-plugin-tree-shaking).

### microbundle 相关字段

[microbundle](https://github.com/developit/microbundle): 基于 rollup 零配置快速打包工具

#### source

```json
{
  "source": "src/index.js"
}
```

源文件入口文件

详细参考 [Specifying builds in package.json.](https://github.com/developit/microbundle#specifying-builds-in-packagejson)

#### umd:main

```json
{
  "umd:main": "dist/main.umd.js"
}
```

umd 模式 bundle 文件


### parcel 相关字段

[parcel](https://github.com/parcel-bundler/parcel): 零配置打包工具。

[source](https://github.com/parcel-bundler/parcel/issues/1652)

### babel 相关字段

[babel](https://github.com/babel/babel)

### eslint 相关字段

[eslintConfig](https://github.com/eslint/eslint)

### jest 相关字段

```json
{
  "jest": {
    "verbose": true
  }
}
```

详细参考 [jest docs](https://jest-bot.github.io/jest/docs/configuration.html).


## 更多

https://segmentfault.com/a/1190000016365409

https://www.cnblogs.com/cangqinglang/p/8336754.html

https://github.com/senntyou/blogs