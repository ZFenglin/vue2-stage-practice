/**
 * 挂载创建元素
 * @param {*} oldNode 
 * @param {*} vnode 
 * @returns 
 */
export function patch(oldNode, vnode) {
    if (!oldNode) {
        // 组件渲染
        return createElm(vnode)
    }
    if (oldNode.nodeType == 1) {
        // 首次渲染
        const parentElm = oldNode.parentNode
        let elm = createElm(vnode)
        parentElm.insertBefore(elm, oldNode.nextSibling)
        parentElm.removeChild(oldNode)
        return elm
    } else {
        // 后续更新
        // 1. 标签不一样 => 直接更新
        if (oldNode.tag !== vnode.tag) {
            return oldNode.el.parentNode.replaceChild(createElm(vnode), oldNode.el)
        }
        // 2. 复用旧节点
        let el = vnode.el = oldNode.el
        // 3. 文本节点 => 文本更新
        if (vnode.tag === undefined) {
            if (vnode.text !== oldNode.text) {
                el.textContent = vnode.text
            }
        }
        // 4. 属性更新
        patchProps(vnode, oldNode)
        // 5. 元素节点 => 属性更新，子节点处理
        let oldChildren = oldNode.children || []
        let newChildren = vnode.children || []
        if (oldChildren.length > 0 && newChildren.length > 0) {
            // 5.1 新旧都有子节点 => 子节点diff更新
            patchChildren(el, oldChildren, newChildren)
        } else if (newChildren.length > 0) {
            // 5.2 仅新有子节点 => 新节点添加
            newChildren.forEach(child => {
                el.appendChild(createElm(child))
            })
        } else if (oldChildren.length > 0) {
            // 5.3 仅旧有子节点 => 旧节点删除
            el.innerHtml = ''
        }
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
export function createElm(vnode) {
    let { tag, data, children, text, vm } = vnode
    if (typeof tag === 'string') {
        if (createComponent(vnode)) {
            return vnode.componentInstance.$el
        }
        vnode.el = document.createElement(tag)
        patchProps(vnode) // 由于是创建，只需要进行添加
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

/**
 * 标签属性更新
 * @param {*} vnode 
 * @param {*} oldProps 
 */
function patchProps(vnode, oldVNode = {}) {
    const newProps = vnode.data || {}
    const oldProps = oldVNode.data || {}
    const el = vnode.el
    const newStyle = newProps.style || {}
    const oldStyle = oldProps.style || {}
    // 旧属性删除
    for (const key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }
    for (const key in oldProps) {
        if (key !== 'style' && !newProps[key]) {
            el.removeAttribute(key)
        }
    }
    // 新属性添加
    for (const key in newProps) {
        if (key === 'style') {
            for (const styleName in newStyle) {
                el.style[styleName] = newStyle[styleName]
            }
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}

/**
 * 是否是相同节点
 * @param {*} oldVnode 
 * @param {*} newVnode 
 * @returns 
 */
function isSameVnode(oldVnode, newVnode) {
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key
}

/**
 * 子节点diff比较
 * @param {*} el 
 * @param {*} oldChilren 
 * @param {*} newChildren 
 */
function patchChildren(el, oldChilren, newChildren) {
    let oldStartIdx = 0
    let oldStarVnode = oldChilren[0]
    let oldEndIdx = oldChilren.length - 1
    let oldEndVnode = oldChilren[oldEndIdx]

    let newStartIdx = 0
    let newStartVnode = newChildren[0]
    let newEndIdx = newChildren.length - 1
    let newEndVnode = newChildren[newEndIdx]

    // 创建节点映射表
    const makeIndexByKey = (children) => {
        return children.reduce((memo, current, index) => {
            if (current.key) {
                memo[current.key] = index
            }
            return memo
        }, {})
    }
    const keyMap = makeIndexByKey(oldChilren)

    // 节点双方进行遍历，直到一边到了尽头
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        // 过滤空节点
        if (!oldStarVnode) {
            oldStarVnode = oldChilren[++oldStartIdx]
            // continue
        } else if (!oldEndVnode) {
            oldEndVnode = oldChilren[--oldEndIdx]
            // continue
        }
        if (isSameVnode(oldStarVnode, newStartVnode)) {
            // 旧头新头一致 => patch处理，头节点后移
            patch(oldStarVnode, newStartVnode)
            oldStarVnode = oldChilren[++oldStartIdx]
            newStartVnode = newChildren[++newStartIdx]
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            // 旧尾新尾一致 => patch处理，尾节点前移
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChilren[--oldEndIdx]
            newEndVnode = newChildren[--newEndIdx]
        } else if (isSameVnode(oldStarVnode, newEndVnode)) {
            // 旧头新尾一致 => patch处理，并将旧头节点移动至旧尾节点后，头节点后移，尾节点前移
            patch(oldStarVnode, newEndVnode)
            el.insertBefore(oldStarVnode.el, oldEndVnode.el.nextSibling)
            oldStarVnode = oldChilren[++oldStartIdx]
            newEndVnode = newChildren[--newEndIdx]
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            // 旧尾新头比较,标签一致 => patch处理，并将旧尾节点移动至旧头节点前，头节点后移，尾节点前移
            patch(oldEndVnode, newStartVnode)
            el.insertBefore(oldEndVnode.el, oldStarVnode.el)
            oldEndVnode = oldChilren[--oldEndIdx]
            newStartVnode = newChildren[++newStartIdx]
        } else {
            // 节点乱序 => 乱序diff处理
            let moveIndex = keyMap[newStartVnode.key]
            if (moveIndex === undefined) {
                el.insertBefore(createElm(newStartVnode), oldStarVnode.el)
            } else {
                let moveVnode = oldChilren[moveIndex]
                oldChilren[moveIndex] = null
                el.insertBefore(moveVnode.el, oldStarVnode.el)
                patch(moveVnode, newStartVnode)
            }
            newStartVnode = newChildren[++newStartIdx]
        }
    }

    // 新元素存在没有比对完的 => 直接添加父节点尾部
    if (newStartIdx <= newEndIdx) {
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            let achor = newChildren[newEndIdx + 1] == null ? null : newChildren[newEndIdx + 1].el
            el.insertBefore(createElm(newChildren[i]), achor)
        }
    }

    // 旧元素存在没有比对完的 => 直接删除剩余旧节点
    if (oldStartIdx <= oldEndIdx) {
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            if (oldChilren[i]) {
                el.removeChild(oldChilren[i].el)
            }
        }
    }
}