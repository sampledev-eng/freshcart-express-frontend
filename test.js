const assert = require('assert');

function sortPriceAsc(items){
  return items.slice().sort((a,b)=>a.price-b.price);
}

const input=[{price:2},{price:1},{price:3}];
const sorted=sortPriceAsc(input);
assert.deepStrictEqual(sorted.map(i=>i.price),[1,2,3]);
console.log('Tests passed');
