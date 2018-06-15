# 解决跨域传值方案

在HTML5中新增了postMessage方法，postMessage可以实现跨文档消息传输（Cross Document Messaging），Internet Explorer 8, Firefox 3, Opera 9, Chrome 3和 Safari 4都支持postMessage。

该方法可以通过绑定window的message事件来监听发送跨文档消息传输内容。


## postMessage()

``` js
postMessage(data, origin)
```

data: 传递数据，基本类型或对象，部分低版本浏览器只支持String类型，需要用JSON.stringify进行转换

origin: 字符串参数，指明目标窗口的源，协议+主机+端口号

## Example

domain A
``` html
<iframe src="http://www.dengwb.com/app/welcome.html" onload="postMessage"/>
```

``` js
postMessage () {
  window.frames[0].postMessage({ 'token': 'token' }, 'http://www.dengwb.com/app/welcome.html')
}
```

domain B (dengwb.com)
``` js
window.addEventListener('message', e => {
  if (e.source !== window.parent) return
  if (e.origin === '[domain A]') {
    localStorage.setItem('token', e.data.token)
  }
})
```

## 注意

postMessage采用的是“双向安全机制”。发送方发送数据的时候，会确认接受方的源（所以最好不要用*），在确保在iframe成功加载后，再执行postMessage方法。而接受方监听到message事件后，也可以用event.origin判断是否来自于正确可靠的发送方。