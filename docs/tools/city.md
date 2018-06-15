# Dwb-City

[![](https://img.shields.io/badge/vue-2.x-green.svg)]()
[![](https://img.shields.io/npm/v/dwb-city.svg?style=flat)](https://www.npmjs.com/package/dwb-city)
[![](https://img.shields.io/npm/dt/dwb-city.svg)](https://www.npmjs.com/package/dwb-city)
[![](https://img.shields.io/github/stars/dengwb1991/dwb-city.svg?style=social&label=Stars)](https://github.com/dengwb1991/dwb-city)

## Install

``` bash
npm i dwb-city --save
```

## Mount

### mount with global

``` javascript
import Vue from 'vue'
import City from 'dwb-city'

Vue.use(City)
```

### mount with component

``` javascript
import { dwbCity } from 'dwb-city'

export default {
  components: {
    dwbCity
  }
}
```

## Use
``` html
<dwb-city v-model="show"
      :data="cityData"
      :city="city"
      ref="city"
      @change="getData"/>
```
``` javascript
data () {
  return {
    cityData: [CITY JSON],
    show: [True/False],
    city: [110000, 110100, 110112]
  }
}
// set Data Method or
this.$refs.city.setCurr(this.city)
```

## Example
```bash
npm install

npm run dev
```

[[Dwb City]](http://vuetool.dengwb.com/#/city)

## Author
[[Dengwb]](http://www.dengwb.com/app/welcome.html)