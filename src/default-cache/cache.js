class NodeCacheWrapper {
  constructor (options) {
    this.memorycache = new Map()
    this._hits = 0
    this._misses = 0
  }

  /**
   * Get a value for a given key
   * @param  {String} key
   * @return {Object}
   */
  get (key) {
    const hit = this.memorycache.get(key)
    if (hit) {
      this._hits++
    } else {
      this._misses++
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
    try {
      this.memorycache.set(key, value)
      return true
    } catch (e) {
      console.log('lol', e)
      return e
    }
  }

  /**
   * Check if a key is defined in the cache
   * @param  {String}  key
   * @return {Boolean}     true or false
   */
  has (key) {
    return this.memorycache.has(key)
  }

  /**
   * Reset the cache to an empty cache
   * @return {Boolean} true if cleared,
   */
  clear () {
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
    return this.memorycache.delete(key)
  }

  /**
   * Get the size of the cache
   * @return {Number}
   */
  size () {
    return this.memorycache.size
  }

  /**
   * Iterate on all element
   * @param  {Function} fn a callback returning (k, v) couple
   * @return {void}
   */
  forEach (fn) {
    this.memorycache.forEach(fn)
  }

  hits () {
    return this._hits
  }

  misses () {
    return this._misses
  }

  keys () {
    return this._getArrayFromIt(this.memorycache.keys())
  }

  values () {
    return this._getArrayFromIt(this.memorycache.values())
  }

  _getArrayFromIt (iterator) {
    let elem = iterator.next().value
    let res = []
    while (elem !== null && elem !== undefined) {
      res.push(elem)
      elem = iterator.next().value
    }
    return res
  }
}

module.exports = NodeCacheWrapper

// const a = new NodeCacheWrapper()
// a.set('toto', 4)
// a.set('titi', 5)
// console.log(a.keys(), a.values())
