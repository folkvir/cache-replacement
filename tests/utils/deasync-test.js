const deasyncpromise = require('../../src/utils/deasync-promise');
const delay = require('../../src/utils/delay');

const assert = require('assert');

function promise(val, time){
  return new Promise((resolve, reject) => {
    delay(time).then(() => {
      resolve(val);
    })
  });
}

function erroredPromise(val, time){
  return new Promise((resolve, reject) => {
    delay(time).then(() => {
      throw new Error('whatever');
      resolve(val);
    }).catch(e => {
      reject(e);
    })
  });
}


describe('DEASYNC-PROMISE', function() {
  it('should turn a promise to a sync promise', function () {
    const result = deasyncpromise(promise('test', 500));
    assert.equal(result, 'test');
  });
  it('should turn a promise to a sync promise and throw an error', function () {
    assert.doesNotThrow(() => {deasyncpromise(erroredPromise('test', 500))}, Error, 'whatever');
  });
});
