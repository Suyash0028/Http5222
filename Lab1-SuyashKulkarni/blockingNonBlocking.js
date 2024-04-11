// blockingNonBlocking.js

// Example of Blocking
console.log("Start (Blocking Example)");

// Creating a time-taking task
function blocking() {
  for (let i = 0; i < 1000000000; i++) {
    // Some time-taking Task
  }
}

blocking(); // This will block the execution for some time (synchronous Task)

console.log("Blocking Ended");

// Example of Non blocking Code
console.log("Start (Non blocking Example)");

// Creating an asynchronous task using setTimeout
setTimeout(function () {
  console.log("Non blocking Task 1: This will be executed after 2 sec");
}, 2000); // This is Non blocking. It schedules the function to run after a delay of 2 secs

console.log("Non blocking Task 2: This will get executed immediately"); // This will be executed immediately not waiting for the timeout as there is no setTimeout

console.log("Non blocking Ended");
