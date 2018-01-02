const AbstractCache = require('./abstract-cache');
const RdfStore = require('rdfstore');

module.exports = class RDFStore {
  constructor(options = { prefix: [] }) {
    this._prefix = [];
    this._size = 0;
    RdfStore.create((err, store) => {
      this.store = store;
      if(options.prefix.length > 0) options.prefix.forEach(p => this.addPrefix(p.name, p.value));
      console.log('RDF Store ready.');
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
    console.log('Prefix set: ', name, value);
  }

  /**
   * Get a value for a given key
   * @param  {String} key a Triple Pattern <?s ?p ?o> such as "?x db:Person 'toto'"
   * @return {Object}
   */
  get(key) {
    async function _get(key) {
      return await new Promise(resolve => {
        this.store.execute(`SELECT * { ${key} }`, function(err, results){
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
      const res = await new Promise(resolve => {
        console.log('=> Setting key: ', key, value);
        const data = value.join(" . ");
        this.store.execute(`INSERT DATA { ${data} }`, function(err, results){
          if(!err) {
            console.log('** Key set !')
            resolve(true);
          } else {
            console.warn(err);
            resolve(false);
          }
        });
      });
      return res;
    }
    const h = this.has(key);
    console.log('Sethas', h);
    if(h) {
      this._size += value.length;
      return _set.sync(this, key, value);
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
    async function _has (key, self) {
      return await new Promise((resolve, reject) => {
        const query = `ASK { ${key} }`;
        console.log('Query: ', query);
        self.store.execute(query, (err, results) => {
          if(err) {
            console.log(err);
            reject(err);
          } else {
            console.log('Result of query: ', query, results)
            self._resolve(resolve, results);
          }
        });
        console.log('test');
      })
    }
    
    return _has(key, this);
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
  
  _resolve(resolve, results) {
    setImmediate(() => {
      resolve(results);
    });
  }

  _makeMeLookSync(fn) {
    let iterator = fn();
    let loop = result => {
      !result.done && result.value.then(
        res => loop(iterator.next(res)),
        err => loop(iterator.throw(err))
      );
    };
  
    loop(iterator.next());
  }
}
