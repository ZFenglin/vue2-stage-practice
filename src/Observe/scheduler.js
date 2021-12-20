import { nextTick } from "../utils"

let queue = []
let has = Object.create(null)
let pending = false

function flushSchedulerQueue() {
    queue.forEach(watcher => watcher.run())
    queue = []
    has = Object.create(null)
    pending = false
}

export function queueWatcher(watcher) {
    let id = watcher.id
    if (has[id]) return
    has[id] = true
    queue.push(watcher)
    if (pending) return
    pending = true
    nextTick(flushSchedulerQueue)
}