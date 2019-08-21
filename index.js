const { render, html, svg, hook } = require('lighterhtml')
const disconnected = require('disconnected')
const Event = require('@ungap/event')
const WeakSet = require('@ungap/essential-weakset')
const observe = disconnected({ Event, WeakSet })

exports.html = html
exports.svg = svg
exports.hook = hook

const unloaders = Symbol('unloaders')
const updating = Symbol('updating')
const first = Symbol('first')
const element = Symbol('element')

exports.Component = class Component {
  constructor (opts) {
    if (!opts) opts = {}

    this[element] = opts.element || null
    this[unloaders] = []
    this[updating] = false
    this[first] = true

    this.loaded = false

    if (opts.onload) this.onload = opts.onload
    if (opts.onunload) this.onunload = opts.onunload
    if (opts.render) this.render = opts.render
    if (opts.createElement) this.createElement = opts.createElement

    this.createElement = this.createElement.bind(this)
    this.html = html.for(this)
  }

  get element () {
    if (this[first]) {
      this[first] = false
      this[element] = this.createElement()
      observe(this[element])
      this[element].addEventListener('connected', this._onload.bind(this))
      this[element].addEventListener('disconnected', this._onunload.bind(this))
    }

    return this[element]
  }

  set element (el) {
    this[element] = el
  }

  on (emitter, name, fn) {
    this[unloaders].push([emitter, name, fn])
    on(emitter, name, fn)
  }

  once (emitter, name, fn) {
    this[unloaders].push([emitter, name, once(emitter, name, fn)])
  }

  update () {
    if (this[updating]) return
    this[updating] = true
    window.requestAnimationFrame(this._reallyUpdate.bind(this))
  }

  _reallyUpdate () {
    if (!this[updating]) return
    this[updating] = false
    this.render()
  }

  createElement () {
    // overwrite me
    return null
  }

  render () {
    this.createElement()
  }

  onload () {
    // overwrite me
  }

  onunload () {
    // overwrite me
  }

  _onload () {
    this.loaded = true
    this.onload()
    // if any listeners were attached in onload we trigger a rerender as state
    // may have changed between createElement or unload/load
    if (this[unloaders].length) this.render()
  }

  _onunload () {
    this.loaded = false
    this[updating] = false

    const list = this[unloaders]

    while (list.length) {
      const [emitter, name, fn] = list.pop()
      off(emitter, name, fn)
    }

    this.onunload()
  }
}

function on (e, name, fn) {
  if (e.on) e.on(name, fn)
  else if (e.addEventListener) e.addEventListener(name, fn)
  else e.addListener(name, fn)
}

function off (e, name, fn) {
  if (e.off) e.off(name, fn)
  else if (e.removeEventListener) e.removeEventListener(name, fn)
  else e.removeListener(name, fn)
}

function once (e, name, fn) {
  if (e.once) {
    e.once(name, fn)
  } else {
    fn = autoOff(e, name, fn)
    on(e, name, fn)
  }
  return fn
}

function autoOff (e, name, fn) {
  return function wrap () {
    off(e, name, wrap)
    fn.apply(this, arguments)
  }
}
