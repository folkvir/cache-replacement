const deasync = require('deasync');

module.exports = function(promise) {
  let result = undefined;
  try {
    promise.then(r => {
      result = r;
    }).catch(e => {
      result = e;
    });  
  } catch (error) {
    console.log('An error occured: ', error);
    result = error;
  }  
  while(!result) {
    deasync.runLoopOnce();
  }
  return result;
}

