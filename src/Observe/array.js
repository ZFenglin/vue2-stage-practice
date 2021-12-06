const originalArrayMethods = Array.prototype
export const arrayMethods = Object.create(originalArrayMethods)

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
]

methods.forEach(method => {
    arrayMethods[method] = function (...args) {
        console.log(`执行了${method}方法`)
        let result = originalArrayMethods[method].apply(this, args)
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
        }
        const ob = this.__ob__
        if (inserted) {
            ob.observeArray(inserted)
        }
        return result
    }
})