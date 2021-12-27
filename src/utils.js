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

/**
 * 配置及合并策略
 */
// 配置合并策略
let strats = {}
let lifecycleHooks = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated'
]
lifecycleHooks.forEach(hook => strats[hook] = mergeHook)

// 生命周期合并策略
function mergeHook(parentVal, childVal) {
    if (childVal) {
        if (parentVal) {
            return parentVal.concat(childVal)
        } else {
            return [childVal]
        }
    } else {
        return parentVal
    }
}

// 组件配置合并策略
strats.components = function (parentVal, childVal) {
    let options = Object.create(parentVal)
    if (childVal) {
        for (let key in childVal) {
            options[key] = childVal[key]
        }
    }
    return options
}

export function mergeOptions(parent, child) {
    const options = {}
    for (let key in parent) {
        mergeField(key)
    }
    for (const key in child) {
        if (parent.hasOwnProperty(key)) {
            continue
        }
        mergeField(key)
    }
    function mergeField(key) {
        let parentVal = parent[key]
        let childVal = child[key]
        if (strats[key]) {
            options[key] = strats[key](parentVal, childVal)
        } else if (isObject(parentVal) && isObject(childVal)) {
            options[key] = { ...parentVal, ...childVal }
        } else {
            options[key] = childVal || parentVal
        }
    }
    return options
}


export function isReservedTag(str) {
    let reservedTag = 'a,div,span,img,input,button,textarea,form,p,h1,h2,h3,h4,h5,h6,ul,li,ol,dl,dt,dd,table,tr,th,td,select,option,optgroup,meta,link,style,script,head,title,body,html'
    return reservedTag.includes(str)
}