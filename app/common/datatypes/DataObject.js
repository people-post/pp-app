export class DataObject {
  #data;

  constructor(data) { this.#data = data; }

  toJsonData() { return this.#data; }

  _getData(name) { return this.#data[name]; }

  _getDataOrDefault(name, vDefault) {
    let d = this._getData(name);
    return d ? d : vDefault;
  }

  _setData(name, value) { this.#data[name] = value; }
}

// Maintain backward compatibility with global namespace
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.DataObject = DataObject;
}
