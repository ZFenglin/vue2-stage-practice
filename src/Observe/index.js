import { isObject } from "../utils"
import { arrayMethods } from "./array"
import Dep from "./dep"

class Observer {
    constructor(data) {
        this.dep = new Dep()
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
            defineReactive(data, key, data[key])
        })
    }



}


function dependArray(value) {
    for (let i = 0; i < value.length; i++) {
        let current = value[i]
        current.__ob__ && current.__ob__.dep.depend()
        if (Array.isArray(current)) {
            dependArray(current)
        }
    }
}

function defineReactive(data, key, value) {
    let valueOb = observe(value)
    let dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            if (Dep.target) {
                dep.depend()
                if (valueOb) {
                    valueOb.dep.depend()
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
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

export function observe(data) {
    if (!isObject(data)) return
    if (data.__ob__) return data.__ob__
    return new Observer(data)
}