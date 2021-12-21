class Collapse extends HTMLElement {
    constructor() {
        super()
        const shadow = this.attachShadow({ mode: "open" })
        const tmpl = document.getElementById("collapse_template")
        let cloneTmpl = tmpl.content.cloneNode(true)
        shadow.appendChild(cloneTmpl)

        let style = document.createElement('style')
        style.textContent = `
        :host{
            display:flex;
            border: 3px solid #ebebeb;
            border-radius:5px;
            width:100%;
        }
        .fl-collapse{
            width:100%;
        }
        `
        shadow.appendChild(style)

        let slot = shadow.querySelector('slot')
        slot.addEventListener('slotchange', (e) => {
            this.slotList = e.target.assignedElements()
            this.render()
        })

    }

    // 静态属性获取值，用于监控属性变化
    static get observedAttributes() {
        return ['active']
    }

    // connectedCallback() {
    //     // console.log('插入到dom回调')
    // }

    // disconnectedCallback() {
    //     // console.log('移除出dom回调')
    // }

    // adoptedCallback() {
    //     // console.log('移除到iframe回调')
    // }

    // 生命周期-监听属性变化
    attributeChangedCallback(key, oldVal, newVal) {
        if (key == 'active') {
            this.activeList = JSON.stringify(newVal)
            this.render()
        }
    }

    // 页面重新渲染
    render() {
        if (this.slotList && this.activeList) {
            // 父组件将值传递给子组件
            [...this.slotList].forEach(child => {
                child.setAttribute('active', JSON.stringify(this.activeList))
            })
        }
    }
}

export default Collapse