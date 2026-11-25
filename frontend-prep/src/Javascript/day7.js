
function flatten(arr, depth){
    let result = [];

    for(let item of arr){
        if(Array.isArray(item) && depth > 0){
            result.push(...flatten(item, depth-1));
        }else{
            result.push(item);
        }
    }

    return result;
}

function deepClone(obj, seen = new WeakMap()){

    if(obj === null || typeof obj !== "object"){
        return obj
    }
    // circular referrences
    if(seen.has(obj)){
        return seen.get(obj);
    }
    // handle Date
    if(obj instanceof Date){
        let result = new Date(obj.getTime());
        seen.set(obj,result);
        return result;
    }
    // handle map
    if(obj instanceof Map){
        const result = new Map();
        seen.set(obj,result);

        obj.forEach((key,val)=> {
            result.set(
                deepClone(key,seen), deepClone(val,seen)
            )
        })
        return result;
    }
    // Handle Set
    if (value instanceof Set) {
        const result = new Set();
        seen.set(value, result);

        value.forEach(item => {
            result.add(deepClone(item, seen));
        });

        return result;
    }
    if(Array.isArray(obj)){
        return obj.map((item)=> deepClone(item));
    }

    const result = {};
    for(let key in obj){
        if(Object.hasOwn(obj,key)){
            result[key] = deepClone(obj[key]);
        }
    }
}