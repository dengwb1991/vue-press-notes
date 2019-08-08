# vue-create-api源码分析

## vue-create-api 是干嘛的？

在 README.md 中这样介绍的，**一个能够让 Vue 组件通过 API 方式调用的插件**。


## 安装使用

目前提供两种安装，通过 `npm install vue-create-api`, 或者引入js静态资源文件。

在 README.md 中提供了使用示例，如下：

```js
import CreateAPI from 'vue-create-api'

Vue.use(CreateAPI)

Vue.use(CreateAPI, {
  componentPrefix: 'cube-'
  apiPrefix: '$create-'
})

import Dialog from './components/dialog.vue'

Vue.createAPI(Dialog, true)

Dialog.$create({
  $props: {
    title: 'Hello',
    content: 'I am from pure JS'
  }
}).show()

this.$createDialog({
  $props: {
    title: 'Hello',
    content: 'I am from a vue component'
  }
}).show()
```

引入 `vue-create-api` 插件，安装插件时，可以设置 `componentPrefix` 和 `apiPrefix` 两个参数，这里会在 Vue 构造器下添加一个 `createAPI` 方法。引入 Dialog 组件，调用 `createAPI` 生产对应 `API`，并挂载到 `Vue.prototype` 和 `Dialog` 对象上。之后可以在 vue 组件中通过 `this` 调用，或者在 js 文件中 `$create` 创建并使用。

## 目录

| 文件名称 | 说明 |
| --- | ---  |
| creator | 创建组件 |
| debug | 错误提示 |
| index | 主入口 |
| instantiate | 实例化 |
| parse | 参数设置 |
| util | 工具库 |

接下来我们会从 **入口** 开始分析，深入了解它的原理及实现过程。

## 入口

如果 Vue 插件是一个对象，必须提供 `install` 方法。如果插件是一个函数，该函数会被作为 `install` 方法。 `install` 方法调用时，会将 Vue 作为参数传入。 `vue-create-api` 的 `install` 方法在 `src/index.js` 文件中定义：

```js
import { camelize, escapeReg, isBoolean } from './util'
import { assert, warn } from './debug'
import apiCreator from './creator'
import instantiateComponent from './instantiate'

function install(Vue, options = {}) {
  const {componentPrefix = '', apiPrefix = '$create-'} = options

  Vue.createAPI = function (Component, events, single) {
    if (isBoolean(events)) {
      single = events
      events = []
    }
    const api = apiCreator.call(this, Component, events, single)
    const createName = processComponentName(Component, {
      componentPrefix,
      apiPrefix,
    })
    Vue.prototype[createName] = Component.$create = api.create
    return api
  }
}
```

install 方法提供 `options` 配置参数， `componentPrefix` 为组件名前缀，最终生成的 API 会忽略该前缀， `apiPrefix` 为生成的 API 统一添加前缀，默认为 `$create`。

在方法体内定义了 Vue.createAPI 方法，并提供三个参数     `Component` 组件、 `events` 事件数组、 `single` 是否采用单例模式实例化组件。 `events` 可以传 Boolean 类型或者 Array 类型值。 示例中 `events` 为 true ，根据代码逻辑，当 `events` 为 Boolean 类型时， single = events 所以 `single` 为 true ，`events` 赋值为 []。

通过 `apiCreator` 方法获得 `api` 对象，内部有 `before` 和 `create` 两个方法。 这里之所以用到 `call`，其作用就是要将 `this` 指向 Vue 类。代码文件路径在 `src/creator.js` ，这部分实现逻辑之后会细讲，我们接着往下看。

通过 `processComponentName` 方法获得 `crateName` 属性名，将 `api.create` 赋给 `Component.$create` 和 `Vue.prototype[createName]`，最后返回 `api`。这里也就是上面示例中 `  this.$createDialog()` 和 ` Dialog.$create() ` 的实现过程。

`processComponentName` 方法非常简单，代码如下：

```js
function processComponentName(Component, options) {
  const {componentPrefix, apiPrefix} = options
  const name = Component.name
  assert(name, 'Component must have name while using create-api!')
  const prefixReg = new RegExp(`^${escapeReg(componentPrefix)}`, 'i')
  const pureName = name.replace(prefixReg, '')
  let camelizeName = `${camelize(`${apiPrefix}${pureName}`)}`
  return camelizeName
}
```

这段代码目的就是匹配剪切拼接字符串，最终返回处理好的 `camelizeName` 值，需要注意一下这里有用到 `Component.name`，并且判断 name 是否定义，未定义则抛出异常，所以用 `vue-create-api` 插件的话，组件一定要定义 `name`。

