const NodeCache = require('node-cache');

module.exports = class NodeCacheWrapper extends NodeCache{
  constructor(options) {
    super(options);
  }

  clear() {
    this.flushAll();
  }

  size() {
    return this.getStats().keys;
  }

  has(key) {
    if(this.get(key)) return true
    return false
  }
}
