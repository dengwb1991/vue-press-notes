---
home: true
actionText: 开始阅读 →
# actionLink: /zh/guide/
features:
- title: 
  details: 
- title: 
  details: 
- title: 
  details: 
---

<div class="home-content-wrap">

<div class="home-item">
<div class="home-item-title">
  <p class="home-title">React</p>
</div>

[Redux](/react/redux.html)

[基础 Hooks](/react/base-hooks.html)

</div>

<div class="home-item">
<div class="home-item-title">
  <p class="home-title">Vue</p>
</div>

[Vue2.x实现原理](/vue/implementation-principle.html)

[Vuex](/vue/vuex.html)

</div>

<div class="home-item">
<div class="home-item-title">
  <p class="home-title">Webpack</p>
</div>

[编译优化-DllPlugin](/webpack/dll-plugin.html)

[打包优化-NodeExternals](/webpack/webpack-node-externals.html)

</div>

<div class="home-item">
<div class="home-item-title">
  <p class="home-title">Babel</p>
</div>

[Babel 7](/babel/babel7.html)


</div>

<div class="home-item">
<div class="home-item-title">
  <p class="home-title">浏览器</p>
</div>

[从输入URL到页面展示](/browser/input-url-to-page.html)

[浏览器缓存机制](/browser/browser-cache.html)

[浏览器安全](/browser/browser-security.html)

</div>

</div>

<style>
p > code, li > code {
  background-color: #fff5f5!important;
  color: #ff502c!important;
}

.home-content-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}
.home-item {
  padding: 0 35px;
}
.home-item-title {
  text-align: center;
}
.home-icon {
  vertical-align: middle;
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
}
.home-title {
  display: inline-block;
  font-weight: bold;

}
@media screen and (max-width: 500px) {
  .home-content-wrap {
    display: block;
  }
  .home-item {
    padding: 0;
  }
  .home-item-title {
    text-align: left;
  }
}
</style>