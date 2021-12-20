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
        this.lazy = !!options.lazy
        this.dirty = this.lazy

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

        this.value = this.lazy ? null : this.get()
    }

    get() {
        pushTarget(this)
        const value = this.getter.call(this.vm)
        popTarget()
        return value
    }

    update() {
        if (this.lazy) {
            this.dirty = true
        } else {
            queueWatcher(this)
        }
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

    evaluate() {
        this.dirty = false
        this.value = this.get()
    }

    depend() {
        let i = this.deps.length
        while (i--) {
            this.deps[i].depend()
        }
    }
}

export default Watcher