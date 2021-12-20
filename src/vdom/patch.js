export function patch(oldNode, vnode) {
    if (oldNode.nodeType == 1) {
        const parentElm = oldNode.parentNode
        let elm = createElm(vnode)
        parentElm.insertBefore(elm, oldNode.nextSibling);
        parentElm.removeChild(oldNode)
        return elm
    }
}

function createElm(vnode) {
    let { tag, data, children, text, vm } = vnode
    if (typeof vnode.tag === 'string') {
        vnode.el = document.createElement(tag) // 虚拟节点存在el属性对应它的真实节点
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}