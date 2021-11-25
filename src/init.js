import { initState } from "./state"

/**
 * 初始化原型方法混入
 * @param {*} Vue 
 */
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options
        initState(vm)
    }
}

