let id = 0
class Dep {
    constructor() {
        this.id = id++
        this.subs = []
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    addSub(sub) {
        this.subs.push(sub)
    }

    notify() {
        this.subs.forEach(sub => sub.update())
    }
}

let stack = []

export function pushTarget(wathcer) {
    stack.push(wathcer)
    Dep.target = wathcer
}

export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}


export default Dep