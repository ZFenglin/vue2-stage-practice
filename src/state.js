import { observe } from "./Observe/index"
import { isFunction } from "./utils"

export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
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