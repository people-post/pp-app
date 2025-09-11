(function(dat) {
class Currency extends dat.ServerDataObject {
  getName() { return this._data.name; }
  getCode() { return this._data.code; }
  getSymbol() { return this._data.symbol; }
  getIcon() { return this._data.icon; }
};

dat.Currency = Currency;
}(window.dat = window.dat || {}));