## 创建API

入口文件分析完了，接下来我们看一下 `apiCreator` 做了什么操作，文件路径为 `src/creator.js`，代码比较多，为了阅读方便，我按照主要逻辑分段讲解：

```js
import instantiateComponent from './instantiate'
import parseRenderData from './parse'
import { isFunction, isUndef, isStr } from './util'

const eventBeforeDestroy = 'hook:beforeDestroy'

export default function apiCreator(Component, events = [], single = false) {
  let Vue = this
  let currentSingleComp
  let singleMap = {}
  const beforeHooks = []

  ...

  const api = {
    before(hook) {
      beforeHooks.push(hook)
    },
    create(config, renderFn, _single) {
      if (!isFunction(renderFn) && isUndef(_single)) {
        _single = renderFn
        renderFn = null
      }

      if (isUndef(_single)) {
        _single = single
      }

      const ownerInstance = this
      const isInVueInstance = !!ownerInstance.$on
      let options = {}

      if (isInVueInstance) {
        // Set parent to store router i18n ...
        options.parent = ownerInstance
        if (!ownerInstance.__unwatchFns__) {
          ownerInstance.__unwatchFns__ = []
        }
      }

      const renderData = parseRenderData(config, events)

      let component = null

      processProps(ownerInstance, renderData, isInVueInstance, (newProps) => {
        component && component.$updateProps(newProps)
      })
      processEvents(renderData, ownerInstance)
      process$(renderData)

      component = createComponent(renderData, renderFn, options, _single)

      if (isInVueInstance) {
        ownerInstance.$on(eventBeforeDestroy, beforeDestroy)
      }

      function beforeDestroy() {
        cancelWatchProps(ownerInstance)
        component.remove()
        component = null
      }

      return component
    }
  }

  return api
}
```

这个js文件是 `vue-create-api` 的核心文件，这里面包含着解析渲染数据、事件属性监听和创建组件等操作，这些我会一一分析给大家。

`apiCreator` 函数有三个参数，分别为 Component，events，single。这同 createAPI 一致。首先 `Vue = this`，这里的 `this` 指向是 Vue 这个类，vue 源码在 `src/core/instance/index.js` 中，如下所示：

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

我们平时开发中 `new Vue` 操作，就是实例化这个对象方法。在方法体内，执行 `this._init` 方法，进行初始化，如 生命周期、事件、渲染等等。

讲回来，定义一些变量 `currentSingleComp` 、 `singleMap` 、 `beforeHooks` 这三个作用之后会讲到。我们先看一下 `const api` 都定义了什么，它提供了 `before` 和 `create` 两个方法。

`before` 提供了一个参数 `hook` ，它就是一个钩子函数，在方法体内用到了一开始定义的 `beforeHooks` 数组，将 `hook` 添加到该数组。根据名称定义我们可以猜到，这些函数会在组件初始化的时候就定义好，该方法可以用于某种限制设定。

`create` 提供了三个参数，分别为 `config` 配置参数、 `renderFn` 用于生成子 VNode 节点， `_single` 单例。接下来判断 `renderFn` 是否为函数，如果 `renderFn` 不为函数并且 `_single` 为 undefined 时，_single = renderFn，renderFn = null，如果 `_single` 为 undefined 时，_single = single。

`const ownerInstance = this` 这里的 this 上下文指向的是调用者。举个例子 `this.$createDialog()` this 指向的就是 vue 实例，若使用 `Dialog.$create()` 方法时，this 指向的就是 Dialog 对象，前者 `isInVueInstance` 为 true，后者为 false。 `ownerInstance.__unwatchFns__` 用作监听 `Prop` 变化。所以这里当用 `Dialog.$create()` 这样的形式创建组件的实例并使用时，无法让 `Prop` 响应式更新。

通过 `parseRenderData` 方法获得渲染数据，该方法如何实现后面介绍。

`processProps`、`processEvents`、`process$` 三个方法分别监听参数、事件以及参数对象，这些方法如何实现后面介绍。

`createComponent` 方法创建了组件的实例，最后返回该示例。其中有一段代码需要注意，如下

```js
if (isInVueInstance) {
  ownerInstance.$on(eventBeforeDestroy, beforeDestroy)
}

function beforeDestroy() {
  cancelWatchProps(ownerInstance)
  component.remove()
  component = null
}
```

判断组件是否在 Vue 中使用，在的话，为其绑定一个 `beforeDestroy` 事件钩子，清空并销毁监听的事件属性和实例。

* 注意：如果是服务器渲染（SSR）的话，该方法会无效。

