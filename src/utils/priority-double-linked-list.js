const FIFO = require('fifo');
const MapDoubleLinkedList = require('./map-double-linked-list.js')
const debug = require('debug')('pmdll');

/**
 * Map + Double linked list with priority
 * All element with more priority are in the tail of the double linked list
 * @type {[type]}
 */
module.exports = class PriorityDoubleLinkedList extends MapDoubleLinkedList {
  constructor(options) {
    super(options);
  }

  // redefinition of insertions
  push(value) {
    debug('push: ', value);
    const n = super.push(value);
    this._map.set(value, {node: n, priority: 1});
    return n;
  }
  unshift(value){
    debug('unshift: ', value);
    const n = super.unshift(value);
    this._map.set(value, {node: n, priority: 1});
    return n;
  }

  /**
   * Return the priority for the node given by its value
   * @param {*} key 
   */
  _getPriority(key) {
    const node = this.find(key);
    if(node) return node.priority;
    return undefined;
  }

  /**
   * Set the priority by its value, if the node exists, otherwise push the value
   * @param {*} value 
   * @return {Node} 
   */
  _setOrPush(value, number = 1) {
    const entry = this._map.get(value);
    if(entry){
      entry.priority = entry.priority + number;
      return this.setPriority(entry.node, entry.priority);
    } else {
      const node = this.push(value);
      return this.setPriority(node, this._map.get(node.value).priority);
    }
  }

  set(value, number) {
    return this._setOrShift(value, number);
  }

  /**
   * Set the priority by its value, if the node exists, otherwise push the value
   * @param {*} value 
   * @return {Node} 
   */
  _setOrShift(value, number = 1) {
    const entry = this._map.get(value);
    if(entry){
      entry.priority = entry.priority + number;
      return this.setPriority(entry.node, entry.priority);
    } else {
      const node = this.unshift(value);
      return this.setPriority(node, this._map.get(node.value).priority);
    }
  }

  print() {
    this.forEach( (v, n) => {
      debug('Node Value: ', v);
      debug('Node Prev: ', n.prev.value);
      debug('Node Next: ', n.next.value);
    })
  }

  addAfter(prev, node) {
    this.length++;
    node.link(prev.next);
    prev.link(node);
    if(!node.list) node.list = this.list;
    return node;
  }

  /**
   * Return the node at the right place in the double linked list
   * @param {[type]} node       [description]
   * @param {[type]} priority   [description]
   * @param {[type]} [nav=node] [description]
   */
  setPriority(node, priority) {
    debug('setpriority: ', priority);
    // initialize variables
    let prev = this.prev(node), next = this.next(node);
    console.log(node.value, prev?prev.value:null, next?next.value:null);
    // one element in the list
    let place = null;
    if(prev === null && next === null) {
      debug('setpriority: prev and next are null');
      return node;
    }  else if(next === null) {
      debug('Next === null');
      const prevPriority = this._map.get(prev.value).priority;
      if(priority < prevPriority) {
        debug('Next === null && prio < prevPrio');
        // we go up in the list
        this.remove(node);
        place = this.goUp(prev, priority);
      } else {
        debug('Next === null && prio >= prevPrio');
        // we are at the right place, no need to move
        return node;
      }
    } else {
      const nextPriority = this._map.get(next.value).priority;
      if(prev === null && priority < nextPriority) {
        debug('prev === null && prio < nextPrio');
        // we are at the right place, no need to move
        return node;
      } else if (prev === null && priority >= nextPriority) {
        debug('prev === null && prio >= nextPrio');
        this.remove(node);
        place = this.goDown(next, priority);
      }  else {
        // prev and next are available
        debug('next !== null ');
        const prevPriority = this._map.get(prev.value).priority;
        if(priority < prevPriority) {
          place = this.goUp(prev);
        } else if(priority >= nextPriority) {
          place = this.goDown(next);
        }
      }
    }

    return this.addAfter(place, node);
  }

  goDown(node, priority) {
    let next = this.next(node);
    if(next === null) {
      debug('goup: [*] stop cause we are at the end', node.value)
      return node;
    }
    const prio = this._map.get(next.value).priority;
    if (priority >= prio) {
      debug('goup: continue to search...')
      return this.goDown(next, priority);
    } else {
      debug('goup: [*] stop cause we found a place to be.');
      return node;
    }
  }

  goUp(node, priority) {
    let prev = this.prev(node);
    if(prev === null) {
      debug('goup: [*] stop cause we are at the beginning.', node.value);
      return node;
    }
    const prio = this._map.get(prev.value).priority;
    if (priority === prio) {
      debug('goup: [*] stop cause we found the place to be.');
      return node;
    }
    debug('godown: continue to search...');
    return this.goUp(prev, priority);
  }

  /**
   * Return a node given its value
   * @param  {Object} value
   * @return {Node}
   */
  find(value) {
    const val = this._map.get(value);
    if(val) {
      return val.node;
    } else {
      return undefined;
    }
  }
}
