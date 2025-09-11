(function(dat) {
class Country {
  constructor(data) { this._data = data; }

  getName() { return this._data.name; }
};

dat.Country = Country;
}(window.dat = window.dat || {}));