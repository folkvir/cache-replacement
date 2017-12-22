const LIFOQueue = require('../utils/map-double-linked-list.js');
const debug = require('debug')('lifo');

/**
 * This policy act as a FIFO queue, if a new element is added to the cache and the cache is full then the last element added is deleted.
 * See https://en.wikipedia.org/wiki/Cache_replacement_policies#Last_In_First_Out_(LIFO)
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
    cache._variables.set('lifoqueue', new LIFOQueue())
    this.policySet(cache);
    this.policyDel(cache);
    this.policyClear(cache);
  }

  policySet(cache) {
    cache._events.on('set', (key, value, result) => {
      debug('Calling method set with: ', key, value, result, "... Cache Options: ", cache._variables.get('options'));
      const has = cache._variables.get('lifoqueue')._map.has(key);
      if(result && !cache._variables.get('lifoqueue')._map.has(key)){
        const max = cache._variables.get('options').max, size = cache._variables.get('lifoqueue').length;
        if(size >= max) {
          debug('Deleting the last key because max cache length');
          // delete the first element in the queue and delete the element in the cache

          const oldKey = cache._variables.get('lifoqueue').pop();

          if(oldKey !== key) cache.del(oldKey);
        }
        debug('Adding the key to the lifo queue');
        cache._variables.get('lifoqueue').push(key);
      } else {
        // noop, just set the variable in the cache
        debug('Simple behavior');
      }
      debug('lifoqueue size: ', cache._variables.get('lifoqueue').length);
    });
  }

  policyDel(cache) {
    cache._events.on('del', (key, result) => {
      debug('Calling method del with: ', key, result, "...");
      if(result) {
        cache._variables.get('lifoqueue').remove(cache._variables.get('lifoqueue').find(key));
      }
    });
  }

  policyClear(cache) {
    cache._events.on('clear', (result) => {
      debug('Calling method clear with: ', result, "...");
      cache._variables.get('lifoqueue').clear();
    });
  }
}
