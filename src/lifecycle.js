import Watcher from "./Observe/watcher"
import { nextTick } from "./utils"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        const prevVnode = vm._vnode
        if (prevVnode) {
            // 后续渲染
            vm.$el = patch(prevVnode, vnode)
        } else {
            // 首次渲染
            vm.$el = patch(vm.$el, vnode)
        }
        vm._vnode = vnode
    }
    Vue.prototype.$nextTick = nextTick
}

export function mountComponent(vm) {
    callHook(vm, 'beforeMount')
    let updateComponent = () => {
        vm._update(vm._render())
    }
    // 创建渲染Watcher
    new Watcher(vm, updateComponent, () => { }, true)// true 表示为渲染Watcher
    callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
    let handlers = vm.$options[hook]
    if (handlers) {
        handlers.forEach(handler => handler.call(vm))
    }
}