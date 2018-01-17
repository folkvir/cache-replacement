const TripleStore = require('./triplestore.js')
const BufferedIterator = require('asynciterator').BufferedIterator
const TransformIt = require('asynciterator').TransformIterator
const EventEmitter = require('events')
const debug = require('debug')('triplestoreiterator')
const Utils = require('../utils/n3parser.js')

module.exports = class RdfStoreWithIterator {
  constructor (options = {}) {
    this.options = options
    this.store = new TripleStore()
    this.keys = new Map()
    this.events = new EventEmitter()
    this.SIGNAL_DOWNLOADED = 'downloaded'
    this.SIGNAL_INSERTED = 'inserted'
  }

  /**
   * @private
   */
  _newKey (iterator) {
    return {
      full: false,
      exists: false,
      events: new EventEmitter(),
      length: 0,
      pending: iterator,
      properties: iterator.getProperties()
    }
  }

  has (pattern) {
    debug('has: ', pattern, typeof pattern)
    const stringKey = pattern
    pattern = JSON.parse(pattern)
    if (!Utils.isTriple(pattern)) {
      throw new Error("Need to be a triple: {subject: 'a' , predicate: 'x', object:'z' }")
    }
    return this.keys.has(stringKey).exists
  }

  get size () {
    return this.store.size
  }

  set (pattern, iterator) {
    try {
      const stringKey = pattern
      pattern = JSON.parse(pattern)
      if (!Utils.isTriple(pattern)) {
        throw new Error("Need to be a triple: {subject: 'a' , predicate: 'x', object:'z' }")
      }
      debug('Setting pattern: ', pattern.subject, pattern.predicate, pattern.object)
      if (!this.keys.has(stringKey)) this.keys.set(stringKey, this._newKey(iterator))
      const dataIterator = iterator.clone()
      dataIterator.on('data', (item) => {
        debug('Pending Iterator: ', item.toString())

        if (!Utils.isTriple(item)) {
          dataIterator.emit('error', new Error("Need to be a triple: {subject: 'a' , predicate: 'x', object:'z' } instead of: " + item.toString()))
        }

        const inserted = this.store.set(item)
        if (inserted) {
          debug('Pending Iterator: inserted item.')
          const k = this.keys.get(stringKey)
          k.exists = true
          k.events.emit(this.SIGNAL_INSERTED, item)
          k.length++
        }
      })
      dataIterator.on('end', (item) => {
        debug('Pending Iterator: closed and deleted')
        const k = this.keys.get(stringKey)
        k.pending = undefined
        k.full = true
        // emit on the events to signal that we download all the pattern
        k.events.emit(this.SIGNAL_DOWNLOADED)
        // emit on the cache to signal that we download a new pattern
        this.events.emit(this.SIGNAL_DOWNLOADED, stringKey)
      })
      return true
    } catch (e) {
      console.warn(e)
      return false
    }
  }

  get (pattern) {
    const stringKey = pattern
    pattern = JSON.parse(pattern)
    if (!Utils.isTriple(pattern)) {
      throw new Error("Need to be a triple: {subject: 'a' , predicate: 'x', object:'z' }")
    }
    debug('Getting pattern: ', pattern.subject, pattern.predicate, pattern.object)
    // if(!this.has(pattern)) this.keys.set(stringKey, this._newKey());
    const output = new TransformIt()
    const k = this.keys.get(stringKey)
    // if pending iterator
    if (k.pending && !k.full) {
      debug('Reading the iterator from pending iterator...')
      output.source = k.pending.clone()
    } else if (k.full) {
      debug('Reading the iterator from rdfstore...')
      const bi = new BufferedIterator()
      try {
        bi.setProperties(k.properties)
      } catch (e) {
        throw e
      }
      const self = this
      bi._read = function (count, done) {
        const resp = self.store.get(pattern)
        if (resp) {
          resp.triples.forEach(t => this._push(Utils.fromRdfstoreTriple2Triple(t)))
          this.close()
        }
        done()
      }
      output.source = bi
    }
    debug(output)
    return output
  }

  del (pattern) {
    if (this.store.del(JSON.parse(pattern))) {
      this.keys.delete(pattern)
      return true
    } else {
      return false
    }
  }
}
