# 浏览器安全

## 跨站脚本攻击 XSS

### 什么是 XSS 攻击

XSS 全称是 Cross Site Scripting，为了与“CSS”区分开来，故简称 XSS，翻译过来就是“跨站脚本”。**XSS 攻击是指黑客往 HTML 文件中或者 DOM 中注入恶意脚本**，从而在用户浏览页面时利用注入的恶意脚本对用户实施攻击的一种手段。

### 恶意脚本都能做哪些事情

1. **窃取 Cookie 信息**，可以通过“document.cookie”获取 Cookie 信息
2. **监听用户行为**，可以使用“addEventListener”接口来监听键盘事件
3. **修改 DOM**
4. **在页面内生成浮窗广告**

### 如何注入恶意脚本

1. **存储型 XSS 攻击**，利用表单提交一段`<script src="http://..">` 代码
2. **反射型 XSS 攻击**，访问浏览器地址后添加参数，值为`<script src="http://..">` 代码
3. **基于 DOM 的 XSS 攻击**，网络劫持

### 如何阻止 XSS 攻击

1. 服务器对输入脚本进行过滤或转码
2. 充分利用 CSP：限制加载其他域下的资源文件、禁止向第三方域提交数据、禁止执行内联脚本和未授权的脚本
3. 使用 HttpOnly 属性防止Cookie被盗风险

```
set-cookie: NID=189=M8q2FtWbsR8RlcldPVt7qkrqR38LmFY9jUxkKo3-4Bi6Qu_ocNOat7nkYZUTzolHjFnwBw0izgsATSI7TZyiiiaV94qGh-BzEYsNVa7TZmjAYTxYTOM9L_-0CN9ipL6cXi8l6-z41asXtm2uEwcOC5oh9djkffOMhWqQrlnCtOI; expires=Sat, 18-Apr-2020 06:52:22 GMT; path=/; domain=.google.com; HttpOnly
```

## CSRF 攻击

### 什么是 CSRF 攻击

CSRF 英文全称是 Cross-site request forgery，所以又称为“跨站请求伪造”，是指黑客引诱用户打开黑客的网站，在黑客的网站中，利用用户的登录状态发起的跨站请求。简单来讲，CSRF 攻击就是黑客利用了用户的登录状态，并通过第三方的站点来做一些坏事。

和 XSS 不同的是，CSRF 攻击不需要将恶意代码注入用户的页面，仅仅是利用服务器的漏洞和用户的登录状态来实施攻击。

### 如何防止 CSRF 攻击

1. 充分利用好 Cookie 的 SameSite 属性

SameSite 选项通常有 Strict、Lax 和 None 三个值。

Strict 最为严格。如果 SameSite 的值是 Strict，那么浏览器会完全禁止第三方 Cookie。

Lax 相对宽松一点。在跨站点的情况下，从第三方站点的链接打开和从第三方站点提交 Get 方式的表单这两种方式都会携带 Cookie。

而如果使用 None 的话，在任何情况下都会发送 Cookie 数据。

### 验证请求的来源站点

在服务器端验证请求来源的站点，通过获取 HTTP 请求头中的 Referer 和 Origin 属性。服务器的策略是优先判断 Origin，如果请求头中没有包含 Origin 属性，再根据实际情况判断是否使用 Referer 值。

### CSRF Token

设置一个唯一标示，请求传入.