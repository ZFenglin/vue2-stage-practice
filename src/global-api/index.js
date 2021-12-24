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
}