const AbstractCache = require('./abstract-cache');
const RdfStore = require('rdfstore');
const debug = require('debug')('rdfstore');
const utils = require('../utils/n3parser.js');


module.exports = class RDFStore {
  constructor(options = { prefix: [] }) {
    this.options = options;
    this._prefix = [];
    this._size = 0;
  }
  /**
   * Create our triple store
   * @param  {[type]}  [options=this.options] [description]
   * @return {Promise}                        [description]
   */
  async create (options = this.options) {
    return new Promise((resolve, reject) => {
      this.options = options;
      this.utils = utils;
      RdfStore.create((err, store) => {
        if(err) reject(err);
        this.store = store;
        debug('RDF Store ready.');
        resolve();
      });
    })
  }

  /**
   * Return a fresh empty triple
   * @return {[type]} [description]
   */
  get freshTriple () {
    return {
      subject: "",
      predicate: "",
      object: ""
    }
  }

  /**
   * Get all triples matching the given triple pattern
   * @param  {[type]}  triple      [description]
   * @param  {[type]}  [self=this] [description]
   * @return {Promise}             [description]
   */
  async get(triple, self = this) {
    if(!utils.isTriple(triple)) {
      return Promise.reject(new Error("Need to be a triple: {subject: 'a' , predicate: 'x', object:'z' }"))
    }
    return self.getFromTriplePattern(triple, self.store);
  }

  /**
   * Insert a triple in our store
   * @param  {[type]}  key         [description]
   * @param  {[type]}  value       [description]
   * @param  {[type]}  [self=this] [description]
   * @return {Promise}             [description]
   */
  async set(key, value, self = this) {
    if(!value) value = key;
    if(!utils.isTriple(key) || !utils.isTriple(value)) {
      return Promise.reject(new Error("Need to be a triple: {subject: 'a' , predicate: 'x', object:'z' }"))
    }
    if(!await self.has(key, self)) {
      try {
        const res = await self.insertFromTriplePattern(key, self.store);
        self._size += 1;
        return Promise.resolve(true);
      } catch (error) {
        return Promise.reject(error);
      }
    } else {
      return Promise.resolve(false);
    }
  }

  /**
   * Check if a triple is in the cache
   * @param  {[type]}  triple      [description]
   * @param  {[type]}  [self=this] [description]
   * @return {Promise}             [description]
   */
  async has(triple, self = this) {
    if(!utils.isTriple(triple)) {
      return Promise.reject(new Error("Need to be a triple: {subject: 'a' , predicate: 'x', object:'z' }"))
    }
    return self.askFromTriplePattern(triple, self.store);
  }


  /**
   * Reset the cache to an empty cache
   * @return {Boolean} true if clear, false otherwise
   */
  async clear(self = this) {
    return await new Promise((resolve, reject) => {
      try {
        self.store.clear(() => {
          if(err) {
            console.warn(err);
            resolve(false);
          } else {
            self._size = 0;
            resolve(true);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Delete a given triple in the store
   * @param  {[type]} key
   * @return {Boolean} true if deleted, false otherwise
   */
  async del(triple, self = this) {
    if(!utils.isTriple(triple)) {
      return Promise.reject(new Error("Need to be a triple: {subject: 'a' , predicate: 'x', object:'z' }"))
    }

    if(await self.has(triple, self)) {
      try {
        const res = await self.deleteFromTriplePattern(triple, self.store);
        if(res) {
          self._size = self._size - 1;
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
  async size(self = this) {
    return self._size;
  }

  /**
   * @private
   * Get all matching triples from its representation by its triple pattern in the store
   * @param  {[type]}  triple [description]
   * @param  {[type]}  store  [description]
   * @return {Promise}        [description]
   */
  async getFromTriplePattern(triple, store) {
    return new Promise((resolve, reject) => {
      try {
        store.execute(`SELECT * WHERE { ${triple.subject} ${triple.predicate} ${triple.object} . }`, function(err, results){
          if(err) reject(err);
          debug('Getting: ', triple, 'Status: ', results)
          resolve(results);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @private
   * Ask if a triple is in the store
   * @param  {[type]}  triple [description]
   * @param  {[type]}  store  [description]
   * @return {Promise}        [description]
   */
  async askFromTriplePattern(triple, store) {
    return new Promise((resolve, reject) => {
      try {
        store.execute(`ASK { ${triple.subject} ${triple.predicate} ${triple.object} . }`, (err, results) => {
          if(err) reject(err);
          debug('Asking: ', triple, 'Status: ', results)
          resolve(results);
        });
      } catch (error) {
        reject(error);
      }
    })
  }

  /**
   * @private
   * delete a triple from the store
   * @param  {[type]}  triple [description]
   * @param  {[type]}  store  [description]
   * @return {Promise}        [description]
   */
  async deleteFromTriplePattern(triple, store) {
    return new Promise((resolve, reject) => {
      try {
        store.execute(`DELETE DATA { ${triple.subject} ${triple.predicate} ${triple.object} . }`, (err, results) => {
          if(err) reject(err);
          debug('Deleting: ', triple, 'Status: ', results)
          resolve(results);
        })
      } catch (e) {
          reject(e);
      }
    });
  }

  /**
   * insert a triple in the store
   * @param  {[type]}  triple [description]
   * @param  {[type]}  store  [description]
   * @return {Promise}        [description]
   */
  async insertFromTriplePattern(triple, store) {
    return new Promise((resolve, reject) => {
      store.execute(`INSERT DATA { ${triple.subject} ${triple.predicate} ${triple.object} . }`, (err, results) => {
        if(err) reject(err);
        debug('Inserting: ', triple, 'Status: ', results)
        resolve(results);
      })
    });
  }

  /**
   * Bonus: make any SPARQL 1.1 on the store
   * @param  {[type]}  query [description]
   * @return {Promise}       [description]
   */
  async query (query) {
    return new Promise((resolve, reject) => {
      store.execute(query, (err, results) => {
        if(err) reject(err);
        debug('Querying: ', query, 'Results: ', results)
        resolve(results);
      })
    });
  }
}
