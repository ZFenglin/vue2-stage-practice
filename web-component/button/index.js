class FlButton extends HTMLElement {
    constructor() {
        super()
        let shadow = this.attachShadow({ mode: 'open' })
        let btn = document.getElementById('btn')
        let btnClone = btn.content.cloneNode(true)
        shadow.appendChild(btnClone)
        let type = this.getAttribute('type') || 'default'
        const btnStyle = {
            'primary': {
                backgroud: "#409eff"
            },
            'default': {
                backgroud: "#909399"
            }
        }
        const style = document.createElement('style')
        style.textContent = `
            .fl-button {
                outline: none;
                border: none;
                border-radius: 5px;
                padding: 10px 20px;
                display: inline-flex;
                color: #FFF;
                background: ${btnStyle[type].backgroud};
            }
            `
        shadow.appendChild(style)
    }
}


window.customElements.define('fl-button', FlButton);