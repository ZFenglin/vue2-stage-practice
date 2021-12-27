import { isObject, isReservedTag } from "../utils"

function vnode(vm, tag, data, key, children, text, componentOptions) {
    return { vm, tag, data, key, children, text, componentOptions }
}

export function createElement(vm, tag, data = {}, children) {
    if (isReservedTag(tag)) {
        return vnode(vm, tag, data, data.key, children, undefined)
    } else {
        const Ctor = vm.$options.components[tag]
        return createComponent(vm, tag, data, data.key, children, Ctor)
    }
}
export function createTextElement(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}

function createComponent(vm, tag, data, key, children, Ctor) {
    if (isObject(Ctor)) {
        Ctor = vm.$options._base.extend(Ctor)
    }
    data.hook = {
        init(vnode) {
            let vm = vnode.componentInstance = new Ctor({
                _isComponent: true
            })
            vm.$mount()
        }
    }
    return vnode(vm, `vue-component-${tag}`, data, key, undefined, undefined, {
        Ctor,
        children
    })

}