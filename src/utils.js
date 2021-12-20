export function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

export function isFunction(obj) {
    return typeof obj === 'function'
}


/// nextTick
let callbacks = []
let waiting = false

function timer(cb) {
    let timerFn = () => { }
    if (Promise) {
        timerFn = () => {
            Promise.resolve().then(cb)
        }
    } else if (MutationObserver) {
        let textNode = document.createTextNode(1)
        let ob = new MutationObserver(cb)
        ob.observe(textNode, { characterData: true })
        timerFn = () => {
            textNode.textContent = 2
        }
    } else if (setImmediate) {
        timerFn = () => {
            setImmediate(cb)
        }
    } else {
        timerFn = () => {
            setTimeout(cb)
        }
    }
    timerFn()
}

function flushCallbacks() {
    callbacks.forEach(cb => cb())
    callbacks = []
    waiting = false
}

export function nextTick(cb) {
    callbacks.push(cb)
    if (waiting) return
    waiting = true
    timer(flushCallbacks)
}