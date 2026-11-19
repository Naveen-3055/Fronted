// Implement Async Task Queue

class AsyncTaskQueue{
    constructor(concurrencyLimit){
        this.concurrencyLimit = concurrencyLimit;
        this.running = 0;
        this.taskQueue = [];
    }

    queue(task){
        return new Promise((resolve, reject) => {
            this.taskQueue.push({
                task,
                resolve, 
                reject
            });
            this.runNext();
        })
    }

    runNext(){
        if(this.running >= this.concurrencyLimit || this.taskQueue.length === 0){
            return;
        }

        const {task, resolve, reject} = this.taskQueue.shift();
        this.running++;

        Promise.resolve()
        .then(()=> task())
        .then(resolve)
        .catch(reject)
        .finally(()=> {
            this.running--;
            this.runNext();
        })

        this.runNext(); // start additonal tasks if capacity is available.
    }
}

const queue = new AsyncTaskQueue(2);

const task1 = () =>
    new Promise(resolve =>
        setTimeout(() => resolve("Task 1 done"), 1000)
    );

const task2 = () =>
    new Promise((resolve, reject) =>
        setTimeout(() => reject("Task 2 failed"), 500)
    );

const task3 = () =>
    new Promise(resolve =>
        setTimeout(() => resolve("Task 3 done"), 200)
    );

queue.queue(task1).then(console.log).catch(console.error);
queue.queue(task2).then(console.log).catch(console.error);
queue.queue(task3).then(console.log).catch(console.error);


/*
    I would implement this using a FIFO queue to maintain the order of tasks and a running counter to track how many tasks are currently executing.

When a task is added, I create a Promise and store the task along with its resolve and reject callbacks in the queue. This is important because the task may not execute immediately due to the concurrency limit, but the caller should still receive a Promise that resolves or rejects when that task eventually completes.

I then check whether the number of running tasks is below the concurrency limit. If capacity is available, I dequeue the next task, increment the running count, and execute it.

Once the task completes, whether successfully or with an error, I use finally to decrement the running count and start the next waiting task.

This ensures that the concurrency limit is never exceeded, tasks are executed in FIFO order, and a failed task doesn't block the remaining tasks.

*/