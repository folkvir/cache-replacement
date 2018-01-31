const PriorityCache = require('../../src/utils/priority-cache.js')
const assert = require('assert')

const setm = (arr, queue) => {
  arr.forEach(a => {
    if (!queue.has(a)) {
      queue.set(a)
    } else {
      queue.get(a)
    }
  })
}
function getHistorySize(list) {
  let a = 0
  list.forEachWeight(e => {
    a++
  })
  return a
}

describe('Priority Cache', function () {
  describe('Creation of the list', function () {
    it('should return no error during the creation of the list', function () {
      let list = new PriorityCache()
      assert.notEqual(list, undefined)
    })
  })
  describe('Behavior', function () {
    it('should correctly add a new element', function () {
      let list = new PriorityCache()
      list.set('a')
      // list.forEach((v, k) => {
      //   console.log(`(${k}, ${v.value})`)
      // })
      assert.equal(list.length, 1)
      // console.log(list._smallestPriority, list._highestPriority, typeof list._smallestPriority, typeof list._highestPriority)
      // console.log(list._priorityMap.get(list._smallestPriority).first())
      // console.log(list.leastFrequent, list.mostFrequent, list.lastRecentlyUsed, list.mostRecentlyUsed)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'a', 'most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'a', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')
    })
    it('should correctly add 2 different elements in the right order', function () {
      let list = new PriorityCache()
      list.set('a')
      list.set('b')
      assert.equal(list.length, 2)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'b', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'b', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')
    })
    it('should correctly set the frequency to 1 because you are resetting the value', function () {
      let list = new PriorityCache()
      list.set('a')
      list.get('a')
      assert.equal(list.getPriority('a'), 2)
      list.set('a')
      assert.equal(list.getPriority('a'), 1)
      assert.equal(list.size(), 1)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'a', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'a', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')
    })
    it('should correctly iterate on the list', function () {
      let list = new PriorityCache()
      list.set('a')
      list.set('b')
      list.set('c')
      list.forEach((e) => {})
    })
    it('should correctly set the frequency to 2  for element a (size = 2)', function () {
      let list = new PriorityCache()
      list.set('a')
      list.set('b')
      assert.equal(list.getPriority('a'), 1)
      assert.equal(list.getPriority('b'), 1)
      assert.equal(list.length, 2)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'b', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'b', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')
      list.get('a')
      assert.equal(list.getPriority('a'), 2)
      assert.equal(list.getPriority('b'), 1)
      assert.equal(list.leastFrequent.key, 'b', 'least frequent')
      assert.equal(list.mostFrequent.key, 'a', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'a', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'b', 'last Recently used')
    })

    it('should correctly set the frequency to 2  for element a (size = 4)', function () {
      let list = new PriorityCache()
      list.set('a')
      list.set('b')
      assert.equal(list.getPriority('a'), 1)
      assert.equal(list.getPriority('b'), 1)
      assert.equal(list.length, 2)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'b', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'b', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')
      list.set('c')
      assert.equal(list.length, 3)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'c', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'c', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')
      list.set('d')
      assert.equal(list.length, 4)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'd', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'd', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')

      list.get('a')
      assert.equal(list.getPriority('a'), 2)
      assert.equal(list.getPriority('b'), 1)
      assert.equal(list.leastFrequent.key, 'b', 'least frequent')
      assert.equal(list.mostFrequent.key, 'a', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'a', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'b', 'last Recently used')
    })
    it('should correctly add the new element at the beginning, not at the end after adding several elements and setting the frequency of a to 2 (size = 5)', function () {
      let list = new PriorityCache()
      list.set('a')
      list.set('b')
      assert.equal(list.getPriority('a'), 1)
      assert.equal(list.getPriority('b'), 1)
      assert.equal(list.length, 2)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'b', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'b', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')
      list.set('c')
      assert.equal(list.length, 3)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'c', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'c', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')
      list.set('d')
      assert.equal(list.length, 4)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'd', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'd', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')

      list.get('a')
      assert.equal(list.getPriority('a'), 2)
      assert.equal(list.getPriority('b'), 1)
      assert.equal(list.leastFrequent.key, 'b', 'least frequent')
      assert.equal(list.mostFrequent.key, 'a', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'a', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'b', 'last Recently used')

      list.set('e')
      assert.equal(list.getPriority('a'), 2)
      assert.equal(list.getPriority('b'), 1)
      assert.equal(list.leastFrequent.key, 'b', 'least frequent')
      assert.equal(list.mostFrequent.key, 'a', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'e', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'b', 'last Recently used')
    })
    it('should correctly add all elements with the right frequency', function () {
      const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'a', 'b', 'a', 'f', 'b', 'c']
      let list = new PriorityCache()
      setm(arr, list)
      assert.equal(list.leastFrequent.key, 'd', 'least frequent')
      assert.equal(list.mostFrequent.key, 'b', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'c', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'd', 'last Recently used')
    })
    it('should correctly set the frequency to 3 and a is the most frequent', function () {
      const arr = ['a', 'b', 'c', 'a', 'e', 'a']
      let list = new PriorityCache()
      setm(arr, list)
      assert.equal(list.getPriority('a'), 3)
      list.forEachWeight((e) => {
        // console.log(e, e.queue.first(), e.queue.last(), list._lastNode.node.value, list._lastNode.prev.node.value, list._lastNode.next.node.value)
      })
      assert.equal(list.leastFrequent.key, 'b', 'least frequent')
      assert.equal(list.mostFrequent.key, 'a', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'a', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'b', 'last Recently used')
    })

    it('should correctly set the frequency after settng a frequency to 6', function () {
      const arr = ['a', 'a', 'a', 'a', 'a', 'a']
      let list = new PriorityCache()
      setm(arr, list)
      list.forEach((e, k) => {
        // console.log(k, e.last)
      })
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'a', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'a', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')
      assert.equal(list.length, 1)
      assert.equal(list.size(), 1)
    })

    it('should have well set var (last/most recently used, least/most frequently) after deleting an item', function () {
      const arr = ['a', 'b', 'c', 'b']
      let list = new PriorityCache()
      setm(arr, list)
      assert.equal(list.length, 3)
      assert.equal(list.getPriority('a'), 1)
      assert.equal(list.getPriority('c'), 1)
      assert.equal(list.getPriority('b'), 2)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'b', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'b', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')
      list.delete('b')
      // console.log(list._history.first(), list._history.last(), list._priorityMap.get(list._smallestPriority).first(), list._priorityMap.get(list._highestPriority).last(),
      assert.equal(list.length, 2)
      assert.equal(list.getPriority('a'), 1)
      assert.equal(list.getPriority('c'), 1)
      assert.equal(list.getPriority('b'), false)
      assert.equal(list.leastFrequent.key, 'a', 'least frequent')
      assert.equal(list.mostFrequent.key, 'c', 'Most frequent')
      assert.equal(list.mostRecentlyUsed.key, 'c', 'Most Recently used')
      assert.equal(list.lastRecentlyUsed.key, 'a', 'last Recently used')
    })

    it('should correctly react with 10 000 elements', function (done) {
      this.timeout(5000)
      const max = 10000
      let list = new PriorityCache()
      for (let i = 0; i < max; ++i) {
        list.set(i, Math.random() * max)
      }
      assert(list.length, max)
      done()
    })
    it('should correctly react with 100 000 elements', function (done) {
      this.timeout(5000)
      const max = 100000
      let list = new PriorityCache()
      for (let i = 0; i < max; ++i) {
        list.set(i, Math.random() * max)
      }
      assert(list.length, max)
      done()
    })
    it('should correctly react with 1 000 000 elements', function (done) {
      this.timeout(50000)
      const max = 1000000
      let list = new PriorityCache()
      for (let i = 0; i < max; ++i) {
        list.set(i, Math.random() * max)
      }
      assert(list.length, max)
      done()
    })
    it('should correctly react with 100 000 elements in [1, 10]', function (done) {
      this.timeout(50000)
      const max = 100000
      const maxKey = 10
      function pick() {
        return Math.floor(Math.random() * maxKey + 1)
      }
      let list = new PriorityCache()
      for (let i = 0; i < max; ++i) {
        const p = pick()
        if(list.has(p)) {
          list.get(p)
        } else {
          list.set(p, p)
        }
        if(!list.mostFrequent) {
          list.forEachWeight(e => {
            console.log(e.weight, e.array, e.queue)
          })
          console.log('history length: ', list._history.length)
          console.log('MFU not correctly set')
        }
        if(!list.leastFrequent) console.log('LFU not correctly set')
        if(!list.mostRecentlyUsed) console.log('MRU not correctly set')
        if(!list.lastRecentlyUsed) console.log('LRU not correctly set')
        if(!list._lastNode) console.log('_lastNode not set, report !')
        // console.log(`ELEMENT: (${p}) MFU: ${list.mostFrequent.key}, LFU: ${list.leastFrequent.key}, LRU: ${list.lastRecentlyUsed.key}, MRU: ${list.mostRecentlyUsed.key}, FLENGTH: ${list._history.length} ${getHistorySize(list)}`)
        assert.notEqual(list.mostFrequent, undefined)
        assert.notEqual(list.leastFrequent, undefined)
        assert.notEqual(list.mostRecentlyUsed, undefined)
        assert.notEqual(list.lastRecentlyUsed, undefined)
      }
      assert.equal(list.length, maxKey)
      done()
    })
    // it('should correctly react with 100 000 000 elements', function (done) {
    //   this.timeout(50000)
    //   const max = 100000000
    //   let list = new PriorityCache()
    //   for (let i = 0; i < max; ++i) {
    //     list.set(i, Math.random() * max)
    //   }
    //   assert(list.length, max)
    //   done()
    // })
  })
})
