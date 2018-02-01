const NodeCache = require('memory-cache').Cache
const debug = require('debug')('memorycache')

module.exports = class NodeCacheWrapper {
  constructor (options) {
    this.memorycache = new NodeCache()
    this.hits = 0
    this.misses = 0
  }

  /**
   * Get a value for a given key
   * @param  {String} key
   * @return {Object}
   */
  get (key) {
    debug('Getting key: ', key)
    const hit = this.memorycache.get(key)
    if (hit) {
      this.hits++
    } else {
      this.misses++
    }
    return hit
  }

  /**
   * Set a value for a given key
   * @param  {String} key
   * @param {Object} value   [description]
   * @param {Object}
   */
  set (key, value) {
    debug('Setting key: ', key)
    try {
      this.memorycache.put(key, value)
      return true
    } catch (e) {
      return e
    }
  }

  /**
   * Check if a key is defined in the cache
   * @param  {String}  key
   * @return {Boolean}     true or false
   */
  has (key) {
    debug('Checking key: ', key)
    return (this.memorycache.get(key) !== null)
  }

  /**
   * Reset the cache to an empty cache
   * @return {Boolean} true if cleared,
   */
  clear () {
    debug('Clearing cache...')
    try {
      this.memorycache.clear()
      return true
    } catch (e) {
      return e
    }
  }

  /**
   * Delete a given key from the cache
   * @param  {[type]} key
   * @return {Boolean} true if deleted, false otherwise
   */
  del (key) {
    debug('Deleting key: ', key)
    return this.memorycache.del(key)
  }

  /**
   * Get the size of the cache
   * @return {Number}
   */
  size () {
    return this.memorycache.size()
  }

  /**
   * Iterate on all element
   * @param  {Function} fn a callback returning (k, v) couple
   * @return {void}
   */
  forEach (fn) {
    const keys = this.memorycache.keys()
    keys.forEach(key => {
      fn(key, this.memorycache.get(key))
    })
  }

  hits () {
    return this.hits
  }

  misses () {
    return this.hits
  }
}
