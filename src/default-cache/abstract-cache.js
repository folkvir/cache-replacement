const EventEmitter = require('events');

let AbstractCache = (superclass) => class extends superclass {
  constructor(...options) {
    super(...options);
    this._options = options;
    this._variables = new Map();
    this._events = new EventEmitter();
    this._methodList = ["get", "set", "has", "clear", "del", "size"]
    this._methodList.forEach(method => {
      const superMethod = super[method];
      if(superMethod) {
        this[method] = (...args) => {
          return superMethod.call(this, ...args);
        }
      }
    })
  }
  /**
   * Get a value for a given key
   * @param  {String} key
   * @return {Promise<Object>}
   */
  get(key) {
    throw new Error('Get method not implemented.');
  }

  /**
   * Set a value for a given key
   * @param  {String} key
   * @param {Object} value   [description]
   * @param {Promise<Object>} 
   */
  set(key, value) {
    throw new Error('Set method not implemented. Parameters: (key, value)');
  }

  /**
   * Check if a key is defined in the cache
   * @param  {String}  key
   * @return {c}     true or false
   */
  has(key) {
    throw new Error('Has method not implemented.');
  }

  /**
   * Reset the cache to an empty cache
   * @return {Promise<Boolean>} true if clear, false otherwise
   */
  clear() {
    throw new Error('Clear method not implemented.');
  }

  /**
   * Delete a given key from the cache
   * @param  {[type]} key
   * @return {Promise<Boolean>} true if deleted, false otherwise
   */
  del(key) {
    throw new Error('Del method not implemented.');
  }

  /**
   * Get the size of the cache
   * @return {Promise<Number>}
   */
  size() {
    throw new Error('Size method not implemented');
  }
}

module.exports = AbstractCache;
