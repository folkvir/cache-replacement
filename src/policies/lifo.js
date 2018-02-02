const LIFOQueue = require('../utils/map-double-linked-list')
const NodeCache = require('../default-cache/cache')
const debug = require('debug')('lifo')

module.exports = class LIFOPolicy extends NodeCache {
  constructor (options = {max: Infinity}) {
    super(options)
    this.keys = new LIFOQueue()
    this.max = options.max
  }

  set (key, value) {
    const max = this.max
    const size = this.keys.length
    if (size >= max) {
      this.del(this.keys.pop())
    }
    if (!this.keys.has(key)) {
      this.keys.push(key)
    }
    const res = super.set(key, value)
    return res
  }

  clear () {
    this.keys.clear()
    return super.clear()
  }

  del (key) {
    const del = super.del(key)
    del && this.keys.delete(key)
    return del
  }
}
