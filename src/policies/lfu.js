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
    if (size >= max) {
      const leastFrequent = this.leastFrequent.key
      if (leastFrequent !== key) this.delete(leastFrequent)
    }
    return super.set(key, value)
  }
}
