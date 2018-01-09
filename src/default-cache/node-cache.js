const NodeCache = require('node-cache');

module.exports = class NodeCacheWrapper extends NodeCache{
  constructor(...options) {
    super(...options);
  }

  /**
   * Get a value for a given key
   * @param  {String} key
   * @return {Object}
   */
  get(key) {
    return super.get(key);
  }

  /**
   * Set a value for a given key
   * @param  {String} key
   * @param {Object} value   [description]
   * @param {Object}
   */
  set(key, value) {
    return super.set(key, value);
  }

  /**
   * Check if a key is defined in the cache
   * @param  {String}  key
   * @return {Boolean}     true or false
   */
  has(key) {
    return (this.get(key))?true:false;
  }

  /**
   * Reset the cache to an empty cache
   * @return {Boolean} true if cleared,
   */
  clear() {
    try {
      super.flushAll();
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Delete a given key from the cache
   * @param  {[type]} key
   * @return {Boolean} true if deleted, false otherwise
   */
  del(key) {
    return super.del(key);
  }

  /**
   * Get the size of the cache
   * @return {Number}
   */
  size() {
    return super.getStats().keys;
  }
}
