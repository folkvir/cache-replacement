

const LRUQueue = require('../utils/map-double-linked-list');
const NodeCache = require('../default-cache/memory-cache');
const debug = require('debug')('lru');

module.exports = class LRUPolicy extends NodeCache{
  constructor(options = {max: Infinity}) {
    super(options);
    this.keys = new LRUQueue();
    this.max = options.max
  }

  get(key) {
    const res = super.get(key);
    if(res) {
      const node = this.keys.find(key);
      this.keys.bump(node);
    }
    return res;
  }

  set(key, value) {
    const res = super.set(key, value);
    if(res && !this.keys._map.has(key)){
      const max = this.max, size = this.keys.length;
      if(size >= max) {
        const oldKey = this.keys.shift();
        if(oldKey !== key) this.del(oldKey);
      }
      this.keys.push(key);
    } else {
      const node = this.keys.find(key);
      this.keys.bump(node);
    }
    return res;
  }

  clear() {
    this.keys.clear()
    return super.clear();
  }

  del(key) {
    const del = super.del(key);
    del && this.keys.remove(this.keys.find(key));
    return del;
  }
}
