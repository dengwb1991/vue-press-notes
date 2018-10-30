module.exports = {
  port: 8083,
  title: 'Dengwb 随行笔记',
  description: '不只要吃面包，还要吃带馅的',
  themeConfig: {
    // The navigation bar
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Tools',
        items: [
          { text: 'City', link: '/tools/city' },
          { text: 'TabBar', link: '/tools/tabBar' },
          { text: 'Drawer', link: '/tools/drawer' }
        ]
      },
      { text: 'Notes',
        items: [
          { text: '跨域传值', link: '/notes/postMessage' },
          { text: '函数防抖节流', link: '/notes/debounceAndThrottle' },
          { text: 'Javascript模块化', link: '/notes/jsModular' }
        ]
      },
      { text: 'Contact', link: '/contact/index' }
    ],
    // The sidebar
    sidebar: 'auto',
    lastUpdated: 'Last Updated'
  }
}