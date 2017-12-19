const AbstractCache = require('./abstract-cache.js');
const lmerge = require('lodash.merge');
const EventEmitter = require('events');

module.exports = class NodeCache extends AbstractCache {
  constructor(cache, options = {}) {
    super();
    this._cache = new cache(options);
    this._cache.clear();
    this._cache.has('toto');
    this._events = new EventEmitter();
    console.log('Before redefinition Cache:', this._cache.clear, this._cache.has);
    console.log('Before redefinition This: ', this.clear, this.has);
    // define _cache as our parent
    console.log(this.prototype, this._cache.prototype);

    // console.log('Before setting prototype: ', this.has, this.clear);
    // Object.setPrototypeOf(this, this._cache);
    // console.log('After setting prototype Cache:', this._cache.clear, this._cache.has);
    // console.log('After setting prototype This: ', this.clear, this.has);
    // // lmerge(this, this._cache);
    // Object.assign(this.prototype, this._cache.prototype);
    // // console.log('Merging properties', this._cache.clear,' into this object...');
    // this.clear();
  }
}
