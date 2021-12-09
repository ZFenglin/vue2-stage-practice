import { isObject } from "../utils"
import { arrayMethods } from "./array"
import Dep from "./dep"

class Observe {
    constructor(data) {
        // 设置__ob__属性，并置为不可枚举
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false,
        })
        if (Array.isArray(data)) {
            // 数组方法改写
            data.__proto__ = arrayMethods
            // 数组响应式处理
            this.observeArray(data)
        } else {
            this.walk(data)
        }
    }
    /**
     * 对象对象响应式处理
     * 遍历数据利用defineReactive进行响应式处理
     * @param {*} data 
     */
    walk(data) {
        Object.keys(data).forEach(key => {
            defineReactive(data, key, data[key])
        })
    }

    /**
     * 数组响应式处理
     * 只处理数组中的每一项，下标不处理
     * @param {*} arr 
     */
    observeArray(arr) {
        arr.forEach(item => {
            observe(item)
        })
    }


}

/**
 * 利用Object.defineProperty进行响应式处理
 * @param {*} data 
 * @param {*} key 
 * @param {*} val 
 */
function defineReactive(data, key, val) {
    // val进行响应式
    observe(val)
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            if (Dep.target) {
                dep.depend()
            }
            return val
        },
        set(newVal) {
            // 新值增加响应式
            observe(newVal)
            val = newVal
            dep.notify()
        }
    })
}

/**
 * 数据响应式处理
 * 对非对象和已处理进行拦截
 * @param {*} data 
 * @returns {Observe} observe实例
 */
export function observe(data) {
    if (!isObject(data)) return
    if (data.__ob__) return
    return new Observe(data)
}

