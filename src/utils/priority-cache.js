const FIFO = require('fifo')
/**
 * This data structure enable a way to have least/most frequently used element and last/most recently used element in a very fast manner.
 * O(1) for set, has, delete, get, leastFrequent, lastRecentlyUsed, mostFrequent, mostRecentlyUsed
 * Memory print:
 * * Map(key, { value, priority, node }), Type:  Map(any, { any, Number, Node })
 * * Map(priority, FIFO), Type: Map(Number, DoubleLinkedList<Node>)
 * Where a Node is storing its next and prev node and a value (here, the key)
 * Nodes in the first Map are referenced to nodes in the second one.
 * This data structure is slightly heavier than an actual Map and but have all operations in 0(1).
 */
module.exports = class PriorityBucket {
  constructor () {
    this.clear()
  }

  clear () {
    this._mostRecentlyUsedNode = undefined
    this._smallestPriority = undefined
    this._highestPriority = undefined
    this._nodes = new Map()
    this._priorityMap = new Map()
  }

  /**
   * Get the length of the datastructure
   * @return {Number}
   */
  get length () { return this._nodes.size }
  /**
   * Alias for .length
   * @return {Number}
   */
  get size () { return this.length }

  /**
   * Delete a entry in our cache
   * @param  {Object} key the key we want to delete
   * @return {Boolean}     return true when deleted otherwise false if the key does not exist
   */
  delete (key) {
    const has = this._nodes.has(key)
    if (!has) return false
    const node = this._node.get(key)
    this._priorityMap.get(node.priority).remove(node.node)
    return this._nodes.delete(key)
  }

  /**
   * Get the value associated to the the given key
   * @param  {Object} key
   * @return {Object}
   */
  get (key) {
    const val = this._nodes.get(key)
    if (!val) return undefined
    // increase its priority
    val.priority++
    // move the node to the next priority list
    val.node = this._moveNode(key, val.priority)
    // set this node as the most recently used
    this._mostRecentlyUsedNode = val.node
    // finally return the associated value
    return val.value
  }

  /**
   * Check if the key exists in our cache
   * @param  {Object}  key the key of the object we want to search
   * @return {Boolean}     [description]
   */
  has (key) {
    return this._nodes.has(key)
  }

  /**
   * Set a value for a specified associated key in the cache
   * @param {Object} key   the key of the value
   * @param {Object} value the associated value for the given key
   */
  set (key, value) {
    try {
      let priority
      let node
      let newNode = false
      // check if the node exists, otherwise create it
      if (!this.has(key)) {
        priority = 0
        newNode = true
      } else {
        priority = this._nodes.get(key).priority
      }
      // increase the priority
      priority++

      // if the bucket does not exists, create it
      if (!this._priorityMap.has(priority)) {
        this._priorityMap.set(priority, new FIFO())
      }

      if (newNode) {
        // push the new node
        node = this._priorityMap.get(priority).push(key)
      } else {
        node = this._moveNode(key, priority)
      }
      // check smallest and biggest priority
      this._setMinMaxPriority(priority)
      this._nodes.set(key, { priority, value, node })

      this._nodes.get(key).priority = priority
      // set this node as the most recently used
      this._mostRecentlyUsedNode = node
      return true
    } catch (e) {
      return e
    }
  }

  /**
   * @private
   * PRIVATE USE ONLY SINCE WE DO NOT CHECK IF THE BUCKET EXISTS HERE !
   * Description: Move the node to the next priority queue
   * @param  {Object} key
   * @param  {Object} key
   * @return {Node} retun the associated node
   */
  _moveNode (key, priority) {
    let node = this._nodes.get(key).node
    // delete the node from its current list
    this._priorityMap.get(priority - 1).remove(node)

    // check if the bucket is empty
    const lastPriority = priority - 1
    if (this._priorityMap.get(lastPriority).isEmpty()) {
      if (lastPriority === this._smallestPriority) this._smallestPriority = priority
    }

    // push the node to the end of the appropriated priority list
    node = this._priorityMap.get(priority).push(key)
    this._nodes.get(key).node = node
    return node
  }

  /**
   * In our data structure the last recently used is the first element in the first list with the smallest priority, or the leastFrequent
   * @return {Object} the value stored
   */
  get lastRecentlyUsed () {
    return this.leastFrequent
  }

  /**
   * The most recently used is the last item get or set
   * @return {Object} the value stored
   */
  get mostRecentlyUsed () {
    return { key: this._mostRecentlyUsedNode.value, value: this._nodes.get(this._mostRecentlyUsedNode.value).value }
  }

  /**
   * The least frequent is the item with the smallest priority and first in its priority list
   * @return {Object} the value stored
   */
  get leastFrequent () {
    return { key: this._priorityMap.get(this._smallestPriority).first(), value: this._nodes.get(this._priorityMap.get(this._smallestPriority).first()).value }
  }

  /**
   * The most frequent is the item with the biggest priority and last in its list
   * @return {Object} the value stored
   */
  get mostFrequent () {
    return { key: this._priorityMap.get(this._highestPriority).last(), value: this._nodes.get(this._priorityMap.get(this._highestPriority).last()).value }
  }

  /**
   * Get the priority of a specific data
   * @param  {Object} key
   * @return {Object}
   */
  getPriority (key) {
    const res = this._nodes.get(key)
    if (res) return res.priority
    return undefined
  }

  /**
   * @private
   * Set the smallest and biggest priority value
   * @param {Number} priority The new priority
   */
  _setMinMaxPriority (priority) {
    if (this.length === 0) {
      this._smallestPriority = priority
      this._highestPriority = priority
    } else {
      if (priority < this._smallestPriority) {
        this._smallestPriority = priority
      } else if (priority > this._highestPriority) {
        this._highestPriority = priority
      }
    }
  }

  /**
   * ForEach loop on all element
   * @param  {Function} fn callback
   * @return {void}
   */
  forEach (fn) {
    this._nodes.forEach(fn)
  }
}
