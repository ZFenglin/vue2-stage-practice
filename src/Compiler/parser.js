// vue 使用正则来匹配标签
// 标签名称
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 字母开头，后有0到多个字母、数字、下划线、点
// 用于获取标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // 可以有命名空间，可以没有 <aa:xxx></aa:xxx>
// 匹配标签开始符号
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配标签结束符号
const startTagClose = /^\s*(\/?)>/
// 匹配闭合标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 匹配标签属性
//            a =  ”xxx“ | ’xxx‘ | xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配 a="b" a='b' a=b
// 匹配模板语法
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // {{}}

function creatAstElement(tagName, attrs) {
    return {
        tag: tagName,
        type: 1,
        children: [],
        parent: null,
        attrs: attrs
    }

}

let root = null
let stack = []
// 开始标签处理
function start(tagName, attrs) {
    let element = creatAstElement(tagName, attrs)
    if (root === null) {
        root = element
    }
    let parent = stack[stack.length - 1]
    if (parent) {
        parent.children.push(element)
        element.parent = parent
    }
    stack.push(element)
}

// 闭合标签处理
function end(tagName) {
    let last = stack.pop()
    if (last.tag !== tagName) {
        throw new Error('标签不匹配')
    }
}

// 文本处理
function chars(text) {
    text = text.replace(/\s/g, '')
    let parent = stack[stack.length - 1]
    if (text) {
        parent.children.push({
            type: 3,
            text: text
        })
    }
}

// 解析文档
export function parseHTML(html) {
    // 解析截取
    function advance(len) {
        html = html.substring(len)
    }
    // 开头节点解析
    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: [],
            }
            advance(start[0].length)
            let end, attr
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] || '',
                })
            }
            if (end) {
                advance(end[0].length)
            }
            return match
        }
        return false
    }
    // 文档解析
    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            const startTagMatch = parseStartTag(html)
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                end(endTagMatch[1])
                advance(endTagMatch[0].length)
            }
        }
        let text
        if (textEnd > 0) {
            text = html.substring(0, textEnd)
        }
        if (text) {
            chars(text)
            advance(text.length)
        }

    }

    return root
}