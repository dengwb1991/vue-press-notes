# 开发问题总结

## React 的 BrowserRouter 模式下刷新 404

开发模式下，设置 devServer

```js
devServer {
  historyApiFallback: true
}
```

nginx下，设置如下

```js
location /pwa {
  ssi on;
  ssi_silent_errors on;
  try_files $uri /pwa/index.html; // browserHistory模式 404问题
  autoindex on; // 输入到/pwa 会直接定向到index.html
  root /www/workspaces/webpack-demo/dist/;
  index index.html index.htm;
}
```