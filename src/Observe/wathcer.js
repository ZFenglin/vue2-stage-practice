import { popTarget, pushTarget } from "./dep"
import { queueWatcher } from "./scheduler"

let id = 0

class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.id = id++
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.options = options

        this.getter = expOrFn

        this.deps = []
        this.depIds = new Set()

        this.get()
    }

    get() {
        pushTarget(this)
        this.getter()
        popTarget()
    }

    update() {
        queueWatcher(this)
    }

    run() {
        this.get()
    }

    addDep(dep) {
        let id = dep.id
        if (this.depIds.has(id)) return
        this.depIds.add(id)
        this.deps.push(dep)
        dep.addSub(this)
    }
}

export default Watcher