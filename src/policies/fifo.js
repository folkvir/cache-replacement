const CacheReplacementPolicy = require('../main.js');
const lmerge = require('lodash.merge');
const Cache = require('node-cache');
const FIFOQueue = require('fifo');
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
      debug('Calling method set with: ', key, value, result, "... Cache Options: ", cache._variables.get('options'));
      if(result && cache.has(key)){
        const max = cache._variables.get('options').max, size = cache._variables.get('fifoqueue').length;
        if(size >= max) {
          debug('Deleting the first key because max cache length');
          // delete the first element in the queue and delete the element in the cache

          const oldKey = cache._variables.get('fifoqueue').shift();

          if(oldKey !== key) cache.del(oldKey);
        }
        debug('Adding the key to the fifo queue');
        cache._variables.get('fifoqueue').push(key);
        debug(cache._variables.get('fifoqueue'));
      } else {
        // noop, just set the variable in the cache
        debug('Simple behavior');
      }
      debug('fifoqueue size: ', cache._variables.get('fifoqueue').length, ' IsInCache: ', cache.has(key))
    });
  }

  policyDel(cache) {
    cache._events.on('del', (key, result) => {
      debug('Calling method del with: ', key, result, "...");
      if(result && !cache.has(key)) {
        cache._variables.get('fifoqueue').bump(key);
        cache._variables.get('fifoqueue').pop();
      } else if(result && cache.has(key)){
        cache._variables.get('fifoqueue').bump(key);
        cache._variables.get('fifoqueue').pop();
        cache.del(key);
      }
    });
  }

  policyClear(cache) {
    cache._events.on('clear', (result) => {
      debug('Calling method clear with: ', result, "...");
      cache._variables.get('fifoqueue').clear();
    });
  }
}
