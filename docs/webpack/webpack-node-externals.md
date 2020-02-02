# webpack-node-externals

排除不必要的依赖，如对vue组件进行编译打包时，排除对vue源码的依赖.

[npm link](https://www.npmjs.com/package/webpack-node-externals)

## 安装使用

```bash
$ npm install webpack-node-externals --save-dev
```

webpack.config.js

```js
var nodeExternals = require('webpack-node-externals');
...
module.exports = {
    ...
    target: 'node', // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    ...
};
```
