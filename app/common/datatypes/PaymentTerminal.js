(function(dat) {
class PaymentTerminal extends dat.ServerDataObject {
  // Synced with backend
  static T_TYPE = {
    SQUARE_TERMINAL : "SQUARE_TERMINAL",
  };

  constructor(data) {
    super(data);
    this._dataObj = this.#initDataObj(data.type, data.data);
  }

  getName() { return this._data.name; }
  getType() { return this._data.type; }
  getState() { return this._data.state; }
  getStatus() { return this._data.status; }
  getDataObj() { return this._dataObj; }

  getTypeName() {
    let s = "";
    switch (this._data.type) {
    case this.constructor.T_TYPE.SQUARE_TERMINAL:
      s = "Square Terminal";
      break;
    default:
      break;
    }
    return s;
  }

  #initDataObj(type, data) {
    let obj = null;
    switch (type) {
    case this.constructor.T_TYPE.SQUARE_TERMINAL:
      obj = new dat.SquareTerminal(data);
      break;
    default:
      break;
    }
    return obj;
  }
};

dat.PaymentTerminal = PaymentTerminal;
}(window.dat = window.dat || {}));
