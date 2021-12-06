import { generate } from "./generate"
import { parserHtml } from "./parser"

export function compileToFunction(template) {
    let root = parserHtml(template)
    let code = generate(root)
    let render = new Function(`with(this){return ${code}}`)
    return render
}