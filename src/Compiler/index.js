// vue 使用正则来匹配标签
// 标签名称
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 字母开头，后有0到多个字母、数字、下划线、点
// 用于获取标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // 可以有命名空间，可以没有 <aa:xxx></aa:xxx>
// 匹配标签开始
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配标签结束
const startTagClose = /^\s*(\/?)>/
// 匹配闭合标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
// 匹配标签属性
//            a =  ”xxx“ | ’xxx‘ | xxx
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配 a="b" a='b' a=b
// 匹配模板语法
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g // {{}}
// 特殊标签 <!doctype html> <!---->


function parserHtml(html) {
    /**
     * 处理标签前进
     * @param {*} len 
     */
    function advance(len) {
        html = html.substring(len)
    }
    /**
     * 处理开始标签
     */
    function parseStartTag() {
        const start = html.match(startTagOpen) // 匹配开始标签
        if (start) {
            // 开始标签开始符号处理
            const startTagObj = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            // 处理开始标签属性
            let attr, end
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                startTagObj.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] || ''
                })
                advance(attr[0].length)
            }
            // 处理开始标签闭合符号
            if (end) {
                advance(end[0].length)
            }
            return startTagObj
        }
        return false
    }

    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd === 0) { // 说明可能时开始标签或者结束标签
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            // 闭合标签处理
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue
            }
        }
        // 文本标签处理
        let text
        if (textEnd > 0) { // textEnd > 0 说明有文本
            text = html.substring(0, textEnd)
        }
        if (text) {
            chars(text)
            advance(text.length)
        }
    }


}


function start(tagName, attributes) {
    console.log('start', tagName, attributes)
}
function end(tagName) {
    console.log('end', tagName)
}
function chars(text) {
    console.log('text', text)
}

export function compileToFunction(template) {
    console.log(template)
    parserHtml(template)
}