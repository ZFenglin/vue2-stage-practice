import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        vm.$el = patch(vm.$el, vnode)
    }
}

export function mountComponent(vm) {
    let updateComponent = () => {
        vm._update(vm._render())
    }
    updateComponent()
}