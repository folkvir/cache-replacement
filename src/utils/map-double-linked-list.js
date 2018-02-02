const FIFO = require('fifo')

module.exports = class MapDoubleLinkedList {
  constructor (options) {
    this.fifo = new FIFO()
    this._map = new Map()
  }

  get length () {
    return this.size()
  }

  size () {
    return this._map.size
  }

  get (key) {
    const node = this._map.get(key)
    if (node) return node.value
    return undefined
  }

  getNode (key) {
    return this._map.get(key)
  }

  // redefinition of insertions
  push (value) {
    const n = this.fifo.push(value)
    this._map.set(value, n)
    return n
  }

  unshift (value) {
    const n = this.fifo.unshift(value)
    this._map.set(value, n)
    return n
  }

  // deletion
  pop (key) {
    const node = this.fifo.pop(key)
    this._map.delete(node.value)
    return node
  }

  shift (key) {
    const node = this.fifo.shift(key)
    this._map.delete(node.value)
    return node
  }

  delete (key) {
    const node = this._map.get(key)
    if (node) {
      this.fifo.remove(node)
      this._map.delete(key)
      return true
    } else {
      return false
    }
  }

  forEach (fn) {
    this._map.forEach(fn)
  }

  first () {
    return this.fifo.first()
  }

  last () {
    return this.fifo.last()
  }

  has (key) {
    return this._map.has(key)
  }

  removeAll () {
    this.clear()
  }

  clear () {
    this.fifo.clear()
    this._map = new Map()
  }

  bump (key) {
    const node = this.getNode(key)
    if (node) return this.fifo.bump(node)
    return undefined
  }
}
