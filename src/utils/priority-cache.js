const FIFO = require('fifo')

/**
 * Data structure that enable the way to retreive the frequency of an item in 0(1) manner
 * Implemented with a DoubleLinkedList of frequency DoubleLinkedLists managing keys and a Map for value (0(1), get, has, delete)
 * => last recently used and most recently used access in O(1)
 * => least frequently used and most frequently used in 0(1)*
 * In that way you can implement all LRU, MRU, LFU, MFU easily without relying on a specific lib
 * @type {[type]}
 */
module.exports = class LFULRU {
  constructor () {
    this.clear()
  }

  clear () {
    this._nodes = new Map()
    this._history = new FIFO()
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

  }

  /**
   * Get the value associated to the the given key
   * @param  {Object} key
   * @return {Object}
   */
  get (key) {

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

  }

  /**
   * In our data structure the last recently used is the first element in the first list with the smallest priority, or the leastFrequent
   * @return {Object} the value stored
   */
  get lastRecentlyUsed () {

  }

  /**
   * The most recently used is the last item get or set
   * @return {Object} the value stored
   */
  get mostRecentlyUsed () {

  }

  /**
   * The least frequent is the item with the smallest priority and first in its priority list
   * @return {Object} the value stored
   */
  get leastFrequent () {

  }

  /**
   * The most frequent is the item with the biggest priority and last in its list
   * @return {Object} the value stored
   */
  get mostFrequent () {

  }

  /**
   * Get the priority of a specific data
   * @param  {Object} key
   * @return {Object}
   */
  getPriority (key) {

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
