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

  // deletion
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

  delete(key) {
    const node = this.find(key);
    if(node) {
      this.remove(node);
      this._map.delete(node.value);
      return true;
    } else {
      return false;
    }
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
