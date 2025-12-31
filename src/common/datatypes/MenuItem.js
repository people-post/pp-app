import { DirItem } from './DirItem.js';

export class MenuItem extends DirItem {
  getTagId() { return this._data.tag_id; }
  getTagIds() {
    let ids = this._data.tag_id ? [ this._data.tag_id ] : [];
    if (this._parentItem) {
      return ids.concat(this._parentItem.getTagIds());
    }
    return ids;
  }
  getTheme() { return this._parentItem ? this._parentItem.getTheme() : null; }

  _getPathItem() { return this.getTagId(); }
  _createSubItem(data) { return new MenuItem(data, this); }
};


