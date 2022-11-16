module.exports = {
  port: 8083,
  title: 'Dengwb 随行笔记',
  description: '小站',
  head: [
    ['link', { rel: 'icon', href: '/images/notes.png' }],
    ['link', { rel: 'stylesheet', href: '/css/index.css' }],
  ],
  themeConfig: {
    // The navigation bar
    nav: [
      { text: 'Home', link: '/' },
      { 
        text: 'Reading',
        items: [
          { text: 'vue-create-api源码解析', link: '/notes/vue-create-api' },
          { text: '跨域传值', link: '/notes/postMessage' },
          { text: '函数防抖节流', link: '/notes/debounceAndThrottle' },
          { text: 'Javascript模块化', link: '/notes/jsModular' },
          { text: 'Javascript运行机制', link: '/notes/operationalMechanism' },
          { text: 'css单位', link: '/notes/css-units' },
          { text: '设计模式', link: '/notes/design-patterns' },
          { text: 'package.json冷门属性配置', link: '/notes/package-json' },
          { text: 'dev/peer/dependencies', link: '/notes/dependencies' }
        ]
      },
      {
        text: 'Css',
        items: [
          { text: 'Weather', link: '/css/weather' }
        ]
      },
      {
        text: 'React',
        items: [
          { text: 'Redux', link: '/react/redux' },
          { text: '基础Hooks', link: '/react/base-hooks' }
        ]
      },
      {
        text: 'Vue',
        items: [
          { text: '实现原理', link: '/vue/implementation-principle' },
          { text: 'vuex', link: '/vue/vuex' }
        ]
      },
      {
        text: 'Webpack',
        items: [
          { text: 'DllPlugin', link: '/webpack/dll-plugin' },
          { text: 'NodeExternals', link: '/webpack/webpack-node-externals' }
        ]
      },
      {
        text: '浏览器',
        items: [
          { text: 'Chrome架构', link: '/browser/browser-chrome' },
          { text: 'IP & UDP & TCP', link: '/browser/ip-udp-tcp' },
          { text: '从输入URL到页面展示', link: '/browser/input-url-to-page' },
          { text: '浏览器缓存机制', link: '/browser/browser-cache' },
          { text: '浏览器安全', link: '/browser/browser-security' },
          { text: 'client & offset & scroll', link: '/browser/client-offset-scroll' }
        ]
      },
      {
        text: '数据结构',
        items: [
          { text: '基础算法', link: '/data-structure/based-algorithm' }
        ]
      },
      {
        text: 'MacOS',
        items: [
          { text: 'brew', link: '/mac-os/brew' },
          { text: 'tree', link: '/mac-os/tree' },
        ]
      },
      { text: 'Question', link: '/question/index' },
      { text: 'GitHub', link: 'https://github.com/dengwb1991/vue-press-notes' }
    ],
    // The sidebar
    sidebar: 'auto',
    lastUpdated: 'Last Updated'
  },
  plugins: [
    ['demo-code', {
      onlineBtns: {
        codepen: true,
        jsfiddle: false,
        codesandbox: false
      }
    }]
  ]
}