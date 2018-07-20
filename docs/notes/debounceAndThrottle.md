# 函数防抖 & 函数节流

* 目的：节约资源

## 函数防抖（debounce）

任务频繁触发的情况下，只有任务触发的间隔超过指定间隔的时候，任务才会执行

``` js
const debounce = (fn, delay = 300) => {
    let timer = null
    return function () {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, delay)
    }
}

debounce(function (params) {
    console.log(params)
}, 300)('Debounce Params')
```

## 函数节流（throttle）

指定时间间隔内只会执行一次任务

``` js
const throttle = (fn, delay = 300) => {
    let canRun = true
    return function () {
        if (!canRun) return
        canRun = false
        setTimeout(() => {
            fn.apply(this, arguments)
            canRun = true
        }, delay)
    }
}

throttle(function (params) {
    console.log(params)
}, 300)('Throttle Params')
```