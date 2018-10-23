# dwb-vue-drawer

[![](https://img.shields.io/badge/vue-2.x-green.svg)]()
[![](https://img.shields.io/npm/v/dwb-vue-drawer.svg?style=flat)](https://www.npmjs.com/package/dwb-vue-drawer)
[![](https://img.shields.io/npm/dt/dwb-vue-drawer.svg)](https://www.npmjs.com/package/dwb-vue-drawer)
[![](https://img.shields.io/github/stars/dengwb1991/dwb-vue-drawer.svg?style=social&label=Stars)](https://github.com/dengwb1991/dwb-vue-drawer)

<img src="http://vuetool.dengwb.com/static/ezgif-3-00986149a9.gif" width="200"/>

## Install

``` bash
npm i dwb-vue-drawer --save
```

## Mount

### mount with global

``` javascript
import Vue from 'vue'
import Drawer from 'dwb-vue-drawer'

Vue.use(Drawer)
```

### mount with component

``` javascript
import { DwbVueDrawer } from 'dwb-vue-drawer'

export default {
  components: {
    DwbVueDrawer
  }
}
```

## Props

 Attribute | Type | Default | Description 
 --- | ---  | --- | --- 
 visible  | boolean | false | visibility of Drawer, supports the `.sync` modifier
 position | string | bottom | pop-up direction
 lockScroll | boolean | true | whether scroll of body is disabled while Drawer is displayed
 maskClosable | boolean | true | whether hide the component when clicked the mask layer
 zIndex | number | 100 | the value of the style z-index
 maskStyle | object | - | custom style of mask
 containerStyle | object | - | container style of container

## Events

Attribute | Value | Description
---- | --- | ---
open | - | drawer open callback
close | - | drawer close callback

## Methods

Attribute  | Value | Description
---- | --- | ---
open | - | open method
close | - | close method

## Demo

```html
<template>
    <DwbVueDrawer :visible.sync="visible"
            :position="position"
            :lockScroll="lockScroll"
            :maskClosable="maskClosable"
            :zIndex="zIndex"
            :maskStyle="maskStyle"
            :containerStyle="containerStyle"
            @open="open"
            @close="close">
      <ul>
        <li>111</li>
        <li>222</li>
        <li>333</li>
      </ul>
    </DwbVueDrawer>
</template>
<script>
export default {
  data () {
    return {
      visible: false,
      position: 'bottom',
      lockScroll: true,
      maskClosable: true,
      zIndex: 200,
      maskStyle: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      },
      containerStyle: {
        background: '#F5F5F5'
      }
    }
  },
  methods: {
    show (position) {
      this.position = position
      this.visible = true
    },
    open () {
      console.log('open callback')
    },
    close () {
      console.log('close callback')
    }
  }
}
</script>
```


## Example
```bash
npm install

npm run dev
```

[[Dwb Vue Drawer]](http://vuetool.dengwb.com/#/drawer)

## Author
[[Dengwb]](http://www.dengwb.com/app/welcome.html)
