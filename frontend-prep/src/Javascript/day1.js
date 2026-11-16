/*
    1. once function
    2. memoize function
*/

function once(fn){
    let called = false;
    let result;

   return  function (...args) {
        if(!called){
            result = fn.apply(this, args);
            called = true;
        }

        return result;
    }
}

function greet(name){
    return `Hello ${name}`;
}

const onceGreet = once(greet);
console.log(onceGreet('john'));
console.log(onceGreet('doe'));


// basic memoize function
function memoize(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);

    if (key in cache) {
      console.log("Cache hit");
      return cache[key];
    }

    console.log("Cache miss");

    const result = fn.apply(this, args);
    cache[key] = result;

    return result;
  };
}

// here JSON stringify will be used for only simple primitive values but undefined values, functions, symbols, Objects with different referrences, circular referrences, BigInt, will give the same key. 
// to avoid above issues

function memoizeA(fn){
    let cache = new Map();

    return function(...args){
        const current = cache;

        for(let arg of args){
            if(!current.has(arg)){
                current.set(arg, new Map());
            }
            current = current.get(arg);

        }

        if(currrent.has('result')){
            return current.get('result');
        }

        const result = fn.apply(this,args);
        current.set('result', result);
        return result;
    }
}

// Why Map?
// - Supports undefined.
// - Supports null.
// - Supports symbols.
// - Supports BigInt.
// - Supports object references.
// - Doesn't convert arguments into strings.
 const weakMapCache = new WeakMap();
function memoizeB(fn){
   
    return function(obj){
        if(weakMapCache.has(obj)){
            return weakMapCache.get(obj);
        }
        const result = fn.apply(this, obj);
        weakMapCache.set(obj, result);
        return result;
    }
}