import { parserHtml } from "./parser"

export function compileToFunction(template) {
    let root = parserHtml(template)
    console.log(root)
}