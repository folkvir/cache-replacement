const LIFOQueue = require('../utils/map-double-linked-list.js');
const debug = require('debug')('lifo');


module.exports = class LIFOPolicy {
  constructor(options) {
    this._methods = ['set', 'del', 'clear'];
  }
  get methods () {
    return this._methods;
  }

  apply(cache) {
    // initialize variable for ou policy
    const options = cache._options[0] === undefined && { max: Infinity } || cache._options[0];
    cache._variables.set('options', options)
    cache._variables.set('lifoqueue', new LIFOQueue())
    this.policySet(cache);
    this.policyDel(cache);
    this.policyClear(cache);
  }

  policySet(cache) {
    cache._events.on('set', (key, value, result) => {
      const has = cache._variables.get('lifoqueue')._map.has(key);
      if(result && !cache._variables.get('lifoqueue')._map.has(key)){
        const max = cache._variables.get('options').max, size = cache._variables.get('lifoqueue').length;
        if(size >= max) {
          // delete the first element in the queue and delete the element in the cache
          const oldKey = cache._variables.get('lifoqueue').pop();
          if(oldKey !== key) cache.del(oldKey);
        }
        cache._variables.get('lifoqueue').push(key);
      } else {
        // noop, just set the variable in the cache
      }
    });
  }

  policyDel(cache) {
    cache._events.on('del', (key, result) => {
      if(result) {
        cache._variables.get('lifoqueue').remove(cache._variables.get('lifoqueue').find(key));
      }
    });
  }

  policyClear(cache) {
    cache._events.on('clear', (result) => {
      cache._variables.get('lifoqueue').clear();
    });
  }
}
