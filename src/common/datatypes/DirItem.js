import { ServerDataObject } from './ServerDataObject.js';

export class DirItem extends ServerDataObject {
  constructor(data, parentItem = null) {
    super(data);
    this._subItems = this.#initSubItems(data.sub_items);
    this._parentItem = parentItem;
  }

  isDir() { return true; }
  isEmpty() { return this._subItems.length == 0; }
  getName() { return this._data.name; }
  getSubItems() { return this._subItems; }
  getSubItem(id) {
    for (let i of this._subItems) {
      if (i.getId() == id) {
        return i;
      }
    }
    return null;
  }
  getPath() {
    let p = this._getPathItem();
    let items = p ? [ p ] : [];
    if (this._parentItem) {
      return this._parentItem.getPath().concat(items);
    }
    return items;
  }
  getParent() { return this._parentItem; }
  getDepth() {
    if (this._parentItem) {
      return this._parentItem.getDepth() + 1;
    } else {
      return 0;
    }
  }

  find(id) {
    for (let i of this._subItems) {
      if (i.getId() == id) {
        return i;
      }
      let ii = i.find(id);
      if (ii) {
        return ii;
      }
    }
    return null
  }

  _getPathItem() { return this.getName(); }
  _createSubItem(data) { return new DirItem(data, this); }

  #initSubItems(items) {
    let subItems = [];
    if (items) {
      for (let i of items) {
        subItems.push(this._createSubItem(i));
      }
    }
    return subItems;
  }
};
