const Store = require('n3').Store

module.exports = class TriplStore {
  constructor () {
    this._store = new Store()
  }

  get store () {
    return this._store
  }

  /**
   * Get a value for a given key
   * @param  {String} key
   * @return {Object}
   */
  get (key) {
    return this._store.getTriples(key)
  }

  /**
   * Set a value for a given key
   * @param  {String} key
   * @param {Object} value   [description]
   * @param {Boolean} return true if set or false otherwise
   */
  set (key, value) {
    return this._store.addTriple(key.subject, key.predicate, key.object, key.graph)
  }

  /**
   * Check if a key is defined in the cache
   * @param  {String}  key
   * @return {Boolean}     true or false
   */
  has (key) {
    const size = this._store.countTriples(key)
    if (size > 0) return true
    return false
  }

  /**
   * Reset the cache to an empty cache
   * @return {Boolean} true if clear, false otherwise
   */
  clear () {
    try {
      this._store = new Store()
      return true
    } catch (e) {
      console.log(e)
      return e
    }
  }

  /**
   * Delete a given key from the cache
   * @param  {[type]} key
   * @return {Boolean} true if deleted, false otherwise
   */
  del (key) {
    return this._store.removeTriple(key.subject, key.predicate, key.object, key.graph)
  }

  /**
   * Get the size of the cache
   * @return {Number}
   */
  size () {
    return this._store.size
  }
}
