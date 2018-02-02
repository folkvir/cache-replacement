const LFUCache = require('../utils/priority-cache.js')
const debug = require('debug')('lfu')

module.exports = class LFUPolicy extends LFUCache {
  constructor (options = {max: Infinity}) {
    super(options)
    this.max = options.max
  }

  set (key, value) {
    debug('Setting key:', key)
    const max = this.max
    const size = this.length
    if (this.has(key)) return super.set(key, value)
    if (size >= max) {
      this.delete(this.leastFrequent.key)
    }
    const res = super.set(key, value)
    return res
  }
}
