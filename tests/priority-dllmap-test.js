const PDLLMap = require('../src/utils/priority-double-linked-list.js');
const assert = require('assert');

const ENABLE_PRINT = true

const print = (queue) => {
  if(ENABLE_PRINT) {
    console.log('Print the pmdll: ');
    queue.forEach(function(val, node) {
      console.log(`** ${val}`);
    });
  }
};

describe('Priority Double Linked List with Map', function() {
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
    });
    it('should correctly add 2 different elements in the right order', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('b');
      assert.equal(list.length, 2);
      assert.equal(list.first(), 'b');
      assert.equal(list.last(), 'a');
    });
    it('should correctly set the frequency to 2 instead of creating 2 elements', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('a');
      assert.equal(list._map.get('a').priority, 2);
      print(list);
      assert.equal(list.length, 1);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'a');
    });
    it('should correctly iterate on the list', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('b');
      list.set('c');
      for(var n = list.node; n !== null; n = list.next(n)){
        console.log(n.value);
      }      
    });
    it('should correctly set the frequency to 2  for element a (size = 2)', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('b');
      assert.equal(list._map.get('a').priority, 1);
      assert.equal(list._map.get('b').priority, 1);
      print(list);
      assert.equal(list.length, 2);
      assert.equal(list.first(), 'b');
      assert.equal(list.last(), 'a');
      list.set('b');
      print(list);
      assert.equal(list._map.get('b').priority, 2);
      assert.equal(list._map.get('a').priority, 1);
      assert.equal(list.first(), 'a', 'First element need to be a');
      assert.equal(list.last(), 'b', 'Last element need to be b');
    });

    it('should correctly set the frequency to 2  for element a (size = 4)', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('b');
      assert.equal(list._map.get('a').priority, 1);
      assert.equal(list._map.get('b').priority, 1);
      print(list);
      assert.equal(list.length, 2);
      assert.equal(list.first(), 'b');
      assert.equal(list.last(), 'a');
      list.set('c');
      print(list);
      assert.equal(list.length, 3);
      assert.equal(list.first(), 'c');
      assert.equal(list.last(), 'a');
      list.set('d');
      print(list);
      assert.equal(list.length, 4);
      assert.equal(list.first(), 'd');
      assert.equal(list.last(), 'a');
      
      list.set('a');
      print(list);
      assert.equal(list._map.get('a').priority, 2);
      assert.equal(list._map.get('b').priority, 1);
      assert.equal(list.first(), 'a', 'First element need to be b');
      assert.equal(list.last(), 'd', 'Last element need to be a');

    });
    it('should correctly add the new element at the beginning, not at the end after adding several elements and setting the frequency of a to 2 (size = 5)', function() {
      let list = new PDLLMap();
      list.set('a');
      list.set('b');
      assert.equal(list._map.get('a').priority, 1);
      assert.equal(list._map.get('b').priority, 1);
      print(list);
      assert.equal(list.length, 2);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'b');
      list.set('c');
      print(list);
      assert.equal(list.length, 3);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'c');
      list.set('d');
      print(list);
      assert.equal(list.length, 4);
      assert.equal(list.first(), 'a');
      assert.equal(list.last(), 'd');
      
      list.set('a');
      print(list);
      assert.equal(list._map.get('a').priority, 2);
      assert.equal(list._map.get('b').priority, 1);
      assert.equal(list.first(), 'b', 'First element need to be b');
      assert.equal(list.last(), 'a', 'Last element need to be a');

      list.set('e');
      print(list);
      assert.equal(list._map.get('a').priority, 2);
      assert.equal(list._map.get('b').priority, 1);
      assert.equal(list.first(), 'b', 'First element need to be b');
      assert.equal(list.last(), 'a', 'Last element need to be a');

    });
  });
});
