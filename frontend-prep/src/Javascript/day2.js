/*

1. debouncing

*/


function debounce(func, delay, options={}){

    const {leading=false, trailing = true} = options;
    const timer = null;
    const lastArgs = null;
    const lastThis = null;
    const result = null;

    // execute the actual function
    function invoke(){
        const args = lastArgs;
        const context = lastThis;
        lastArgs = null;
        lastThis = null;
        result = func.apply(context, args);
        return result;
    }

    // controls the waiting period
    function startTimer(){
        timer = setTimeout(()=> {
            timer = null;
            if(trailing && lastArgs !== null){
                invoke();
            }else{
                lastArgs = null;
                lastThis = null;
            }
        }, delay);
    }

     function debounced(...args) {
    
        const isFirstCall = timer === null;

        if(timer !== null){
            clearTimeout(timer);
        }

        startTimer();

        if(isFirstCall && leading){
            lastArgs = null;
            lastThis = null;

            const currentArgs = args;
            const currentThis = this;
            result = func.apply(currentThis, currentArgs);
        }
        return result;
    }

    debounced.cancel = function(){
        if(timer !== null){
            clearTimeout(timer);
        }
        timer = null;
        lastArgs = null;
        lastThis = null;
    }

    debounced.flush = function(){
        if(timer == null){
            return result;
        }
        clearTimeout(timer);
        timer = null;
        if(trailing && lastArgs !== null){
            return invoke();
        }

        lastArgs = null;
        lastThis = null;
        return result;
    }
    return debounced;
}

// Real-world use cases for flush:
// - User clicks Submit while a debounced autosave is pending.
// - User navigates away and you want to save pending changes first.
// - A user presses Enter and you want to execute a pending search immediately.

/* 
    Note: flush() does not execute anything if there is no pending trailing call. Also, it doesn't cancel future calls to the debounced function.

*/