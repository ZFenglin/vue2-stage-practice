import { initGlobalApi } from "./global-api/index"
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./render"
import { stateMixin } from "./state"
import { diffTest } from "./test/diff"

function Vue(options) {
    // 初始化处理
    this._init(options)
}

initMixin(Vue)
renderMixin(Vue)
lifecycleMixin(Vue)
stateMixin(Vue)
initGlobalApi(Vue)

diffTest(Vue)

export default Vue