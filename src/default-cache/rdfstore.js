const AbstractCache = require('./abstract-cache');
const RdfStore = require('rdfstore');

module.exports = class RDFStore extends AbstractCache {
  constructor(options) {
    super();
    this.graphURI = options.graphURI && options.graphURI || undefined;
    this._prefix = options.prefix && options.prefix || undefined;
    this.store = undefined;
    RdfStore.create((err, store) => {
      this.store = store;
    });
    this._size = 0;
  }

  get prefixes () {
    let pre = '';
    this._prefix.forEach(p => pre += p + '\\' );
    return pre;
  }

  /**
   * Get a value for a given key
   * @param  {String} key a Triple Pattern <?s ?p ?o> such as "?x db:Person 'toto'"
   * @return {Object}
   */
  get(key) {
    async function _get(key) {
      return await new Promise(resolve => {
        this.store.execute(`${this.prefixes} SELECT * { ${key} }`, function(err, results){
          if(!err) {
            resolve(results);
          } else {
            console.warn(err);
            resolve(undefined);
          }
        });
      });
    }
    return _get(key);
  }

  /**
   * Set a value for a given key
   * @param  {String} key generic triple pattern such as ?x :a "b"
   * @param {Array} value   Array of Triples to store for the given key correspond to the key such as [ "'a' :a "b"",  "'b' :a "b"", ... ] 
   * @param {Boolean} return true if set or false otherwise
   */
  set(key, value) {
    async function _set(key, value) {
      return await new Promise(resolve => {
        this.store.execute(`${this.prefixes} INSERT DATA { ${value.join(' . ')} }`, function(err, results){
          if(!err) {
            resolve(true);
          } else {
            console.warn(err);
            resolve(false);
          }
        });
      });
    }
    if(this.has(key)) {
      this._size += value.length;
      return _set(key, value);
    } else {
      return false;
    }
  }

  /**
   * Check if a key is defined in the cache,
   * @param  {String}  key the key such ?x :a 'b'
   * @return {Boolean}     true or false
   */
  has(key) {
    async function _has(key) {
      return await new Promise(resolve => {
        this.store.execute(`${this.prefixes} ASK { ${key} }`, function(err, results){
          if(!err) {
            resolve(true);
          } else {
            console.warn(err);
            resolve(false);
          }
        });
      });
    }
    return _has(key);
  }

  /**
   * Reset the cache to an empty cache
   * @return {Boolean} true if clear, false otherwise
   */
  clear() {
    async function _clear() {
     const a = await new Promise((resolve) => {
        this.store.clear(() => {
          if(err) {
            console.warn(err);
            resolve(false);
          } 
          resolve(true);
        });
      });
      return a;
    }
    this._size = 0;
    return _clear();
  }

  /**
   * Delete a given key from the cache
   * @param  {[type]} key
   * @return {Boolean} true if deleted, false otherwise
   */
  del(key) {
    async function _del(key, value) {
      return await new Promise(resolve => {
        this.store.execute(`${this.prefixes} DELETE DATA { ${value.join(' . ')} }`, function(err, results){
          if(!err) {
            resolve(true);
          } else {
            console.warn(err);
            resolve(false);
          }
        });
      });
    }
    if(this.has(key)) {
      const res = _del(key);
      this.size = this.size - value.length;
    } else {
      return false;
    }
    return _del(key, value);
  }

  /**
   * Get the size of the cache
   * @return {Number}
   */
  size() {
    return this_size;
  }
  
}
