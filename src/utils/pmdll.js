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
 * - Set: worst case = O(n), best case = O(1), exceptions (as all same priorities = insert at the end, etc...) are O(1)
 * - Delete: O(1)
 * - Find: O(1)
 * -
 * @type {[type]}
 */
module.exports = class PriorityDoubleLinkedList {
    constructor() {
        this.queue = new MapDoubleLinkedList();
    }

    get length () {
        return this.size();
    }

    // redefinition of insertions
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
            return this._push(value);
        } else {
            const pfirst = this.first();
            const plast= this.last();
            const pour = this.getPriority(value);
            // find the place to be.
            let node;
            if(!this.has(value)) {
                node = this._unshift(value);
            } else {
                // increase the priority
                this.increase(value);
            }

            
        }
    }

    increase (value) {
        const entry = this.queue._map.get(value);
        debug('Old priority: ', entry.priority);
        if(entry) {
            entry.priority++;
            debug('New priority: ', this.queue._map.get(value).priority);
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
            return this.queue.remove(node)?true:false;
        } else {
            return false;
        }
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
