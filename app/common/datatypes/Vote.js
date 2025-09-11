(function(dat) {
class Vote extends dat.ServerDataObject {
  // Synced with backend
  static T_VALUE = {YEA : "YEA", NAY: "NAY"};

  getUserId() { return this._data.user_id; }
  getItemId() { return this._data.item_id; }
  getValue() { return this._data.value; }
};

dat.Vote = Vote;
}(window.dat = window.dat || {}));
