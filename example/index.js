const { Component, html: globalHtml } = require('../index.js')

class AnotherComp extends Component {
  constructor (msg) {
    super()
    this.msg = msg
    this.value = 0

    this.handleClick = this.handleClick.bind(this)
  }

  createElement () {
    const { msg, html } = this
    return html`<div>
      ${msg}
      <button onclick="${this.handleClick}">Clicked ${this.value}</button>
    </div>`
  }

  handleClick () {
    this.value++
    this.update()
  }

  onload () {
    console.log(`${this.msg} loaded`)
  }

  onunload () {
    console.log(`${this.msg} unloaded`)
  }
}

class MyComponent extends Component {
  constructor () {
    super()

    this.count = 0

    this.view = new AnotherComp('view1')
    this.view2 = new AnotherComp('view2')
    this.view3 = new AnotherComp('view3')

    this.handleClick = this.handleClick.bind(this)
  }

  createElement () {
    const { html } = this

    return html`
      <div>This is a component: ${this.count}
        <button onclick="${this.handleClick}">Click me</button>
        ${(this.count % 3) === 0 ? this.view.element : null}
        ${(this.count % 3) === 1 ? this.view2.element : null}
        ${(this.count % 3) === 2 ? this.view3.element : null}
        <div class="${this.count}">foo ${this.count} bar</div>
      </div>`
  }

  handleClick () {
    this.count++
    this.update()
  }

  onload () {
    console.log('loaded')
  }

  onunload () {
    console.log('unloaded')
  }
}

const comp = new MyComponent()

document.body.appendChild(comp.element)

window.comp = comp
