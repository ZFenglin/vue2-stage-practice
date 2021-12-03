import { compileToFunction } from "./Compiler/index"
import { initState } from "./state"

/**
 * 初始化原型方法混入
 * @param {*} Vue 
 */
export function initMixin(Vue) {
    // 初始化处理
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options
        initState(vm)

        // 元素挂载完成后，触发生命周期钩子
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    // 初始化元素绑定
    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)

        // 获取render函数（优先级 render>template>el）
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                template = el.outerHTML // 获取描述元素（包括其后代）的序列化HTML片段
            }
            options.render = compileToFunction(template)
        }
    }
}

