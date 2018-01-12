const FIFO = require('fifo');
const MapDoubleLinkedList = require('./map-double-linked-list.js')
const debug = require('debug')('pmdll');

/**
 * Map + Double linked list with priority
 * All element with more priority are in the tail of the double linked list
 * 1) all element are added to the beginning
 * 2) all element are replaced according to their priority after being added
 * 3) the first element (head of the list) is the least frequent element
 * 4) the last element (tail of the list) is the most frequent element
 * Complexity:
 * - Set: worst case = O(log n), best case = O(1), exceptions (as all same priorities = insert at the end, etc...) are O(1)
 * - Delete: O(1)
 * - Get: O(1)
 */
module.exports = class PriorityDoubleLinkedList {
    constructor() {
        this.queue = new MapDoubleLinkedList();
    }

    get length () {
        return this.size();
    }

    get leastFrequent () {
        const lf = this.first();
        debug('leastfrequent: ', lf);
        return lf;
    }
    get mostFrequent () {
        const mf = this.last();
        debug('mostfrequent: ', mf);
        return mf;
    }

    _push(value, priority = 1) {
        debug('push: ', value);
        const n = this.queue.push(value);
        this.queue._map.set(value, {node: n, priority});
        return n;
    }

    _unshift(value, priority = 1){
        debug('unshift: ', value);
        const n = this.queue.unshift(value);
        this.queue._map.set(value, {node: n, priority});
        return n;
    }

    /**
     * Set the priority by its value, if the node exists, otherwise push the value
     * @param {*} value
     * @return {Node}
     */
    set(value) {
        if(this.size() === 0) {
            // debug('No element in the queue.');
            return this._push(value);
        } else {
            const pfirst = this.first();
            const plast= this.last();
            const pour = this.getPriority(value);
            // find the place to be.
            let node;
            if(!this.has(value)) {
                // debug('The element does not exist, just create it.')
                node = this._unshift(value);
            } else {
                // debug('The element already exist, increase the priority and replace the node');
                // increase the priority
                this.increase(value);
                node = this.get(value);
            }

            // firstly, remove the node;
            let place;
            try {
              place = this._goDown(node, this.getPriority(value));
            } catch (e) {
              debug(this.length, value, node.value, node.next.value);

              throw e;
            }

            //debug('We find a place: ', place.value, ` Prev: ${place.prev.value} Next: ${place.next.value}`)

            return this.moveafter(node, place);
        }
    }

    next(node) {
        // // debug(`there is ${this.length} element(s) in the queue, head:`, this.queue.node.value)
        // if (!node) {
        //     // debug('next: node is undefined');
        //     return this.queue.node
        // } else {
        //     if(node.next === this.queue.node) {
        //         // debug('next; next does nt exists, return null.')
        //         return null;
        //     } else {
        //         // debug('next: next is available, return next.')
        //         return node.next;
        //     }
        // }
      return this.queue.next(node);
    }

    /**
     * Move the node 'node' after the node 'after'
     * @param {*} node
     * @param {*} after
     */
    moveafter(node, after) {
        if(node === after) {
            // debug('moveafter: the chosen node is the same node.')
            return node;
        } else if(this.queue.prev(node) === null) {
            // debug('moveafter: we are the first element');
            // means we are the first elem
            if(this.queue.next(node) === null) {
                // debug('moveafter: we are the first element and the only one element');
                // means this element is the only one (pren === next === null)
                return node;
            } else {
                // debug('moveafter: we are the first element and at least 2 element in the list');
                this.queue.remove(node);
                this.queue.length++;
                if(this.queue.next(after) === null) {
                    node.link(this.queue.node);
                }
                node.next = after.next;
                after.next = node;
                node.prev = after;
                node.list = this.queue;
                return node;
            }
        } else {
            // debug('prev is not null')
            this.queue.remove(node);
            this.queue.length++;
            if(this.queue.next(after) === null) {
                node.link(this.queue.node);
            }
            node.next = after.next;
            after.next = node;
            node.prev = after;
            node.list = this.queue;
            return node;
        }
    }

    _goDown(node, priority) {
      // if(!node) throw new Error('The node need to be a node. Not undefined !')
      let next = this.next(node);
	    // debug('godown: ', node.value, node.prev.value, node.next.value );
      if(!next || next === null) {
          debug('godown: [*] stop cause we are at the end', node.value, next)
          return node;
      } else {
        const prio = this.getPriority(next.value);
        if(!node || next === null || node.next === null) throw new Error('The node need to be a node. Not undefined !')
        if (next && priority >= prio) {
          // debug('problem: ', node.value, node.prev.value, node.next.value );
          // debug('godown: continue to search...')
          // process.exit(0)
          try {
            debug('godown: ', next.value, typeof next.value );
            return this._goDown(next, priority);
          } catch (e) {
            throw e;
          }
        } else {
          debug('godown: [*] stop cause we found a place to be.');
          return node;
        }
      }
    }

    increase (value) {
        const entry = this.queue._map.get(value);
        //debug('Old priority: ', entry.priority);
        if(entry) {
            entry.priority++;
            //debug('New priority: ', this.queue._map.get(value).priority);
        }
    }

    size () {
        return this.queue._map.size;
    }

    has(value) {
        return this.get(value)?true:false;
    }

    get(value) {
        const entry = this.queue._map.get(value);
        return entry?entry.node:undefined;
    }

    getPriority(value) {
        const entry = this.queue._map.get(value);
        return entry?entry.priority:undefined;
    }

    delete(value) {
        const node = this.get(value);
        if(node) {
            this.queue._map.delete(value);
            return this.queue.remove(node)?true:false;
        } else {
            return false;
        }
    }

    clear(){
        this.queue.clear();
    }

    first () {
        return this.queue.first();
    }
    last() {
        return this.queue.last();
    }
    forEach(...args) {
        this.queue.forEach(...args);
    }
    print() {
        this.forEach( (v, n) => {
            console.log('node: ', v);
        });
    }
}
