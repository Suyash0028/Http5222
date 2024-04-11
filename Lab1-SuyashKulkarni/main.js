// main.js
import { publicAddNewItem, publicGetTotalCount } from './itemModule.js';

// Example of using the module
publicAddNewItem("Item 1");
publicAddNewItem("Item 2");

console.log("Number of items:", publicGetTotalCount());
