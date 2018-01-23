const FIFO = require('fifo')
const debug = require('debug')('weightedqueue')

/**
 * Data structure that enable the way to retreive the frequency of an item in 0(1) manner
 * Implemented with a DoubleLinkedList of DoubleLinkedList managing keys with their priorities and a Map for value access in O(1) (0(1) for get, has, delete methods)
 * eg: {{weight: 1, queue: {a, b, c}}, {wieght: 2, queue: {d, e, f}}, ...}
 * => last recently used and most recently used access in O(1)
 * => least frequently used and most frequently used access in 0(1)
 * In that way you can implement all LRU, MRU, LFU, MFU easily without relying on a specific lib
 * @type {[type]}
 */
module.exports = class WeightedQueue {
  constructor () {
    this.clear()
  }

  clear () {
    this._nodes = new Map()
    this._history = new FIFO()
    this._lastNode = undefined
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
   * Just an alias to .delete method
   */
  del (key) {
    return this.delete(key)
  }

  /**
   * Delete a entry in our cache
   * @param  {Object} key the key we want to delete
   * @return {Boolean}     return true when deleted otherwise false if the key does not exist
   */
  delete (key) {
    debug('Deleting key: ', key)
    if (!this.has(key)) return false
    const val = this._nodes.get(key)
    const weightedQueue = val.weightedQueue
    const element = val.element
    weightedQueue.value.queue.remove(element.node)
    if (weightedQueue.value.queue.length === 0) this._history.remove(weightedQueue)
    element.prev.link(element.next)
    if (this._lastNode.node.value === key) {
      this._lastNode = this._lastNode.prev
    }
    return this._nodes.delete(key)
  }

  /**
   * Get the value associated to the the given key
   * @param  {Object} key
   * @return {Object}
   */
  get (key) {
    debug('Getting:', key)
    if (!this._nodes.has(key)) return
    const val = this._nodes.get(key)
    const weightedQueue = val.weightedQueue
    const element = val.element
    let nextWeightedQueue = this._history.next(val.weightedQueue)
    weightedQueue.value.queue.remove(element.node)
    if (nextWeightedQueue) {
      debug('**Getting a new key: there is a next weighted queue', key)
      // delete the actual element and add it to the new weightedQueue
      if (nextWeightedQueue.value.weight !== (weightedQueue.value.weight + 1)) {
        debug('**Getting a new key: there is a next weighted queue but whithout the correct wieght...', key)
        // this is not the right weighted queue
        // // set the next to the new one
        nextWeightedQueue = this._createFIFONode(this._createWeightedFifo(weightedQueue.value.weight + 1), weightedQueue.prev, weightedQueue.next)
        // insert the new one after the old and before the next if one
        this._insertWeightedAfter(nextWeightedQueue, weightedQueue)
      }
    } else {
      debug('**Getting a new key: there is no next weighted queue', key)
      // create the new weighted queue
      nextWeightedQueue = this._history.push(this._createWeightedFifo(weightedQueue.value.weight + 1))
    }
    // if the old weightedQueue is empty, delete it
    if (weightedQueue.value.queue.length === 0) this._history.remove(weightedQueue)

    // set the weighted queue of the element
    val.weightedQueue = nextWeightedQueue
    element.node = nextWeightedQueue.value.queue.push(key)
    // this._nodes.set(key, this._createNode(key, element.value, element.weightedQueue, element.node, this._lastNode, null))
    // set next of the last node to the current one
    this._bumpHead(element)
    return this._nodes.get(key).value
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
    debug('Setting key: ', key)
    let val = this._nodes.get(key)
    // debug('**Old value: ', val)
    let node
    if (val === undefined) {
      debug('**Setting a new key: ', key)
      const firstWeightedQueue = this._history.node
      let weightedQueue
      if (firstWeightedQueue === null) {
        debug('**Setting a new key: ', key, ' - this is the first element.')
        weightedQueue = this._createWeightedFifo(1)
        node = weightedQueue.queue.push(key)
        weightedQueue = this._history.push(weightedQueue)
        val = this._createNode(key, value, weightedQueue, node, null, null)
        val.element.prev = val.element
        val.element.next = val.element
      } else if (firstWeightedQueue.value.weight === 1) {
        debug('**Setting a new key: ', key, ' - the weighted queue with weight=1 already exist.')
        node = firstWeightedQueue.value.queue.push(key)
        val = this._createNode(key, value, firstWeightedQueue, node, this._lastNode, this._lastNode.next)
      } else {
        debug('**Setting a new key: ', key, ' - the weighted queue with weight=1 does not already exist.')
        weightedQueue = this._createWeightedFifo(1)
        node = weightedQueue.queue.push(key)
        weightedQueue = this._history.unshift(weightedQueue)
        val = this._createNode(key, value, weightedQueue, node, this._lastNode, this._lastNode.next)
      }

      this._nodes.set(key, val)
    } else {
      // delete the element and set this element to its new value priority === 1
      this.delete(key)
      return this.set(key, value)
    }
    this._setLastNode(val.element)
    return true
  }

  /**
   * In our data structure the last recently used is the first element in the first list with the smallest priority, or the leastFrequent
   * @return {Object} the value stored
   */
  get lastRecentlyUsed () {
    const res = { key: undefined, value: undefined }
    if (!this._lastNode) return
    res.key = this._lastNode.next.node.value
    debug('LastRecentlyUSed: ', res.key)
    res.value = this._nodes.get(res.key).value
    return res
  }

  /**
   * The most recently used is the last item get or set
   * @return {Object} the value stored
   */
  get mostRecentlyUsed () {
    const res = { key: undefined, value: undefined }
    if (!this._lastNode) return
    res.key = this._lastNode.node.value
    debug('mostRecentlyUSed: ', res.key)
    res.value = this._nodes.get(res.key).value
    return res
  }

  /**
   * The least frequent is the item with the smallest priority and first in its priority list
   * @return {Object} the value stored
   */
  get leastFrequent () {
    const res = { key: undefined, value: undefined }
    if (this._history.length === 0 || this._history.first().queue === 0) return
    res.key = this._history.first().queue.first()
    debug('LeastFrequent: ', res.key)
    res.value = this._nodes.get(res.key).value
    return res
  }

  /**
   * The most frequent is the item with the biggest priority and last in its list
   * @return {Object} the value stored
   */
  get mostFrequent () {
    const res = { key: undefined, value: undefined }
    if (this._history.length === 0 || this._history.last().queue === 0) return
    res.key = this._history.last().queue.last()
    debug('MostFrequent: ', res.key)
    res.value = this._nodes.get(res.key).value
    return res
  }

  /**
   * Get the priority of a specific data
   * @param  {Object} key
   * @return {Object}
   */
  getPriority (key) {
    if (!this.has(key)) return false
    return this._nodes.get(key).weightedQueue.value.weight
  }

  /**
   * ForEach loop on all element
   * @param  {Function} fn callback
   * @return {void}
   */
  forEach (fn) {
    this._nodes.forEach(fn)
  }

  /**
   * forEach loop on all weighted bucket
   * @param  {Function} fn [description]
   * @return {[type]}      [description]
   */
  forEachWeight (fn) {
    this._history.forEach((elem) => {
      fn({ weight: elem.weight, array: elem.queue.toArray(), queue: elem.queue })
    })
  }

  /**
   * @private
   */
  _insertWeightedAfter (node, place) {
    const placeNext = place.next
    place.link(node)
    node.link(placeNext)
  }

  /**
   * @private
   */
  _createFIFONode (value, prev, next) {
    function Node (list, val) {
      this.prev = this.next = this
      this.value = val
      this.list = list
      this.link = function (next) {
        this.next = next
        next.prev = this
        return next
      }
    }
    const node = new Node(this._history, value)
    node.prev = prev
    node.next = next
    return node
  }

  /**
   * @private
   * Set the node as the tail
   */
  _bumpHead (element) {
    const prev = element.prev
    const next = element.next
    prev.link(next)
    element.link(this._lastNode.next)
    this._lastNode.link(element)
    this._lastNode = element
    debug('New last node: ', element.node.value, `Prev: ${element.prev.node.value}, Next: ${element.next.node.value}`)
    debug('New Head : ', element.next.node.value, `Prev: ${element.next.prev.node.value}, Next: ${element.next.next.node.value}`)
  }

  _setLastNode (element) {
    if (this._lastNode) {
      element.link(this._lastNode.next)
      this._lastNode.link(element)
      if (element.next.node.value === element.node.value) {
        element.next = this._lastNode
      }
    }
    this._lastNode = element
    debug('New last node: ', element.node.value, `Prev: ${element.prev.node.value}, Next: ${element.next.node.value}`)
    debug('New Head : ', element.next.node.value, `Prev: ${element.next.prev.node.value}, Next: ${element.next.next.node.value}`)
  }

  /**
   * @private
   */
  _createNode (key, value, weightedQueue, node, prev, next) {
    return { key, value, weightedQueue, element: { prev, next, node, link: function (next) { this.next = next; next.prev = this; return next } } }
  }

  /**
   * @private
   */
  _createWeightedFifo (weight) {
    debug('**Creation of a new weighted queue: weight=', weight)
    return { weight, queue: new FIFO() }
  }
}
