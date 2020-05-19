module.exports = {
  port: 8083,
  title: 'Dengwb 随行笔记',
  description: '发现世界、享受生活、探索未知、终身学习',
  head: [
    ['link', { rel: 'icon', href: '/images/notes.png' }]
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
          { text: 'css单位', link: '/notes/css-units' }
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
          { text: 'BrowserCache', link: '/browser/browser-cache' }
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