let id = 0

class Dep {
    constructor() {
        // 唯一id
        this.id = id++
        // 存储watcher
        this.subs = []
    }
    /**
     * getter时被触发，触发target收集当前dep
     */
    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    /**
     * dep收集watcher
     * @param {*} watcher 
     */
    addSub(watcher) {
        this.subs.push(watcher)
    }

    /**
     * 通知所有watcher更新
     */
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}

// 设置需要用于触发收集的watcher
Dep.target = null
const targetStack = []
export function addTarget(watcher) {
    targetStack.push(watcher)
    Dep.target = watcher
}
export function removeTarget() {
    targetStack.pop()
    Dep.target = targetStack[targetStack.length - 1]
}

export default Dep