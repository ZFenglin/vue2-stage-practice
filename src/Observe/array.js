let originalArrayMethods = Array.prototype
export const arrayMethods = Object.create(originalArrayMethods)

let medthods = ['push', 'unshift', 'pop', 'shift', 'sort', 'reverse', 'splice']

medthods.forEach(method => {
    arrayMethods[method] = function (...args) {
        // 原生数组方法调用
        let result = originalArrayMethods[method].apply(this, args)
        // 新增数据响应式处理
        let ob = this.__ob__
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
        if (inserted) {
            ob.observeArray(inserted)
        }
        // 方法调用Dep更新
        if (ob.dep) {
            ob.dep.notify()
        }
        return result
    }
})