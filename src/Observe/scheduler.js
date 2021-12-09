import { nextTick } from "../utils"

let queue = []
let has = Object.create(null)
let pending = false

/**
 * 入队watcher渲染触发
 */
function flushSchedulerQueue() {
    queue.forEach((watcher) => watcher.run())
    queue = []
    let has = Object.create(null)
    pending = false
}

/**
 * watche入队收集
 * @param {*} watcher 
 */
export function queueWatcher(watcher) {
    const id = watcher.id
    if (!has[id]) {
        has[id] = true
        queue.push(watcher)
        if (!pending) {
            pending = true
            nextTick(flushSchedulerQueue)
        }
    }

}