import { ServerDataObject } from './ServerDataObject.js';

export class Vote extends ServerDataObject {
  // Synced with backend
  static T_VALUE = {YEA : "YEA", NAY: "NAY"};

  getUserId() { return this._data.user_id; }
  getItemId() { return this._data.item_id; }
  getValue() { return this._data.value; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.Vote = Vote;
}
