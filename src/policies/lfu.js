const LFUQueue = require('../utils/pmdll.js');
const NodeCache = require('../default-cache/memory-cache');
const debug = require('debug')('lfu');

module.exports = class LFUPolicy extends NodeCache{
  constructor(options = {max: Infinity}) {
    super(options);
    this.keys = new LFUQueue();
    this.max = options.max
  }

  get (key) {
    debug('Getting key:', key);
    const res = super.get(key);
    res && this.keys.set(key);
    return res;
  }

  set(key, value) {
    debug('Setting key:', key);
    const res = super.set(key, value);
    if(res && !this.keys.has(key)){
      const max = this.max, size = this.keys.length;
      if(size >= max) {
        const leastFrequent = this.keys.leastFrequent;
        if(leastFrequent !== key) this.del(leastFrequent);
      }
    }
    this.keys.set(key);
    return res;
  }

  clear() {
    debug('Clearing ...');
    this.keys.clear()
    return super.clear();
  }

  del(key) {
    debug('Deleting key: ', key);
    const del = super.del(key);
    del && this.keys.delete(key);
    return del;
  }
}
