import Dep from "./Observe/dep"
import { observe } from "./Observe/index"
import Watcher from "./Observe/wathcer"
import { isFunction } from "./utils"

export function stateMixin(Vue) {
    Vue.prototype.$watch = function (key, handler, options = {}) {
        options.user = true
        let watcher = new Watcher(this, key, handler, options)
        if (options.immediate) {
            handler(watcher.value)
        }
    }
}

export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
    if (opts.watch) {
        initWatch(vm, opts.watch)
    }
    if (opts.computed) {
        initComputed(vm, opts.computed)
    }
}


function proxy(target, sourceKey, key) {
    Object.defineProperty(target, key, {
        get() {
            return target[sourceKey][key]
        },
        set(newVal) {
            target[sourceKey][key] = newVal
        }
    })
}

function initData(vm) {
    let data = vm.$options.data
    data = vm._data = isFunction(data) ? data.call(vm) : data || {}
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    observe(data)
}


function initWatch(vm, watch) {
    for (const key in watch) {
        let handler = watch[key]
        if (Array.isArray(handler)) {
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])

            }
        } else {
            createWatcher(vm, key, handler)
        }
    }
}

function createWatcher(vm, key, handler) {
    return vm.$watch(key, handler)
}

function initComputed(vm, computed) {
    const watchers = vm._computedWatchers = Object.create(null)
    for (const key in computed) {
        const userDef = computed[key]
        let getter = typeof userDef === 'function' ? userDef : userDef.get
        watchers[key] = new Watcher(vm, getter, () => { }, { lazy: true }) // lazy 默认不直接执行
        defineComputed(vm, key, userDef)
    }
}

function createComputedGetter(key) {
    return function computedGetter() {
        let watcher = this._computedWatchers[key]
        if (watcher.dirty) {
            watcher.evaluate()
        }
        if (Dep.target) {
            watcher.depend()
        }
        return watcher.value
    }
}

function defineComputed(vm, key, userDef) {
    let shareProperty = {}
    if (typeof userDef === 'function') {
        shareProperty.get = userDef
    } else {
        shareProperty.get = createComputedGetter(key)
        shareProperty.set = userDef.set || (() => { })
    }
    Object.defineProperty(vm, key, shareProperty)
}