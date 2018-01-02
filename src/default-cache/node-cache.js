const NodeCache = require('node-cache');

module.exports = class NodeCacheWrapper extends NodeCache{
  constructor(...options) {
    super(...options);
  }

  /**
   * Get a value for a given key
   * @param  {String} key
   * @return {Promise<Object>}
   */
  get(key) {
    return new Promise((resolve, reject) => {
      try {
        const get = this.super.get(key);
        resolve(get);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Set a value for a given key
   * @param  {String} key
   * @param {Object} value   [description]
   * @param {Promise<Object>} 
   */
  set(key, value) {
    return new Promise((resolve, reject) => {
      try {
        const set = this.super.set(key, value);
        resolve(set);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if a key is defined in the cache
   * @param  {String}  key
   * @return {c}     true or false
   */
  has(key) {
    return new Promise((resolve, reject) => {
      try {
        this.get(key).then((result) => {
          if(result) resolve(true);
          resolve(false);
        }).catch(e => {
          reject(e);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Reset the cache to an empty cache
   * @return {Promise<Boolean>} true if clear, otherwise reject the promise
   */
  clear() {
    return new Promise((resolve, reject) => {
      try {
        this.super.flushAll();
        resolve(true)
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Delete a given key from the cache
   * @param  {[type]} key
   * @return {Promise<Boolean>} true if deleted, false otherwise
   */
  del(key) {
    return new Promise((resolve, reject) => {
      try {
        const del = this.super.del(key);
        resolve(del);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get the size of the cache
   * @return {Promise<Number>}
   */
  size() {
    return new Promise((resolve, reject) => {
      try {
        const size = this.super.getStats().keys;
        resolve(size);
      } catch (error) {
        reject(error);
      }
    });
  }
}
