import { observe } from "./Observe/index"
import Watcher from "./Observe/watcher"
import { isFunction } from "./utils"

export function stateMixin(Vue) {
    /**
     * $watch接口
     * @param {*} key 
     * @param {*} handler 
     * @param {*} options 
     */
    Vue.prototype.$watch = function (key, handler, options = {}) {
        const vm = this
        options.user = true
        const watcher = new Watcher(vm, key, handler, options)
        if (options.immediate) {
            handler.call(vm, watcher.value)
        }
    }
}

/**
 * 状态初始化
 * 处理 props data computed watch
 * @param {*} vm 
 */
export function initState(vm) {
    const opts = vm.$options
    // data 属性初始化
    opts.data && initData(vm)
    // watch初始化
    opts.watch && initWatch(vm)
}

/**
 * 数据代理
 * 将data代理到vm上
 * @param {*} vm 
 * @param {*} source 
 * @param {*} key 
 */
function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key]
        },
        set(newVal) {
            vm[source][key] = newVal
        }
    })
}


/**
 * data属性初始化
 * 处理数据data获取和响应式
 * @param {*} vm 
 */
function initData(vm) {
    let data = vm.$options.data
    data = vm._data = isFunction(data) ? data.call(vm) : data
    for (const key in data) {
        proxy(vm, "_data", key)
    }
    observe(data)
}

/**
 * watch初始化
 * @param {*} vm 
 */
function initWatch(vm) {
    const watch = vm.$options.watch
    for (const key in watch) {
        let handler = watch[key]
        console.log('initWatch', key)
        if (Array.isArray(handler)) {
            handler.forEach(fn => {
                createWacther(vm, key, fn)
            })
        } else {
            createWacther(vm, key, handler)
        }
    }
}

/**
 * 创建自定义watcher
 * @param {*} vm 
 * @param {*} key 
 * @param {*} handler 
 * @returns 
 */
function createWacther(vm, key, handler) {
    return vm.$watch(key, handler)
}