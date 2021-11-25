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