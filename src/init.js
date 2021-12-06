import { compileToFunction } from "./Compiler/index"
import { initState } from "./state"

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options
        initState(vm)

        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        if (!options.render) {
            let template = options.template
            if (!template && el) {
                template = el.outerHTML
            }
            options.render = compileToFunction(template)
        }
    }
}

