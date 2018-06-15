module.exports = {
  port: 8083,
  title: 'Dengwb Notes by VuePress',
  description: 'This is a Demo',
  themeConfig: {
    // The navigation bar
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Tools',
        items: [
          { text: 'City', link: '/tools/city' }
        ]
      },
      { text: 'Notes',
        items: [
          { text: '跨域传值', link: '/notes/postMessage' }
        ]
      },
      { text: 'Contact', link: '/contact/index' }
    ],
    // The sidebar
    sidebar: 'auto',
    lastUpdated: 'Last Updated'
  }
}