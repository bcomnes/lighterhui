# lighterhui

[![Build Status](https://travis-ci.org/hyperdivision/hui.svg?branch=master)](https://travis-ci.org/hyperdivision/hui)

[lighterhtml](https://github.com/WebReflection/lighterhtml#readme) + [hui](https://github.com/hyperdivision/hui)

```
npm install lighterhui
```

## Usage

``` js
const { Component, html } = require('lighterhui')

class AnotherComp extends Component {
  constructor (msg) {
    super()
    this.msg = msg
    this.value = 0

    this.someElement = html`<div>yo</div>`

    this.handleClick = this.handleClick.bind(this)
  }

  createElement () {
    const { msg } = this

    // Make sure to always use `this.html` inside the createElement function
    // That is the function bound to the component element
    return this.html`<div>
      ${msg}
      <button onclick="${this.handleClick}">Clicked ${this.value}</button>
      ${this.someElement}
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
```


Or you can use the shorthand if you are not subclassing

``` js
const view = new Component({
  createElement () {
    return this.html`<div>someDomElement</div>`
  },
  onload () {
    console.log('component loaded')
  },
  onunload () {
    console.log('component unloaded')
  },
  render () {
    console.log('override the default morph render method')
    console.log('call this.createElement() to morph at a any time.')
  }
})
```

## API

### `const { Component } = require('lighterhui')`

Base component with morph re-rendering and hooks for load, unload and
automatic event life cycle. 

### `const { html, svg, hook, render } = require('lighterhui')`

The exports from [`lighterhtml`](https://github.com/WebReflection/lighterhtml#readme).  You can use these however you would use those.

## Install

```sh
npm install lighterhui
```

## Why?

The nanostack had a lot of good ideas, but there was some unsolved issues and sharp edges.

Lighterhtml provides the ability to write stateful DOM components while avoiding many of those issues (like morph algorithm oditiies, and proxy nodes and other weird hacks).

Hui also solved a lot of issues nanocomponent had, especially regarding nested updates.  Putting the two together should provide the best of both worlds!  Maybe, I dunno. 

## License

MIT
