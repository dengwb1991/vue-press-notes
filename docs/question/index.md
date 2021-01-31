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

## Component definition is missing display name

错误提示

```bash
❌ https://google.com/#q=react/display-name
Component definition is missing display name
```

code:

```js
const Renderers = {
  code: ({ value }) => { // 报错
    return <SyntaxHighlighter style={style} language="javascript" children={value} />
  }
}
```

解决方案为方法添加方法名：

```js
const Renderers = {
  code: function render ({ value }) {
    return <SyntaxHighlighter style={style} language="javascript" children={value} />
  }
}
```

[eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react/issues/597)

## Do not pass children as props. Instead, nest children between the opening and closing tags

错误提示

```bash
❌ https://google.com/#q=react/no-children-prop
Do not pass children as props. Instead, nest children between the opening and closing tags
```

code:

```js
const Codes = (props: Props) => {
  return (
    <ReactMarkdown renderers={Renderers} children={props.md}></ReactMarkdown> // 报错
  )
}
```

解决方案：

```js
const Codes = (props: Props) => {
  return (
    <ReactMarkdown renderers={Renderers}>{props.md}</ReactMarkdown>
  )
}
```

[eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-children-prop.md)

## 移动端Input获取焦点拉起系统键盘留白

```js
// 添加 blur 事件，触发后修改滚动条位置，可置顶可还原
$_onBlur () {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  if (scrollTop > 0) {
    window.requestAnimationFrame(this.$_onBlur)
    window.scrollTo(0, scrollTop - scrollTop / 8)
  }
}
```

## 移动端安卓手机Input拉起系统键盘被遮挡

```js
if (/Android/gi.test(navigator.userAgent)) {
  event.target.scrollIntoView({
    block: "center"
  })
}
```