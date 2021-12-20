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