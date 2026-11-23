
// curry function
function curry(fn){
    function curried(...args){
        if(args.length >= fn.length){
            return fn.apply(this,args);
        }
        return function(...nextArgs){
            return curried.apply(this, [...args,...nextArgs]);
        }
    }
    return curried;
}

function add(a, b, c) {
    return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6

// uncurry function
function uncurry(fn){
    return function(...args){
        let result = fn;
        for(let arg of args){
            result = result(arg);
        }
        return result;
    }
}
function add(a) {
    return function (b) {
        return function (c) {
            return a + b + c;
        };
    };
}

const uncurriedAdd = uncurry(add);

console.log(uncurriedAdd(1, 2, 3)); // 6

// compose function combines multiple functions into one function.
// right to left
function compose(...fn){
    return function(value){
        return fn.reduceRight((acc,fn)=> fn(acc),value); 
    }
}

const result = compose(
    double,
    increment,
    square
);

console.log(result(3));

// pipe function, left to right

function pipe(...functions) {
    return function (value) {
        return functions.reduce(
            (acc, fn) => fn(acc),
            value
        );
    };
}

pipe(double, increment, square)(3);

// partial application

// Partial application fixes some arguments of a function in advance and returns a new function that accepts the remaining arguments.

function partial(fn,...presentArgs){
    return function(...laterArgs){
        return fn.apply(this, [...presentArgs, ...laterArgs]);
    }
}

function greet(greeting, name) {
    return `${greeting}, ${name}!`;
}

const sayHello = partial(greet, "Hello");

console.log(sayHello("Naveen"));