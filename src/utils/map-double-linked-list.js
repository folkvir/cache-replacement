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
  pop(key) {
    const node = super.pop(key);
    this._map.delete(node.value)
    return node;
  }

  shift(key) {
    const node = super.shift(key);
    this._map.delete(node.value);
    return node;
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
