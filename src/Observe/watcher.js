import { addTarget, removeTarget } from "./dep"
let id = 0
class watcher {
    constructor(vm, expOrFn, cb, options) {
        // 参数赋值
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.options = options

        // 唯一id
        this.id = id++
        // 处理函数
        this.getter = expOrFn

        // Dep收集
        this.deps = []
        this.depIds = new Set()

        // 首次触发
        this.value = this.get()
    }

    /**
     * 处理收集和页面渲染
     */
    get() {
        addTarget(this)
        this.getter()
        removeTarget()
    }

    /**
     * 页面渲染
     */
    update() {
        this.get()
    }

    /**
     * watcher收集Dep
     * @param {*} dep 
     */
    addDep(dep) {
        let id = dep.id
        if (!this.depIds.has(id)) {
            this.depIds.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        }
    }
}


export default watcher