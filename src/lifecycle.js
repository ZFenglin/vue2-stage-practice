import Watcher from "./Observe/wathcer"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        vm.$el = patch(vm.$el, vnode)
    }
}

export function mountComponent(vm, el) {
    let updateComponent = () => {
        vm._update(vm._render())
    }
    new Watcher(vm, updateComponent, null, true)
}