import { isObject } from "../utils"
import { arrayMethods } from "./array"
import Dep from "./dep"

class Observer {
    constructor(data) {
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false,
        })
        if (Array.isArray(data)) {
            data.__proto__ = arrayMethods
            this.observeArray(data)
        } else {
            this.walk(data)
        }
    }

    observeArray(data) {
        data.forEach(item => {
            observe(item)
        })
    }


    walk(data) {
        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
        })
    }

    defineReactive(data, key, value) {
        observe(value)
        let dep = new Dep()
        Object.defineProperty(data, key, {
            get() {
                if (Dep.target) {
                    dep.depend()
                }
                return value
            },
            set(newVal) {
                if (newVal === value) return
                observe(newVal)
                value = newVal
                dep.notify()
                return value
            }
        })
    }
}



export function observe(data) {
    if (!isObject(data)) return
    if (data.__ob__) return
    return new Observer(data)
}