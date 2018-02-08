const FIFO = require('fifo')
const debug = require('debug')('weightedqueue')
const assert = require('assert')
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
    this._recency = new FIFO()
    this._hits = 0
    this._misses = 0
  }

  keys () {
    return this._getArrayFromIt(this._nodes.keys())
  }

  values () {
    return this._getArrayFromIt(this._nodes.values())
  }

  misses () {
    return this._misses
  }

  hits () {
    return this._hits
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
  size () { return this.length }

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
    if (!this.has(key)) return false
    const val = this._nodes.get(key)
    val.weight.queue.value.queue.remove(val.weight.node)
    if (val.weight.queue.value.queue.length === 0) {
      this._history.remove(val.weight.queue)
    }
    this._recency.remove(val.recency)
    const res = this._nodes.delete(key)
    if (this.size() === 0) this.clear()
    return res
  }

  /**
   * Get the value associated to the the given key
   * @param  {Object} key
   * @return {Object}
   */
  get (key) {
    if (!this._nodes.has(key)) {
      this._misses++
      return
    }
    this._hits++
    const val = this._nodes.get(key)
    let nextWeightedQueue = this._history.next(val.weight.queue)
    val.weight.queue.value.queue.remove(val.weight.node)
    if (nextWeightedQueue !== null) {
      if (nextWeightedQueue.value.weight !== (val.weight.queue.value.weight + 1)) {
        nextWeightedQueue = this._createFIFONode(this._createWeightedFifo(val.weight.queue.value.weight + 1), val.weight.queue.prev, val.weight.queue.next)
        this._insertWeightedAfter(nextWeightedQueue, val.weight.queue)
      }
    } else {
      nextWeightedQueue = this._history.push(this._createWeightedFifo(val.weight.queue.value.weight + 1))
    }
    if (val.weight.queue.value.queue.length === 0) this._history.remove(val.weight.queue)
    if (nextWeightedQueue.value.weight !== val.weight.queue.value.weight + 1) throw new Error('impossible, please report !')
    val.weight.queue = nextWeightedQueue
    val.weight.node = nextWeightedQueue.value.queue.push(key)
    this._recency.bump(val.recency)
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
    let val = this._nodes.get(key)
    if (val === undefined) {
      let nodeWeightedQueue, weightedQueue, nodeRecency
      const firstWeightedQueue = this._history.node
      if (firstWeightedQueue === null) {
        weightedQueue = this._createWeightedFifo(1)
        nodeWeightedQueue = weightedQueue.queue.push(key)
        weightedQueue = this._history.push(weightedQueue)
        nodeRecency = this._recency.push(key)
      } else if (firstWeightedQueue.value.weight === 1) {
        weightedQueue = firstWeightedQueue
        nodeWeightedQueue = firstWeightedQueue.value.queue.push(key)
        nodeRecency = this._recency.push(key)
      } else {
        weightedQueue = this._createWeightedFifo(1)
        nodeWeightedQueue = weightedQueue.queue.push(key)
        weightedQueue = this._history.unshift(weightedQueue)
        nodeRecency = this._recency.push(key)
      }
      this._nodes.set(key, this._createNode(key, value, weightedQueue, nodeWeightedQueue, nodeRecency))
      return true
    } else {
      this.delete(key)
      return this.set(key, value)
    }
  }

  /**
   * In our data structure the last recently used is the first element in the first list with the smallest priority, or the leastFrequent
   * @return {Object} the value stored
   */
  get lastRecentlyUsed () {
    const res = { key: undefined, value: undefined }
    if (this._recency.length === 0) return
    res.key = this._recency.first()
    res.value = this._nodes.get(res.key)
    if (!res.value) return
    res.value = res.value.value
    return res
  }

  /**
   * The most recently used is the last item get or set
   * @return {Object} the value stored
   */
  get mostRecentlyUsed () {
    const res = { key: undefined, value: undefined }
    if (this._recency.length === 0) return
    res.key = this._recency.last()
    res.value = this._nodes.get(res.key)
    if (!res.value) return
    res.value = res.value.value
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
    res.value = this._nodes.get(res.key)
    if (!res.value) return
    res.value = res.value.value
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
    res.value = this._nodes.get(res.key)
    if (!res.value) return
    res.value = res.value.value
    return res
  }

  /**
   * Get the priority of a specific data
   * @param  {Object} key
   * @return {Object}
   */
  getPriority (key) {
    if (!this.has(key)) return false
    return this._nodes.get(key).weight.queue.value.weight
  }

  /**
   * ForEach loop on all element
   * @param  {Function} fn callback
   * @return {void}
   */
  forEach (fn) {
    this._nodes.forEach((v, k) => { fn(k, v.value) })
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
   * forEach loop on the recency queue, from the LRU to the MRU
   * @param  {Function} fn [description]
   * @return {[type]}      [description]
   */
  forEachRecency (fn) {
    this._recency.forEach(n => {
      fn({ key: n, value: this._nodes.get(n).value, weight: this._nodes.get(n).weight.queue.value.weight })
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
    this._history.length++
    node.prev = prev
    node.next = next
    return node
  }

  /**
   * @private
   */
  _createNode (key, value, weightedQueue, nodeWeightedQueue, nodeRecency) {
    return { key, value, weight: {node: nodeWeightedQueue, queue: weightedQueue}, recency: nodeRecency }
  }

  /**
   * @private
   */
  _createWeightedFifo (weight) {
    return { weight, queue: new FIFO() }
  }

  /**
   * @private
   */
  _getArrayFromIt (iterator) {
    let elem = iterator.next().value
    let res = []
    while (elem !== null && elem !== undefined) {
      res.push(elem)
      elem = iterator.next().value
    }
    return res
  }
}