接下来我们会逐步分析**解析渲染数据**、**事件属性监听**以及**创建组件**是如何实现的。

## 解析渲染数据

文件路径在 `src/parse.js`，代码如下：

```js
import { camelize } from './util'

export default function parseRenderData(data = {}, events = {}) {
  events = parseEvents(events)
  const props = {...data}
  const on = {}
  for (const name in events) {
    if (events.hasOwnProperty(name)) {
      const handlerName = events[name]
      if (props[handlerName]) {
        on[name] = props[handlerName]
        delete props[handlerName]
      }
    }
  }
  return {
    props,
    on
  }
}

function parseEvents(events) {
  const parsedEvents = {}
  events.forEach((name) => {
    parsedEvents[name] = camelize(`on-${name}`)
  })
  return parsedEvents
}
```

该方法提供两个参数，第一个参数 `data` 在创建组件时传递。第二个参数为 `events` 在调用 `createAPI` 时定义。

说一下 `data` 这个参数有两种形式。

第一种传值方式为 `{ $props, $events }`，`$props` 对应的组件的 prop 参数，该属性会被 watch，所以支持响应更新。`$events` 为组件的事件回调。举个实例：

```js
this.$createDialog({
  $props: {
    title: 'Hello',
    content: 'I am from a vue component'
  },
  $event: {
    change: () => {}
  }
}).show()
```


第二种传值方式可以将 `$props` 里的参数直接放在对象里，如 `{ title, content }`，若这种结构想要监听事件怎么办？

请看源码中有 `parseEvents` 方法，该方法传 `events` 参数，该参数在 `createAPI` 中定义，会返回一个对象，key 为 `events` 的值，value 为 camelize(`on-${name}`)。循环 `events` 判断是否在 `data` 中有定义 `on*` 开头的参数，如果匹配成功，赋值到 `on` 对象，并与 `props` 一同返回。

所以如果想要用第二种方式监听事件，就如下定义：

```js
Vue.createAPI(Dialog, ['change'])

this.$createDialog({
  title: 'Hello',
  content: 'I am from a vue component',
  onChange: () => {}
}).show()
```

* 注意：这段代码大部分是为了支持配置 `on*` 事件监听。如果使用者没有这样的需求的话，可以优化掉这里。

## 事件属性监听

文件路径依然在 `src/creator.js`，先讲 `processProps` 方法，代码如下：

```js
  function processProps(ownerInstance, renderData, isInVueInstance, onChange) {
    const $props = renderData.props.$props
    if ($props) {
      delete renderData.props.$props

      const watchKeys = []
      const watchPropKeys = []
      Object.keys($props).forEach((key) => {
        const propKey = $props[key]
        if (isStr(propKey) && propKey in ownerInstance) {
          // get instance value
          renderData.props[key] = ownerInstance[propKey]
          watchKeys.push(key)
          watchPropKeys.push(propKey)
        } else {
          renderData.props[key] = propKey
        }
      })
      if (isInVueInstance) {
        const unwatchFn = ownerInstance.$watch(function () {
          const props = {}
          watchKeys.forEach((key, i) => {
            props[key] = ownerInstance[watchPropKeys[i]]
          })
          return props
        }, onChange)
        ownerInstance.__unwatchFns__.push(unwatchFn)
      }
    }
  }
```

该方法主要目的做数据响应及存储，它接收四个参数，`ownerInstance` 创建者实例对象，`renderData` 渲染的数据对象，`isInVueInstance` 判断是否在 `vue` 组件内被创建， 以及 `onChange` 一个回调函数。

首先判断渲染数据中是否有提供 `$props`，所以当使用者设置了 `$props` 属性，该方法才会继续往下执行。

`watchKeys`、`watchPropKeys` 存放需要监听更新的数据 和 参数key。循环遍历 `$props` 的 key，并获取对应 key 的 value 值为 `propKey`。接下来有一个重要的判断条件 `isStr(propKey) && propKey in ownerInstance`，判断 `propKey` 是否为字符串和该属性是否在 `ownerInstance` 对象或其原型链中。如果成立，将实例的对应的值存入 `renderData` 中，并且将 key 存入 watch 数组内。

接下来 `isInVueInstance` 判断，`$watch` 监听数据变化，当 `ownerInstance[watchPropKeys[i]]` 发生变化时，该函数都会被调用，执行回调函数 `$updateProps` 方法，该方法定义在 `src/instantiate.js` 内：

```js
  component.$updateProps = function (props) {
    Object.assign(renderData.props, props)
    instance.$forceUpdate()
  }
```

`props` 为更新后的新数据，`$forceUpdate` 使 Vue 实例重新渲染。

