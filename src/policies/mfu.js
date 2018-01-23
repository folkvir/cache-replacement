const MFUCache = require('../utils/priority-cache.js')
const debug = require('debug')('mfu')

module.exports = class MFUPolicy extends MFUCache {
  constructor (options = {max: Infinity}) {
    super(options)
    this.max = options.max
  }

  set (key, value) {
    debug('Setting key:', key)
    const res = super.set(key, value)
    const max = this.max
    const size = this.length
    if (size > max) {
      const mostFrequent = this.mostFrequent.key
      if (mostFrequent !== key) this.delete(mostFrequent)
    }
    return res
  }
}
