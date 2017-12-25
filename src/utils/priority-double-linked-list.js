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
module.exports = class PriorityDoubleLinkedList extends MapDoubleLinkedList {
  constructor(options) {
    super(options);
  }

  // redefinition of insertions
  push(value, priority = 1) {
    debug('push: ', value);
    const n = super.push(value);
    this._map.set(value, {node: n, priority});
    return n;
  }
  unshift(value, priority = 1){
    debug('unshift: ', value);
    const n = super.unshift(value);
    this._map.set(value, {node: n, priority});
    return n;
  }

  /**
   * Return the priority for the node given by its value
   * @param {*} key
   */
  _getPriority(key) {
    const node = this._map.get(key);
    if(node) return node.priority;
    return undefined;
  }

	remove(node) {
		debug('remove node:', node.value);
		this._map.delete(node.value);
		return super.remove(node);
	}
  /**
   * Set the priority by its value, if the node exists, otherwise push the value
   * @param {*} value
   * @return {Node}
   */
  set(value, number = 1) {
    const entry = this._map.get(value);
		entry && debug('_setorshift: ', `val: ${entry.node.value}, priority: ${entry.priority}, first: ${this.first()}, last: ${this.last()}`);
		!entry && debug('_setorshift: entry does not exist');
    if(entry){
      entry.priority = entry.priority + number;
			const pfirst = this._map.get(this.first()).priority,
				plast = this._map.get(this.last()).priority,
				our = entry.priority;
			let cond = plast === pfirst && pfirst === our;
			debug('Entry exists and priorities are: ', ` last: ${plast}, first: ${pfirst}, our: ${our}`, );
			if(cond) {
				debug('Last and first have the same priority, just place at the end. (remove && push)');
				// means that most frequest as the same priority than you, just add as the tail
				this.remove(entry.node);
				entry.node = this.push(entry.node.value, entry.priority);
				return entry.node;
			} else {
				debug('Entry exists and priorities are diffrent... go to setpriority(...)')
				return this.setPriority(entry.node, entry.priority);
			}
    } else {
			if(this._map.size === 0)  return this.push(value);
			const pfirst = this._map.get(this.first()).priority,
				plast = this._map.get(this.last()).priority,
				our = 1;
			let cond = plast === pfirst && pfirst === our;
			debug('Entry doest not exist and priorities are: ', ` last: ${plast}, first: ${pfirst}, our: ${our}`, );

			if(cond) {
				debug('Last and first have the same priority, just place at the end. (push)');
				const node = this.push(value);
				return node;
			} else {
				const node = this.unshift(value);
				return this.setPriority(node, this._map.get(node.value).priority);
			}
    }
  }

  addAfter(prev, node) {
		debug('addafter: ', prev.value, node.value)
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
    // initialize variables
    let prev = this.prev(node), next = this.next(node);
		debug('setpriority: ', priority, node.value, prev?prev.value:null, next?next.value:null);
    // one element in the list
    let place = null;
    if(prev === null && next === null) {
      debug('setpriority: prev and next are null');
      return node;
    }

		if(next === null) {
      debug('Next === null');
      const prevPriority = this._map.get(prev.value).priority;
      if(priority < prevPriority) {
        debug('Next === null && prio < prevPrio');
        // we go up in the list
				place = this.goUp(node, priority);
        this.remove(node);
      } else {
        debug('Next === null && prio >= prevPrio', priority, prevPriority);
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
				place = this.goDown(node, priority);
        this.remove(node);
      }  else {
        // prev and next are available
        const prevPriority = this._map.get(prev.value).priority;
				debug('next !== null && prev !== null', `prevPriority: ${prevPriority}`, `nextPriority: ${nextPriority}, ourPriority: ${priority}`);
        if(priority < prevPriority) {
          place = this.goUp(prev);
        } else if(priority >= nextPriority) {
          place = this.goDown(next);
        }

				this.print();

				this.remove(node);

				this.print();
      }
    }
    return this.addAfter(place, node);
  }

	print(){
		console.log('=> list:')
		this.forEach((v,n) => {
			console.log('* ', v);
		})
		console.log('=> Map:')
		this._map.forEach((v,n) => {
			console.log('* ', v.node.value);
		})
	}

  goDown(node, priority) {
		debug('godown: ', node.value, node.prev.value, node.next.value);
    let next = this.next(node);
    if(next === null) {
      debug('godown: [*] stop cause we are at the end', node.value)
      return node;
    }
    const prio = this._map.get(next.value).priority;
    if (priority >= prio) {
      debug('godown: continue to search...')
      return this.goDown(next, priority);
    } else {
      debug('godown: [*] stop cause we found a place to be.');
      return node;
    }
  }

  goUp(node, priority) {
		debug('goup: ', node.value, node.prev.value, node.next.value);
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
