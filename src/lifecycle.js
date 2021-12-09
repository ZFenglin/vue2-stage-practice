import watcher from "./Observe/watcher"
import { nextTick } from "./utils"
import { patch } from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        vm.$el = patch(vm.$el, vnode)
    }
    Vue.prototype.$nextTick = nextTick
}

export function mountComponent(vm) {
    let updateComponent = () => {
        vm._update(vm._render())
    }
    // 创建渲染Watcher
    new watcher(vm, updateComponent, () => { }, true)// true 表示为渲染Watcher
}