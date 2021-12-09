/**
 * 是否是函数
 * @param {*} obj 
 * @returns 
 */
export function isFunction(obj) {
    return typeof obj === 'function'
}

/**
 * 是否是对象
 * @param {*} obj 
 * @returns 
 */
export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

/**
 * nextTick
 */
const callbacks = []
let waiting = false

/**
 * 执行所有回调
 */
function flushCallbacks() {
    callbacks.forEach(cb => cb())
    waiting = false
}
/**
 * 按照不同浏览器决定回调触发方式
 * @param {*} cb 
 */
function timer(cb) {
    let timerFn = () => { }
    if (Promise) {
        timerFn = () => {
            Promise.resolve().then(cb)
        }
    } else if (MutationObserver) {
        let dom = document.createTextNode('')
        let observer = new MutationObserver(cb)
        observer.observe(dom, {
            characterData: true
        })
        timerFn = () => {
            dom.textContent = Math.random()
        }
    } else if (setImmediate) {
        timerFn = () => { setImmediate(cb) }
    } else {
        timerFn = () => { setTimeout(cb, 0) }
    }
    timerFn()
}

/**
 * nextTick
 * @param {*} cb 
 */
export function nextTick(cb) {
    callbacks.push(cb)
    if (!waiting) {
        waiting = true
        timer(flushCallbacks)
    }
}
