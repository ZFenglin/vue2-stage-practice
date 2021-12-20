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

        this.user = !!options.user
        if (typeof expOrFn === 'string') {
            this.getter = function () {
                let path = expOrFn.split('.')
                let val = vm
                for (let i = 0; i < path.length; i++) {
                    val = val[path[i]]
                }
                return val
            }
        } else {
            this.getter = expOrFn
        }

        this.deps = []
        this.depIds = new Set()

        this.value = this.get()
    }

    get() {
        pushTarget(this)
        const value = this.getter()
        popTarget()
        return value
    }

    update() {
        queueWatcher(this)
    }

    run() {
        const oldVal = this.value
        this.value = this.get()
        if (this.user && this.cb) {
            this.cb.call(this.vm, this.value, oldVal)
        }
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