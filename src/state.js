import { observe } from "./Observe/index"
import { isFunction } from "./utils"

/**
 * 状态初始化
 * 处理 props data computed watch
 * @param {*} vm 
 */
export function initState(vm) {
    const opts = vm.$options
    // data 属性初始化
    opts.data && initData(vm)
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
