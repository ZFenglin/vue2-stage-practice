import { mergeOptions } from "../utils"

export function initGlobalApi(Vue) {
    Vue.options = {} // 全局配置

    /**
     * mixin合并配置
     * @param {*} options 
     * @returns 
     */
    Vue.mixin = function (options) {
        this.options = mergeOptions(this.options, options)
        return this
    }

    Vue.options._base = Vue // 全局配置的基类
    Vue.options.components = {} // 全局配置的组件

    /**
     * 全局组件声明
     * @param {*} id 
     * @param {*} definition 
     */
    Vue.component = function (id, definition) {
        definition = this.options._base.extend(definition)
        this.options.components[id] = definition
    }

    /**
     * Vue构造函数获取
     * @param {*} options 
     * @returns 
     */
    Vue.extend = function (definition) {
        const Super = this
        const Sub = function VueComponent(options) {
            this._init(options)
        }
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        Sub.options = mergeOptions(Super.options, definition)
        return Sub
    }
}