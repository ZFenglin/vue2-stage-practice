
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // 匹配{{}}

// 元素属性处理
function genProps(attrs) {
    let str = ''
    for (let index = 0; index < attrs.length; index++) {
        const attr = attrs[index];
        if (attr.name == 'style') {
            let styleObj = Object.create(null)
            attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
                styleObj[arguments[1]] = arguments[2]
            })
            attr.value = styleObj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`
}

// 节点生成处理
function gen(el) {
    if (el.type === 1) {
        // 元素节点处理
        return generate(el)
    } else {
        // 文本节点处理
        let text = el.text
        if (!defaultTagRE.test(text)) {
            return `_v(${el.text})`
        } else {
            let tokens = []
            let match
            let lastIndex = defaultTagRE.lastIndex = 0
            while (match = defaultTagRE.exec(text)) {
                let index = match.index
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                }
                tokens.push(`_s(${match[1].trim()})`)
                lastIndex = index + match[0].length
            }
            if (lastIndex < text.length) {
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join('+')})`
        }
    }
}

// 子元素生成
function genChildern(el) {
    let children = el.children
    if (children) {
        return children.map(child => gen(child)).join(',')
    }
    return false
}

// 生成元素code
export function generate(el) {
    let children = genChildern(el)
    let code = `_c('${el.tag}',${el.attrs.length ? genProps(el.attrs) : 'undefined'}, ${children ? children : 'undefined'})`
    return code
}