const MDLL = require('../utils/map-double-linked-list')
const NodeCache = require('../default-cache/cache')

class LRUPolicy extends NodeCache {
  constructor (options = {max: Infinity}) {
    super(options)
    this._keys = new MDLL()
    this._max = options.max
  }

  get (key) {
    const res = super.get(key)
    if (res) this._keys.bump(key)
    return res
  }

  set (key, value) {
    const max = this._max
    const size = this._keys.length
    if (size >= max) {
      this.del(this._keys.shift())
    }
    if (!this._keys.has(key)) {
      this._keys.push(key)
    } else {
      this._keys.bump(key)
    }
    const res = super.set(key, value)
    return res
  }

  clear () {
    this._keys.clear()
    return super.clear()
  }

  del (key) {
    const del = super.del(key)
    del && this._keys.delete(key)
    return del
  }
}

module.exports = LRUPolicy
