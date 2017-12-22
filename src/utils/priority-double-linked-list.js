const FIFO = require('fifo');
const MapDoubleLinkedList = require('./map-double-linked-list.js')

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
    const n = super.push(value);
    this._map.set(value, {node: n, priority: 1});
    return n;
  }
  unshift(value){
    const n = super.unshift(value);
    this._map.set(value, {node: n, priority: 1});
    return n;
  }

  /**
   * Return the node at the right place in the double linked list
   * @param {[type]} node       [description]
   * @param {[type]} priority   [description]
   * @param {[type]} [nav=node] [description]
   */
  setPriority(node, priority, nav = node) {
    // initialize variables
    let prev = nav.prev, next = nav.next;

    // one element in the list
    if(prev === null && next === null) {
      return node;
    }
    // we are at the end do nothing
    if(next === null) {
      return node;
    }


    const nextPriority = this._map.get(next.value).priority;
    // check null of prev and next
    if(prev === null && priority < nextPriority) {
      // we are at the right place
      return node;
    } else  if (prev === null && priority >= nextPriority) {
      next.prev = null;
      return setPriority(node, priority, next);
    }


    const prevPriority = this._map.get(prev.value).priority;


    // move the node to the right place in the list
    if(priority < prevPriority) {
      // we go up in the list
      // before we link prev and next
      if(next === null) {
        prev.next = null
      }
      if(prev)
      return setPriority(node, priority, prev);
    } else if (priority > next) {
      return setPriority(node, priority, next);
    }
  }
}
