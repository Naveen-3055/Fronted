/* 
    throttling
*/

function throttle(fn, delay, options={}){
    const {leading=true, trailing=true} = options;

    let timer=null;
    let lastArgs ;
    let lastThis;
    let lastResult;
    let lastCallTime=0;

    function invokeFn(time){
        lastCallTime = time;
        lastResult = fn.apply(lastThis, lastArgs);

        lastArgs = lastThis = null;
        return lastResult;
    }

    function throttled(...args){
        const now = Date.now();

        if(!lastCallTime && !leading){
            lastCallTime = now;
        }

        const remaining = delay - (now - lastCallTime);

        lastArgs = args;
        lastThis = this;

        if(remaining<=0){
            if(timer){
                clearTimeout(timer);
                timer = null;
            }

            return invokeFn(now);
        }

        if(trailing && !timer){
            timer = setTimeout(()=> {
                timer = null;
                if(lastArgs){
                    invokeFn(Date.now());
                }
            },remaining);
        }
        return lastResult;
    }

    throttled.cancel = function(){
        clearTimeout(timer);

        timer = lastArgs = lastThis = null;
        lastCallTime = 0;
    }

// Purpose: Execute the pending trailing callback immediately rather than waiting for the remaining time.
    throttled.flush = function(){
        if(!timer){
            return lastResult;
        }
        clearTimeout(timer);
        timer=null;

        if(lastArgs){
            return invokeFn(Date.now());
        }
        return lastResult;
    }

    return throttled;
}

/*

Important interview point: lastArgs and lastThis are necessary because the trailing execution should use the latest call's arguments and context.

Throttling is a technique used to control how frequently a function executes. It ensures that a function executes at most once within a specified time interval.

In my implementation, I support both leading and trailing execution. Leading means the function executes immediately when an eligible time window begins. Trailing means if additional calls happen during the waiting period, I schedule one more execution at the end using the latest arguments.

I use lastInvokeTime to track the previous execution, timer to manage the trailing callback, and lastArgs and lastThis to preserve the latest arguments and execution context.

I also expose cancel() to discard a pending execution and flush() to execute it immediately.

This is useful for performance-sensitive operations like scroll handling, resize events and mouse movement.

*/