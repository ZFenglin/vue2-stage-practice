import { isObject } from "../utils"
import { arrayMethods } from "./array"
import Dep from "./dep"

class Observe {
    constructor(data) {
        // 为每个Observe设置个dep用于监听数组方法调用
        this.dep = new Dep()

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
 * 数组子项dep收集当前watcher
 * @param {*} value 
 */
function dependArray(value) {
    for (let index = 0; index < value.length; index++) {
        const current = value[index];
        current.__ob__ && current.__ob__.dep.depend()
        if (Array.isArray(current)) {
            dependArray(current)
        }
    }
}

/**
 * 利用Object.defineProperty进行响应式处理
 * @param {*} data 
 * @param {*} key 
 * @param {*} value 
 */
function defineReactive(data, key, value) {
    // val进行响应式
    const childernObj = observe(value)
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            if (Dep.target) {
                dep.depend()
                if (childernObj) {
                    // value的Observer上dep收集触发
                    childernObj.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newVal) {
            if (newVal === value) return
            // 新值增加响应式
            observe(newVal)
            value = newVal
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
    if (data.__ob__) return data.__ob__
    return new Observe(data)
}

