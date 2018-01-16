const debug = require('debug');
const MapDoubleLinkedList = require('./map-double-linked-list.js');
/**
 * Author: GRALL ARNAUD, github: Folkvir, 
 * => All operations in O(1), has, get, del, set, leastFrequent, mostFrequent, delMostFrequent, delLeastFrequent, length, getPriority
 * => memory print: if keys are strings, the number is 2N * sizeof(string) + 2N * sizeof(int) + the_cost_of_each_value 
 * => priority up trigger: get, set
 * **** This data structure was created for low access time due to an intensive delete leastFrequent/mostFrequent for a LFU or MFU cache.
 * **** If you want to use a structure with a smaller memory print and a specific usage on least frequent
 * **** or most frequent just use a Min-Max Heap (https://en.wikipedia.org/wiki/Min-max_heap) 
 * Under MIT licence.
 */
module.exports = class PriorityQueue {
  constructor(options) {
    this.options = options;
    this._leastFrequent = undefined;
    this._mostFrequent = undefined;
    this._values = new Map();
    this._correspondingId = new Map();
    this._id = 0;
    this._bucket = new Map();

  }

  get length () {
    return this._values.size;
  }

  get leastFrequent () {
    return this._leastFrequent.value;
  }
  get mostFrequent () {
    return this._mostFrequent.value;
  }

  getPriority(key) {
    const res = this._values.get(key);
    return res?res.priority:undefined;
  }

  get(key) {
    const get = this._values.get(key);
    this._increaseFrequency(key);
    return get?get.value:undefined;
  }

  set(key, value) {
    try {
      let id;
      if(!this.has(key)) {
        id = this._id++;
        this._correspondingId.set(key, id);
        this._values.set(key, { id, value, priority: 1 });
      } else {
        this._values.get(key).value = value;
      }
      this._increaseFrequency(key);  
      return true;
    } catch (error) {
      return error;
    }
  }

  del(key) {
    const res = this._values.delete(key) && this._correspondingId.delete(key);
    return res && this._deleteBucket(key);
  }

  has(key) {
    return this._values.has(key);
  } 

  _increaseFrequency(key) {
    try {
      const elem = this._values.get(key);
      // increase the priority before all
      const priority = elem.priority + 1;
      this._values.get(key).priority = priority;
      if(!this._bucket.has(priority)){
        this._bucket.set(priority, {
          smallerPriority: undefined,
          biggerPriority: undefined,
          values: new MapDoubleLinkedList()
        });
      }
      // special case 
      if(this.length === 1){
        // only one key
        this._leastFrequent = this._values.get(key);
        this._mostFrequent = this._values.get(key);
      } else if(this.length === 2){
        // two key, most become the least and least become the most
        this._leastFrequent = this._mostFrequent;
        this._mostFrequent = this._values.get(key);
      } else {
        // in all other case, if the priority is upper than the mostFrequent, set the new most frequent 
        if(this.getPriority(key) >= this.mostFrequent.priority){
          this._mostFrequent = this._values.get(key);
        } 
        // if the elem is the leastFrequent
        if(elem.id === this._leastFrequent.id) {
          this._leastFrequent = this._bucket.getLastRecentlyUsed(elem.priority);
        }
        
      }
      return true;  
    } catch (error) {
      return false;
    }
  }


  _addBucket(key, priority){

  }

  _deleteBucket(key) {
    return true;
  }

  /**
   * This function will
   */
  _flatten() {

  }
}

class PriorityBucket {
  constructor() {
    this._smallestPriority = undefined;
    this._highestPriority = undefined;
    this._values = new Map();  
  }

  delete(priority, id) {
    const has = this._values.has(priority);
    if(has) {
      if(has.values.has(id)) {
        return has.delete(id);
      } else {
        return false;
      }
    } else  {
      return false;
    }
  }

  get(priority, id) {
    return this._values.get(priority).find(key);
  }

  has(priority, id){
    return this._values.has(priority);
  }

  set(priority, id) {
    // if the bucket does not exists, create it
    if(!this._values.has(priority)) {
      this._values.set(priority, new FIFO());
    }
    // if the node does not exists, add it to the appropriate queue
    const find = this.get(priority).find(key);
    if(this.get(priority).
    this._values.get(priority).push()
    this._values.get(priority).values.bump()
  }

  get lastRecentlyUsed() {
    
  }

  get mostRecentlyUsed() {

  }

}