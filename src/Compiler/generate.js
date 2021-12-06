const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // 匹配{{}}
/**
 * 属性解析
 * @param {*} attrs 
 */
function genProps(attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i]
        if (attr === 'style') {
            const styleObj = {}
            attrs.value.replace(/\s*([^:]+):\s*([^;]+);?/g, function (match, name, value) {
                styleObj[name] = value
            })
            attrs.value = styleObj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}
/**
 * 元素解析
 * @param {*} el 
 */
function gen(el) {
    if (el.type === 1) {
        // 元素节点解析
        return generate(el)
    } else {
        // 文本节点解析
        let text = el.text
        if (!defaultTagRE.test(text)) {
            // 没有模板语法
            return `_v(${text})`
        } else {
            // 存在模板语法
            const token = []
            let match
            let lastIndex = defaultTagRE.lastIndex = 0
            while (match = defaultTagRE.exec(el.text)) {
                let index = match.index
                if (index > lastIndex) {
                    // 处理前面文本
                    token.push(JSON.stringify(el.text.slice(lastIndex, index)))
                }
                token.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if (lastIndex < text.length) {
                token.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${token.join('+')})`
        }
    }
}

/**
 * 子节点处理
 * @param {*} el 
 * @returns 
 */
function genChildren(el) {
    const children = el.children
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
    return false
}

export function generate(root) {
    const children = genChildren(root)
    return `_c("${root.tag}", ${root.attrs ? genProps(root.attrs) : 'undefined'},${children ? children : ''})`
}