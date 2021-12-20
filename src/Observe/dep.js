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


Dep.target = null
export function pushTarget(target) {
    Dep.target = target
}
export function popTarget() {
    Dep.target = null
}


export default Dep