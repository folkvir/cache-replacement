const NodeCache = require('../default-cache/memory-cache')

module.exports = class FIFOPolicy extends NodeCache {
  constructor (options = {max: Infinity}) {
    super(options)
    this.max = options.max
    this._array = []
    this._correspondingKeys = new Map()
  }

  set (key, value) {
    const already = this.has(key)
    const res = super.set(key, value)
    if (res && !already) {
      const max = this.max
      const size = this._array.length
      if (size >= max) {
        this._randomreplacement()
      }
      this._array.push(key)
      this._correspondingKeys.set(key, this._array.length - 1)
    }
    return res
  }

  del (key) {
    const res = super.del(key)
    if (res) {
      const index = this._correspondingKeys.get(key)
      this._array.splice(index, 1)
      this._correspondingKeys.delete(key)
      return res
    }
  }

  _randomreplacement () {
    const index = Math.floor(Math.random() * (this.size() - 1))
    const key = this._array[index]
    super.del(key)
    this._correspondingKeys.delete(key)
    this._array.splice(index, 1)
  }
}
