const AbstractCache = require('./abstract-cache.js');
const lmerge = require('lodash.merge');
const EventEmitter = require('events');

module.exports = class NodeCache extends AbstractCache {
  constructor(cache, options = {}) {
    super();
    
    this._cache = new cache(options);
    this._events = new EventEmitter();
    
    lmerge(this, this._cache);
  }

  /**
   * Get a value for a given key
   * @param  {String} key
   * @return {Object}
   */
  get(key) {
    return this._cache.get(key);
  }

  /**
   * Set a value for a given key
   * @param  {String} key
   * @param {Object} value   [description]
   * @param {Object} options optionnal options
   */
  set(key, value, ...options) {
    return this._cache.set(key, value, ...options)
  }

  /**
   * Check if a key is defined in the cache
   * @param  {String}  key
   * @return {Boolean}     true or false
   */
  has(key) {
    return this._cache.has(key);
  }

  /**
   * Reset the cache to an empty cache
   * @return {void}
   */
  clear() {
    console.log(this);
    return this._cache.clear();
  }

  /**
   * Delete a given key from the cache
   * @param  {[type]} key
   * @return {Boolean}
   */
  del(key) {
    this._cache.del()
  }

  /**
   * Get the size of the cache
   * @return {Number}
   */
  size() {
    return this._cache.size();
  }
}
