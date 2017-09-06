const promiseUtil = require('../src/index.js');


var i = 0;

function getSomething(req) {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      i++;
      if (i % 5 === 3 || i % 5 === 4) {
        return reject(new Error('cannot get something'));
      } else {
        return resolve(i);
      }
    }, getRandomArbitary(40, 100));
  }).then(i => {
    console.log(req, ' => ', i);
    return i;
  }).catch(e => {
    console.log(req, ' => ', e.message);
    return Promise.reject(e);
  });
}

function getRandomArbitary(min, max) {
  return Math.random() * (max - min) + min;
}


const requests = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const toPromise = (req, i) => getSomething(req);

promiseUtil.batch(requests, toPromise, {
  interval: 100,
  retry: {
    count: 2,
    interval: 1000
  }
}).then(results => {
  console.log(results);
}).catch(e => {
  console.error('Error:', e.message);
  console.error('Unprocessed:', e.unprocessedRequests);
  process.exit(1);
});

// promiseUtil.parallel(requests, toPromise, {
//   limit: 3
// }).then(results => {
//   console.log(results);
// }).catch(e => {
//   console.error('Error:', e.message);
//   console.error('Errors:', e.errors.map(e => e.message));
//   console.error('Unprocessed:', e.unprocessedRequests);
//   process.exit(1);
// });