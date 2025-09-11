(function(dat) {

class ServerDataObject {
  constructor(data) {
    if (data.created_at) {
      data.created_at = new Date(data.created_at * 1000);
    }
    this._data = data;
  }

  getId() { return this._data.id; }
  getCreationTime() { return this._data.created_at; }
};

dat.ServerDataObject = ServerDataObject;
}(window.dat = window.dat || {}));