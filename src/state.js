import Dep from "./Observe/dep"
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
    // computed初始化
    opts.computed && initComputed(vm)
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

/**
 * computed初始化
 * @param {*} vm 
 */
function initComputed(vm) {
    const computed = vm.$options.computed
    // 利用对象收集所有computed的watcher
    const watchers = vm._computedWatchers = Object.create(null)
    if (computed) {
        for (const key in computed) {
            const userDef = computed[key]
            let getter = typeof userDef === 'function' ? userDef : userDef.get
            watchers[key] = new Watcher(vm, getter, () => { }, { lazy: true })
            defineComputed(vm, key, userDef)
        }
    }
}

/**
 * 处理计算属性是否进行数据获取
 * @param {*} key 
 * @returns 
 */
function createComputedGetter(key) {
    return function computedGetter() {
        let watcher = this._computedWatchers[key]
        if (watcher.dirty) {
            watcher.evaluate()
            if (Dep.target) {
                watcher.depend()
            }
        }
        return watcher.value
    }
}

/**
 * vm上定义computed属性
 * @param {*} vm 
 * @param {*} key 
 * @param {*} userDef 
 */
function defineComputed(vm, key, userDef) {
    let shareProperty = {}
    if (typeof userDef == 'function') {
        shareProperty.get = userDef
    } else {
        shareProperty.get = createComputedGetter(key)
        shareProperty.set = userDef.set || (() => { })
    }
    Object.defineProperty(vm, key, shareProperty)
}