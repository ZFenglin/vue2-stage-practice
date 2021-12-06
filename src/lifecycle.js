export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        console.log('_update')
    }
}

export function mountComponent(vm) {
    let updateComponent = () => {
        vm._update(vm._render())
    }
    updateComponent()
}