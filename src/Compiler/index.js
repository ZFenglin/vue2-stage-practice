import { generate } from "./generate"
import { parserHtml } from "./parser"

export function compileToFunction(template) {
    let root = parserHtml(template)
    let code = generate(root)
    console.log(code)
}