const CacheReplacementPolicy = require('../main.js');
const lmerge = require('lodash.merge');
const Cache = require('node-cache');
const FIFOList = require('fifo');

/**
 * https://en.wikipedia.org/wiki/Cache_replacement_policies#First_In_First_Out_(FIFO)
 */
// module.exports = class FIFO {
//   constructor(cache) {
//     this._options = lmerge({
//       cache: Cache,
//       methods: ['get', 'set', 'del'],
//       max: Infinity
//     }, options);
//
//     this._keyCache = new FIFOList();
//     this.size = 0;
//     this._cache = new CacheReplacementPolicy(this._options.cache, {}, { methods: this._options.methods });
//
//     this._cache.definePolicy('set', (key, value, res) => {
//       console.log('Node-cache stats: ', this._cache.getStats())
//       console.log(`set method was triggered: `, key, value, res);
//       if (this.size >= this._options.max ) {
//         this._cache.del(this._keyCache.shift())
//         this.size--;
//       } else {
//         this._keyCache.push(key);
//         this.size++;
//       }
//     });
//
//     this._cache.definePolicy('del', (key, res) => {
//       console.log(`del method was triggered: `, key, res?true:false);
//       if(res) this.size--;
//     });
//
//     lmerge(this, this._cache);
//   }
// }


module.exports = class FifoPolicy {
  constructor(options) {
    this._methods = ['set', 'del', 'clear'];
  }
  get methods () {
    return this._methods;
  }

  apply(cache) {
    policySet(cache);
    policyDel(cache);
    policyClear(cache);
  }
}
