// itemModule.js
const items = ["Sample 1", "Sample 2", "Sample 3"];

function addNewItem(item) {
  items.push(item);
}

function getTotalCount() {
  return items.length;
}

export function publicAddNewItem(item) {
  addNewItem(item);
}

export function publicGetTotalCount() {
  return getTotalCount();
}
