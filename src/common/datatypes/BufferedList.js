export class BufferedList {
  constructor() { this._items = []; }

  getObjects() { return this._items; }
  getLatestObjectId() {
    if (this._items.length) {
      return this._items[this._items.length - 1].getId();
    }
    return null;
  }

  extend(objects) {
    if (objects.length) {
      objects.sort(function(
          a, b) { return a.getCreationTime() > b.getCreationTime() ? 1 : -1 });
      let lastId = this.getLatestObjectId();
      if (objects[0].getId() == lastId) {
        objects.shift();
      }
    }
    for (let obj of objects) {
      this._items.push(obj);
    }
    return objects;
  }
};


