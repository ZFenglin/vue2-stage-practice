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

        // 决定当前是否为脏数据
        this.dirty = this.lazy

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
        const value = this.getter.call(this.vm)
        removeTarget()
        return value
    }

    /**
     * 页面渲染触发队列收集
     * 对于懒加载的watcher则不会进行收集
     */
    update() {
        if (this.lazy) {
            this.dirty = true
        } else {
            queueWatcher(this)
        }
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

    /**
     * 懒加载watcher求值
     */
    evaluate() {
        this.dirty = false
        this.value = this.get()

    }
    /**
     * 懒加载watcher收集当前所有的deps
     */
    depend() {
        let i = this.deps.length
        while (i--) {
            // 此处会对子属性的watcher收集
            this.deps[i].depend()
        }
    }
}


export default Watcher