* 注意：
 
*  1）开发者在使用该插件进行数据更新时，需要更新的属性对应的 value 要为字符串，并对应着 Vue 实例的数据对象。

* 2）根据源码分析，未在 Vue 创建的实例无法数据更新，这一点在 README 中也有说明。分析源码后，让我们了解真正的原因。

接下来我们分析 `processEvents` 方法，代码如下：

```js
  function processEvents(renderData, ownerInstance) {
    const $events = renderData.props.$events
    if ($events) {
      delete renderData.props.$events

      Object.keys($events).forEach((event) => {
        let eventHandler = $events[event]
        if (typeof eventHandler === 'string') {
          eventHandler = ownerInstance[eventHandler]
        }
        renderData.on[event] = eventHandler
      })
    }
  }
```

该方法主要的监听用户绑定的回调事件使其触发。它接受两个参数 `renderData` 和 `ownerInstance`。

首先判断渲染数据中是否有提供 `$events`，所以当使用者设置了 `$events` 属性，该方法才会继续往下执行。

循环遍历 `$events` 的 key，并获取对应 key 的 value 值为 `eventHandler`，判断 `eventHandler` 是否为 string 类型，如果为 string 类型，在实例中获取该属性对应的函数并赋给 `eventHandler`，最后将该函数赋给 `renderData`。


接下来我们分析 `process$` 方法，代码如下：

```js
 function process$(renderData) {
    const props = renderData.props
    Object.keys(props).forEach((prop) => {
      if (prop.charAt(0) === '$') {
        renderData[prop.slice(1)] = props[prop]
        delete props[prop]
      }
    })
  }
```

该方法提供使用者可以设置 `$xxx` 配置，使用起来更灵活，例如想要给组件多设置一个 `className` 的话，可以配置为 `$class: 'my-class'`，方法体内会遍历参数首位是否为 $，然后将数据保存在 renderData 中，在之后进行数据处理渲染。

## 创建组件

文件路径依然在 `src/creator.js`，代码如下：

```js
  function createComponent(renderData, renderFn, options, single) {
    beforeHooks.forEach((before) => {
      before(renderData, renderFn, single)
    })
    const ownerInsUid = options.parent ? options.parent._uid : -1
    const {comp, ins} = singleMap[ownerInsUid] ? singleMap[ownerInsUid] : {}
    if (single && comp && ins) {
      ins.updateRenderData(renderData, renderFn)
      ins.$forceUpdate()
      currentSingleComp = comp
      return comp
    }
    const component = instantiateComponent(Vue, Component, renderData, renderFn, options)
    const instance = component.$parent
    const originRemove = component.remove

    component.remove = function () {
      if (single) {
        if (!singleMap[ownerInsUid]) {
          return
        }
        singleMap[ownerInsUid] = null
      }
      originRemove && originRemove.apply(this, arguments)
      instance.destroy()
    }

    const originShow = component.show
    component.show = function () {
      originShow && originShow.apply(this, arguments)
      return this
    }

    const originHide = component.hide
    component.hide = function () {
      originHide && originHide.apply(this, arguments)
      return this
    }

    if (single) {
      singleMap[ownerInsUid] = {
        comp: component,
        ins: instance
      }
      currentSingleComp = comp
    }
    return component
  }

```

该方法接收四个参数，`renderData` 之前已经处理好需要渲染的数据，`renderFn` 用于生成子 VNode 节点，`options` 组件实例，`single` 是否单例。

```js
  beforeHooks.forEach((before) => {
    before(renderData, renderFn, single)
  })
```

首先循环 `beforeHooks` 获取在调用 `Vue.createAPI` 时绑定的方法，如果设置了 `before`，那么每次调用都会先执行这个方法。

```js
  const ownerInsUid = options.parent ? options.parent._uid : -1
  const {comp, ins} = singleMap[ownerInsUid] ? singleMap[ownerInsUid] : {}
  if (single && comp && ins) {
    ins.updateRenderData(renderData, renderFn)
    ins.$forceUpdate()
    currentSingleComp = comp
    return comp
  }
  const component = instantiateComponent(Vue, Component, renderData, renderFn, options)
  const instance = component.$parent

  ...

  if (single) {
    singleMap[ownerInsUid] = {
      comp: component,
      ins: instance
    }
    currentSingleComp = comp
  }
```

这部分作用是组件使用单例模式。定义当前实例唯一标识 `ownerInsUid`，如果 options.parent 存在，获取 Vue 组件的唯一标识 `_uid`，反之为 `-1`。

