const FIFOQueue = require('../utils/map-double-linked-list.js');
const debug = require('debug')('fifo');

/**
 * This policy act as a FIFO queue, if a new element is added to the cache and the cache is full then the first element added is deleted.
 * See https://en.wikipedia.org/wiki/Cache_replacement_policies#First_In_First_Out_(FIFO)
 * => All policy events are emitted after the execution of the cache function
 */
module.exports = class FifoPolicy {
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
    cache._variables.set('fifoqueue', new FIFOQueue())
    this.policySet(cache);
    this.policyDel(cache);
    this.policyClear(cache);
  }

  policySet(cache) {
    cache._events.on('set', (key, value, result) => {
      if(result && !cache._variables.get('fifoqueue')._map.has(key)){
        const max = cache._variables.get('options').max, size = cache._variables.get('fifoqueue').length;
        if(size >= max) {
          const oldKey = cache._variables.get('fifoqueue').shift();
          if(oldKey !== key) cache.del(oldKey);
        }
        cache._variables.get('fifoqueue').push(key);
      } else {
        // noop, just set the variable in the cache
      }
    });
  }

  policyDel(cache) {
    cache._events.on('del', (key, result) => {
      if(result) {
        cache._variables.get('fifoqueue').remove(cache._variables.get('fifoqueue').find(key));
      }
    });
  }

  policyClear(cache) {
    cache._events.on('clear', (result) => {
      cache._variables.get('fifoqueue').clear();
    });
  }
}
