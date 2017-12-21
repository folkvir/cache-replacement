const FIFO = require('fifo');

module.exports = class MapDoubleLinkedList extends FIFO {
  constructor(options) {
    super(options);
    this._map = new Map();
  }

  // redefinition of insertions
  push(value) {
    const n = super.push(value);
    this._map.set(value, n);
    return n;
  }
  unshift(value){
    const n = super.unshift(value);
    this._map.set(value, n);
    return n;
  }

  // deletion (just redefine remove because pop and shift use this method)
  remove(node) {
    const value = super.remove(node);
    this._map.delete(value);
    return value;
  }

  /**
   * Return a node given its value
   * @param  {Object} value
   * @return {Node}
   */
  find(value) {
    return this._map.get(value);
  }

  removeAll(){
    this.clear();
  }

  clear() {
    super.clear();
    this._map = new Map();
  }
}
