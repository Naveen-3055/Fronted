// call invokes a function immediately with a specified this context and individually supplied arguments. To polyfill it, I temporarily attach the function to the target object using a unique Symbol, invoke it as a method so that this points to that object, remove the temporary property, and return the result.


Function.prototype.myCall  = function (context, ...args){
    context = context ?? globalThis;

    const fnSymbol = Symbol("fn");
    context[fnSymbol] = this;

    const result = context[fnSymbol](...args);

    delete context[fnSymbol];
    return result;
}

function greet(city) {
    return `Hello ${this.name} from ${city}`;
}

const user = { name: "Naveen" };

console.log(greet.myCall(user, "Bangalore"));

// Step 1: this inside myCall is the original function greet.

// Step 2: We temporarily attach the function to the object:
// user[fnSymbol] = greet;
// user = {
//     name: "Naveen",
//     temporaryFunction: greet
// };
// Step 3: Call it as a method of user.
// user[fnSymbol]("Bangalore");
// Step 4: Remove the temporary property.
// Step 5: Return the function's result.


// apply is similar to call, but it accepts arguments as an array or array-like collection. The polyfill uses the same temporary-property technique to set the function's context and spreads the argument collection during invocation.

Function.prototype.myApply = function (context, args=[]){
    context = context ?? globalThis;

    const fnSymbol = Symbol("fn");
    context[fnSymbol] = this;

    const result = context[fnSymbol](...args);

    delete context[fnSymbol];
    return result;
}


Function.prototype.myBind = function (context, ...presetArgs) {
    const fn = this;

    return function (...laterArgs) {
        return fn.apply(context, [...presetArgs, ...laterArgs]);
    };
};