/**
 * 挂载创建元素
 * @param {*} oldNode 
 * @param {*} vnode 
 * @returns 
 */
export function patch(oldNode, vnode) {
    if (!oldNode) {
        return createElm(vnode)
    }
    if (oldNode.nodeType == 1) {
        const parentElm = oldNode.parentNode
        let elm = createElm(vnode)
        parentElm.insertBefore(elm, oldNode.nextSibling)
        parentElm.removeChild(oldNode)
        return elm
    }
}

function createComponent(vnode) {
    let i = vnode.data
    if ((i = i.hook) && (i = i.init)) {
        i(vnode)
    }
    if (vnode.componentInstance) {
        return true
    }
}

/**
 * 创建DOM元素
 * @param {*} vnode 
 * @returns 
 */
function createElm(vnode) {
    let { tag, children, text } = vnode
    if (typeof tag === 'string') {
        if (createComponent(vnode)) {
            return vnode.componentInstance.$el
        }
        vnode.el = document.createElement(tag)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}