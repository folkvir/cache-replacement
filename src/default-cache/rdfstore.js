const AbstractCache = require('./abstract-cache');
const RdfStore = require('rdfstore');
const debug = require('debug')('rdfstore');

module.exports = class RDFStore {
  constructor(options = { prefix: [] }) {
    this._prefix = [];
    this._size = 0;
    RdfStore.create((err, store) => {
      this.store = store;
      if(options.prefix.length > 0) options.prefix.forEach(p => this.addPrefix(p.name, p.value));
      debug('RDF Store ready.');
    });  
  }
  
  get prefixes () {
    return this._prefix;
  }

  addPrefix(name, value) {
    if(!name || !value) throw new Error('A prefix need to have a name and a value such as {name: "dc", value: "http://..."}');
    this._prefix.push({name, value});
    this._setPrefix(name, value);
  }

  _setPrefix(name, value) {
    this.store.setPrefix(name, value);
    debug('Prefix set: ', name, value);
  }

  /**
   * Get a value for a given key
   * @param  {String} key a Triple Pattern <?s ?p ?o> such as "?x db:Person 'toto'"
   * @return {Object}
   */
  async get(key) {
    return new Promise((resolve, reject) => {
      try {
        const query = `SELECT * WHERE { ${key} . }`;
        debug('Query:', query);
        this.store.execute(query, function(err, results){
          if(!err) {
            resolve(results);
          } else {
            console.warn(err);
            resolve(undefined);
          }
        });  
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Set a value for a given key
   * @param  {String} key generic triple pattern such as ?x :a "b" or the key equal the value
   * @param {Array} value   Array of Triples to store for the given key correspond to the key such as [ "'a' :a "b"",  "'b' :a "b"", ... ] 
   * @param {Boolean} return true if set or false otherwise
   */
  async set(key, value) {
    function _set(self, key, value) {
      return new Promise((resolve, reject) => {
        if(!Array.isArray(value)) value = [value];
        debug('=> Setting key: ', key, value);
        const data = value.join(" . ");
        try {
          self.store.execute(`INSERT DATA { ${data} }`, function(err, results){
            if(!err) {
              resolve(true);
            } else {
              console.warn('An error occured during method set:', err);
              resolve(false);
            }
          });  
        } catch (error) {
          console.warn('An error occured during method set:', error);
          reject(error);
        }
      });
    }

    if(!await this.has(key)) {
      try {
        const res = await _set(this, key, value);
        debug(res);
        if(res) {
          this._size += value.length;
          return Promise.resolve(true);
        } else {
          Promise.resolve(false);
        }
      } catch (error) {
        return Promise.reject(error);
      }
      
    } else {
      return Promise.resolve(false);
    }
  }

  /**
   * Check if a key is defined in the cache,
   * @param  {String}  key the key such ?x :a 'b'
   * @return {Boolean}     true or false
   */
  async has(key) {
    return new Promise((resolve, reject) => {
      const query = `ASK { ${key} }`;
      debug('Query: ', query);
      try {
        this.store.execute(query, (err, results) => {
          if(err) {
            debug(err);
            reject(err);
          } else {
            debug('Result of query: ', query, results)
            resolve(results);
          }
        });  
      } catch (error) {
        console.warn('An error occured during method has:', error);
        reject(error);
      }
    })
  }


  /**
   * Reset the cache to an empty cache
   * @return {Boolean} true if clear, false otherwise
   */
  async clear() {
    return await new Promise((resolve, reject) => {
      try {
        this.store.clear(() => {
          if(err) {
            console.warn(err);
            resolve(false);
          } else {
            this._size = 0;
            resolve(true);
          }
        });  
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Delete a given key from the cache
   * @param  {[type]} key
   * @return {Boolean} true if deleted, false otherwise
   */
  async del(key) {
    async function _del(key, value) {
      return await new Promise((resolve, reject) => {
        try {
          this.store.execute(`${this.prefixes} DELETE DATA { ${value.join(' . ')} }`, function(err, results){
            if(!err) {
              resolve(true);
            } else {
              console.warn(err);
              resolve(false);
            }
          });  
        } catch (error) {
          reject(error);
        }
      });
    }
    if(await this.has(key)) {
      try {
        const res = await _del(key);
        if(res) {
          this.size = this.size - value.length;
          return Promise.resolve(true);
        } else {
          return Promise.resolve(false);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.resolve(false);
    }
  }

  /**
   * Get the size of the cache
   * @return {Number}
   */
  size() {
    return Promise.resolve(this_size);
  }
}
