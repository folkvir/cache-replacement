const MFUQueue = require('../utils/pmdll.js');
const NodeCache = require('../default-cache/memory-cache');
const debug = require('debug')('mfu');

module.exports = class MFUPolicy extends NodeCache{
  constructor(options = {max: Infinity}) {
    super(options);
    this.keys = new MFUQueue();
    this.max = options.max
  }

  get(key) {
    const res = super.get(key);
    res && this.keys.set(key);
    return res;
  }

  set(key, value) {
    const res = super.set(key, value);
    if(res && !this.keys.has(key)){
      const max = this.max, size = this.keys.length;
      if(size >= max) {
        const mostFrequent = this.keys.mostFrequent;
        if(mostFrequent != key) this.del(mostFrequent);
      }
    }
    this.keys.set(key);
    return res;
  }

  clear() {
    this.keys.clear()
    return super.clear();
  }

  del(key) {
    const del = super.del(key);
    del && this.keys.delete(key);
    return del;
  }
}
