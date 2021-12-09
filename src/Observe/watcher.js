import { addTarget, removeTarget } from "./dep"
import { queueWatcher } from "./scheduler"
let id = 0
class Watcher {
    constructor(vm, expOrFn, cb, options) {
        // 参数赋值
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.options = options

        // 唯一id
        this.id = id++

        // Dep收集
        this.deps = []
        this.depIds = new Set()

        // 用户自定义watcher
        this.user = !!options.user

        // 懒加载watcher
        this.lazy = !!options.lazy

        // 处理函数
        this.getter = typeof expOrFn === 'function' ? expOrFn : function () {
            let arr = expOrFn.split('.')
            let val = this.vm
            arr.forEach(attrName => {
                val = val[attrName]
            });
            return val
        }

        // 首次触发
        this.value = this.lazy ? undefined : this.get()
    }

    /**
     * 处理收集和页面渲染
     */
    get() {
        addTarget(this)
        const value = this.getter()
        removeTarget()
        return value
    }

    /**
     * 页面渲染触发队列收集
     */
    update() {
        queueWatcher(this)
    }

    /**
     * 渲染更新处理
     */
    run() {
        const newVal = this.get()
        const oldVal = this.value
        if (newVal !== oldVal) {
            this.cb.call(this.vm, newVal, oldVal)
        }
        this.value = newVal
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


export default Watcher