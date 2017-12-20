const EventEmitter = require('events');

let AbstractCache = (superclass) => class extends superclass {
  constructor(...options) {
    super(...options);
    this._options = options;
    this._variables = new Map();
    this._events = new EventEmitter();
    this._methodList = ["get", "set", "has", "clear", "del", "size"]
    this._methodList.forEach(method => {
      const superMethode = super[method];
      if(superMethode) {
        this[method] = (...args) => {
          return superMethode.call(this, ...args);
        }
      }
    })
  }
  /**
   * Get a value for a given key
   * @param  {String} key
   * @return {Object}
   */
  get(key) {
    throw new Error('Get method not implemented.');
  }

  /**
   * Set a value for a given key
   * @param  {String} key
   * @param {Object} value   [description]
   * @param {Boolean} return true if set or false otherwise
   */
  set(key, value) {
    throw new Error('Set method not implemented. Parameters: (key, value)');
  }

  /**
   * Check if a key is defined in the cache
   * @param  {String}  key
   * @return {Boolean}     true or false
   */
  has(key) {
    throw new Error('Has method not implemented.');
  }

  /**
   * Reset the cache to an empty cache
   * @return {Boolean} true if clear, false otherwise
   */
  clear() {
    throw new Error('Clear method not implemented.');
  }

  /**
   * Delete a given key from the cache
   * @param  {[type]} key
   * @return {Boolean} true if deleted, false otherwise
   */
  del(key) {
    throw new Error('Del method not implemented.');
  }

  /**
   * Get the size of the cache
   * @return {Number}
   */
  size() {
    throw new Error('Size method not implemented');
  }
}

module.exports = AbstractCache;