判断 `singleMap[ownerInsUid]` 是否存在，如果存在获取 comp 和 ins 两个值。`comp` 接下来分别判断 signle、comp、ins 是否存在或为 true。

`updateRenderData` 方法作用是更新渲染数据及回调方法。`$forceUpdate` 方法使当前实例重新渲染。

`instantiateComponent` 为创建一个组件实例的方法，这里之后细说。

该方法的最后判断 `single` 参数，是否为单例，如果 `single` 为 true，以 `ownerInsUid` 为键存储到 `singleMap` 对象中，值为一个对象，在上有说道为 `comp` 和 `ins`， `comp` 对应的是 `component`，也就是当前组件的实例，`ins` 对应的是父实例 `component.$parent`。

```js
  const originRemove = component.remove
  component.remove = function () {
    if (single) {
      if (!singleMap[ownerInsUid]) {
        return
      }
      singleMap[ownerInsUid] = null
    }
    originRemove && originRemove.apply(this, arguments)
    instance.destroy()
  }

  const originShow = component.show
  component.show = function () {
    originShow && originShow.apply(this, arguments)
    return this
  }

  const originHide = component.hide
  component.hide = function () {
    originHide && originHide.apply(this, arguments)
    return this
  }
```

这里为组件添加了三个方法，分别为 `remove`、`show`、`hide`。

`remove`：判断当前是否为单例，将 `singleMap` 中对应的值删除。判断组件是否设置了 `remove` 方法，使用 `apply` 方法执行，最后将父实例销毁。

`show` 和 `hide` 两个方法差不多，目的是将当前组件实例返回。

接下来分析 `instantiateComponent` 方法，文件路径在 `src/instantiate.js`，代码如下：

```js
export default function instantiateComponent(Vue, Component, data, renderFn, options) {
  let renderData
  let childrenRenderFn

  const instance = new Vue({
    ...options,
    render(createElement) {
      let children = childrenRenderFn && childrenRenderFn(createElement)
      if (children && !Array.isArray(children)) {
        children = [children]
      }

      return createElement(Component, {...renderData}, children || [])
    },
    methods: {
      init() {
        document.body.appendChild(this.$el)
      },
      destroy() {
        this.$destroy()
        document.body.removeChild(this.$el)
      }
    }
  })
  instance.updateRenderData = function (data, render) {
    renderData = data
    childrenRenderFn = render
  }
  instance.updateRenderData(data, renderFn)
  instance.$mount()
  instance.init()
  const component = instance.$children[0]
  component.$updateProps = function (props) {
    Object.assign(renderData.props, props)
    instance.$forceUpdate()
  }
  return component
}

```

该方法包含五个参数，`Vue` 类，`Component` 组件，`data` 组件参数及回调事件，`renderFn` 用于生成子 VNode 节点，`options` 组件实例。

创建一个 Vue 实例 `new Vue`。通过解构 `options` 为其添加父组件实例。

`render` 方法为字符串模板的代替方案，参数 `createElement` 的作用是创建 VNode。首先判断 `childrenRenderFn` 值，它是值为 `renderFn` 用于生成子 VNode 节点。如果存在就将 `createElement` 传入。最终返回 `createElement` 方法，如果你对该方法不了解的话可以之后翻阅一下 vue官方文档。说到 `childrenRenderFn` 方法，才可以让该插件有如下配置：

```js
this.$createDialog({
  $props: {
    title: 'Hello',
    content: 'I am from a vue component'
  }
}, createElement => {
  return [
    createElement('p', 'other content')
  ]
}).show()
```

接下来定义了两个方法 `init` 和 `destory`。 init方法将 Vue 实例使用的根 DOM 元素添加到body中，destory方法将其删除销毁。

`updateRenderData` 为更新渲染数据。

`$mount` 手动地挂载一个未挂载的实例。也就是说不调用该方法，Vue 实例中无 `$el`。

instance.$children[0] 获取组件实例，绑定 ` $updateProps ` 方法，最终返回该组件实例。

## 总结

到这里，vue-create-api 插件的核心代码以及整个运转过程都讲完了。之所以分享该插件源码分析有两个重要原因。

一、作者是黄轶，本人阅读过黄老师的「Vue.js技术揭秘」学到很多知识，这个插件也是黄老师亲力亲为而做，算是慕名而来。

二、代码本身，通读源码可以看到作者思路清晰，实现过程毫无拖泥带水，语言精练值得反复阅读。

最后附上 vue-create-api [源码地址](https://github.com/cube-ui/vue-create-api) 方便大家收藏阅读。或者扫码关注微信公众号「不可思议的前端」，每个月会技术干货、最佳实践以及有趣的前端技巧分享给大家。