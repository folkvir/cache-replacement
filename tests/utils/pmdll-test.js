const PDLLMap = require('../../src/utils/pmdll.js');
const assert = require('assert');

const ENABLE_PRINT = (process.env.DEBUG==='pmdll')?true:false;

const setm = (arr, queue) => {
	arr.forEach(a => {
		if(ENABLE_PRINT) console.log(`Adding ${a} to the queue...`);
		queue.set(a);
	});
};

describe('PMDLL (PriorityMapDoubleLinkedList)', function() {
  describe('Creation of the list', function() {
    it('should return no error during the creation of the list', function() {
      let list = new PDLLMap();
      assert.notEqual(list, undefined);
    });
  });
  describe('Behavior', function() {
    it('should correctly add a new element', function() {
      let list = new PDLLMap();
      list.set('a');
      assert.equal(list.length, 1);
			assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'a');
    });
    it('should correctly add 2 different elements in the right order', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('b');
      assert.equal(list.length, 2);
      assert.equal(list.leastFrequent, 'a', 'least frequent');
      assert.equal(list.mostFrequent, 'b', 'most frequent');
    });
    it('should correctly set the frequency to 2 instead of creating 2 elements', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('a');
      assert.equal(list.getPriority('a'), 2);
      assert.equal(list.length, 1);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'a');
    });
    it('should correctly iterate on the list', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('b');
      list.set('c');
      list.forEach((e) => {
        if(ENABLE_PRINT) console.log(e);
      });
    });
    it('should correctly set the frequency to 2  for element a (size = 2)', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('b');
      assert.equal(list.getPriority('a'), 1);
      assert.equal(list.getPriority('b'), 1);
      assert.equal(list.length, 2);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'b');
      list.set('a');
      assert.equal(list.getPriority('a'), 2);
      assert.equal(list.getPriority('b'), 1);
      assert.equal(list.first(), 'b', 'First element need to be b');
      assert.equal(list.last(), 'a', 'Last element need to be a');
    });

    it('should correctly set the frequency to 2  for element a (size = 4)', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('b');
      assert.equal(list.getPriority('a'), 1);
      assert.equal(list.getPriority('b'), 1);
      assert.equal(list.length, 2);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'b');
      list.set('c');
      assert.equal(list.length, 3);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'c');
      list.set('d');
      assert.equal(list.length, 4);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'd');

      list.set('a');
      assert.equal(list.getPriority('a'), 2);
      assert.equal(list.getPriority('b'), 1);
      assert.equal(list.first(), 'b', 'First element need to be b');
      assert.equal(list.last(), 'a', 'Last element need to be a');

    });
    it('should correctly add the new element at the beginning, not at the end after adding several elements and setting the frequency of a to 2 (size = 5)', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('b');
      assert.equal(list.getPriority('a'), 1);
      assert.equal(list.getPriority('b'), 1);
      assert.equal(list.length, 2);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'b');
      list.set('c');
      assert.equal(list.length, 3);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'c');
      list.set('d');
      assert.equal(list.length, 4);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'd');

      list.set('a');
      assert.equal(list.getPriority('a'), 2);
      assert.equal(list.getPriority('b'), 1);
      assert.equal(list.first(), 'b', 'First element need to be b');
      assert.equal(list.last(), 'a', 'Last element need to be a');

      list.set('e');
      assert.equal(list.getPriority('a'), 2);
      assert.equal(list.getPriority('b'), 1);
      assert.equal(list.first(), 'b', 'First element need to be b');
      assert.equal(list.last(), 'a', 'Last element need to be a');

    });

		it('should correctly add the new element after adding several elements and setting the frequency of a to 2 (size = 5)', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('b');
      assert.equal(list.getPriority('a'), 1);
      assert.equal(list.getPriority('b'), 1);
      assert.equal(list.length, 2);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'b');
      list.set('c');
      assert.equal(list.length, 3);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'c');
      list.set('d');
      assert.equal(list.length, 4);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'd');

      list.set('a');
      assert.equal(list.getPriority('a'), 2);
      assert.equal(list.getPriority('b'), 1);
      assert.equal(list.first(), 'b', 'First element need to be b');
      assert.equal(list.last(), 'a', 'Last element need to be a');

      list.set('e');
      assert.equal(list.getPriority('a'), 2);
      assert.equal(list.getPriority('b'), 1);
      assert.equal(list.first(), 'b', 'First element need to be b');
      assert.equal(list.last(), 'a', 'Last element need to be a');

    });
		it('should correctly add all elements with the right frequency', function() {
			const arr = ['a', 'b', 'c', 'd', 'e', 'f', 'a', 'b', 'a', 'f', 'b', 'c'];
			let list = new PDLLMap();
      setm(arr, list);
			assert.equal(list.leastFrequent, 'd');
			assert.equal(list.last(), 'b');
    });
		it('should correctly set the frequency to 3 and a is the most frequent', function() {
			const arr = ['a', 'b', 'c', 'a', 'e', 'a'];
			let list = new PDLLMap();
      setm(arr, list);
			assert.equal(list.first(), 'b');
			assert.equal(list.last(), 'a');
    });

		it('should correctly set the frequency after settng a frequency to 6', function() {
			const arr = ['a', 'a', 'a', 'a', 'a', 'a'];
			let list = new PDLLMap();
      setm(arr, list);
			assert.equal(list.getPriority('a'), 6);
			assert.equal(list.last(), 'a');
    });

		it('should not remove th rest of the list', function() {
			const arr = ['a', 'b', 'c'];
			let list = new PDLLMap();
      setm(arr, list);
      assert.equal(list.length, 3)
      list.delete('b');
      assert.equal(list.length, 2)
      assert.equal(list.leastFrequent, 'a', 'least frequent');
      assert.equal(list.mostFrequent, 'c', 'most frequent');
    });

    it('should correctly react with 10 000 elements', function(done) {
      this.timeout(5000);
			const arr = Array(10000);
      for(let i = 0; i <arr.length; ++i){
        arr[i] = Math.random() * 10000
      }
			let list = new PDLLMap();
      setm(arr, list);
      assert(list.length, 10000);
      done();
    });
  });
});
