const deasync = require('deasync');

function logAfterNseconds(name, sec){
  return new Promise(res => {
    setTimeout(() => {
      console.log(name);
      resolve();
    }, sec *1000);
  });
}

function promiseSync(promise, ...args) {
  let done = false;
  let response;
  try {
    promise(...args).then((resp) => {
      console.log('Promise finished');
      done = true;
      response = resp;
    }).catch(e => {
      
    })
    require('deasync').loopWhile(function(){return !done;});
  } catch (e) {

  }
  console.log(response);
  return response;
}


promiseSync(logAfterNseconds, 'Arnaud', 2);
