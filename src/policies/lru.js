const LRUQueue = require('../utils/map-double-linked-list')
const NodeCache = require('../default-cache/cache')

class LRUPolicy extends NodeCache {
  constructor (options = {max: Infinity}) {
    super(options)
    this.keys = new LRUQueue()
    this.max = options.max
  }

  get (key) {
    const res = super.get(key)
    if (res) {
      const node = this.keys.find(key)
      this.keys.bump(node)
    }
    return res
  }

  set (key, value) {
    const max = this.max
    const size = this.keys.length
    if (size >= max) {
      this.del(this.keys.shift())
    }
    if (!this.keys._map.has(key)) {
      this.keys.push(key)
    } else {
      const node = this.keys.find(key)
      this.keys.bump(node)
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
    del && this.keys.remove(this.keys.find(key))
    return del
  }
}

module.exports = LRUPolicy
