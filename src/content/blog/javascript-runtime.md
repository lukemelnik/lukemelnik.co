---
title: "The JavaScript Runtime"
description: "An overview of all the components that make up the JavaScript runtime."
publishDate: 2024-06-12
tags: ["javascript", "development", "Node.js"]
cover: "./javascript-runtime.png"
alt: "A diagram of the javascript runtime"
---

## What’s going on here?

Have a look at the code below and see if you can guess the order that the console logs will print in:

```js
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

const myPromise = new Promise((resolve) => {
  resolve();
});
myPromise.then(() => {
  console.log(3);
});

queueMicrotask(() => {
  console.log(4);
});

console.log(5);
```

If you guessed 1, 5, 3, 4, 2, then you probably already have a good understanding of how the JavaScript runtime works. If not, read on!

## The challenge of async

I think the challenge of asynchronous JavaScript is that we’re so used to ideas appearing sequentially in writing. Typically when you read, the text and the idea occur at the same time. For example, when you read this:

> She woke up, brushed her teeth, and went downstairs to make breakfast.

You don’t imagine her walking down the stairs, then waking up, then brushing her teeth. You imagine it in the same sequence it was written. That’s what’s so jarring when you’re introduced to async processes in JavaScript—you have to introduce a higher-level mental model to understand what’s happening because what you see is not what you get.

## Why is it single-threaded?

Now you might have heard that JavaScript is:

> a single-threaded, non-blocking, asynchronous, and concurrent programming language.

But why? Paradoxically, it was designed that way for simplicity. When Brendan Eich created JavaScript on his famous ten-day programming binge, the goal was a language that would be easy to use. It was meant to be an approachable alternative to Java for people who didn’t have a lot of experience with code or compilers, so multi-threading wasn’t an option.

So it would be single-threaded. That’s fine when you’re running lines of code that execute quickly, but what happens when we have a longer-running process like a timer or a network request? While we’re waiting for it to complete, the entire main thread would be blocked, and since that thread is also responsible for updating the UI, the entire window would be unresponsive. (If you want to experience it, just open up a browser tab, go to the console and enter this:

```JavaScript
while(true);
```

## Non-blocking & asynchronous

That’s where asynchronous processes come to the rescue. We might only have one thread where functions are executed, but we also have access to several web APIs that we can offload work to. So when you set a timer:

```js
setTimeout(() => {
  console.log("all done!");
}, 1000);
```

Instead of the main thread waiting for it to finish, it actually registers the timer externally, along with the callback to be executed when it’s done. But wait—how does that callback get back to the main thread?

## The event loop & the task queue

Enter our friends, the event loop and the task queue. The event loop is constantly checking the main thread to see if it’s empty. Code in the main thread is always prioritized, so it waits until it’s free before pushing on a callback from the task queue. So in the simple setTimeout example above, the order of events is like this:

1. setTimeout runs, registering a timer and the callback.
2. Once the timer is complete, the callback `() => console.log('all done')` gets pushed onto the task queue.
3. The event loop checks the main thread, then checks the task queue. It sees that the call stack is free, so it pushes on the callback.
4. The callback executes on the main thread.

And that’s how we can ensure that the main thread doesn’t get stuck. It’s also important to know that any callbacks inside browser events like clicks are also added to the task queue.

## One more trick—the microtask queue

But wait, there’s one more issue from the first code example…why is it printing 3 and 4 before 2?

The trick is that there are actually two queues—the task queue and the microtask queue, and the event loop gives priority to the latter. The microtask queue handles callbacks from promises, as well as anything manually created using queueMicrotask(), which is why even though the setTimeout was run first, its callback gets executed after the others.

Take a moment to marinate in that, and then check out this version, where we’ve added a setTimeout inside of the promise:

```js
console.log(1);

setTimeout(() => {
  console.log(2);
}, 0);

const myPromise = new Promise((resolve) => {
  setTimeout(() => resolve(), 0);
});
myPromise.then(() => {
  console.log(3);
});

queueMicrotask(() => {
  console.log(4);
});

console.log(5);
```

In this example, the order will be 1, 5, 4, 2, 3 (wait what?). Here’s what’s going on:

1. console.log(1) executes.
2. setTimeout sets up a new timer and registers the callback for console.log(2).
3. myPromise gets initialized, sets a new timer, and registers the callback resolve(). _Notice that it hasn’t registered console.log(3) yet! That won’t happen until resolve() is executed on the main thread._
4. queueMicrotask queues the callback for console.log(4) on the microtask queue.
5. console.log(5) executes.

Now we’ve got 1 and 5 printed to the console. After that, the event loop checks the queues, starting with the microtask queue:

1. The event loop pushes console.log(4) from the microtask queue and it executes.
2. The event loop pushes console.log(2) from the task queue and it executes.
3. The event loop pushes resolve() from the task queue and it executes.
4. The contents of myPromise.then (i.e., console.log(3)) are added to the microtask queue.
5. The event loop pushes console.log(3) to the call stack and it executes.

## Wrapping up

Phew! What a journey. It takes a bit to wrap your head around what’s happening, but now you can be confident your code is executing in the order you expect. Asynchronous processes allow us to unlock the full power of JavaScript. I hope this helped build a better mental model of how it works behind the scenes!
