import { generate } from "./generate"
import { parseHTML } from "./parser"

export function compileToFunction(template) {
    const root = parseHTML(template)
    const code = generate(root)
    let render = new Function(`with(this){return ${code}}`)
    return render
}