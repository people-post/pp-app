export class ProductDeliveryChoice extends dat.ServerDataObject {
  static TYPE =
      {GOOD : null, DIGITAL: "DIGITAL", SCHEDULE: "SCHEDULE", QUEUE: "QUEUE"};

  constructor(data) {
    super(data);
    this._obj = this.#initDataObj(data.type, data.data);
  }

  getType() { return this._data.type; }
  getDataObject() { return this._obj; }

  #initDataObj(type, data) {
    let obj;
    switch (type) {
    case this.constructor.TYPE.GOOD:
      obj = new dat.PhysicalGoodDelivery(data);
      break;
    case this.constructor.TYPE.DIGITAL:
      obj = new dat.DigitalGoodDelivery(data);
      break;
    case this.constructor.TYPE.QUEUE:
      obj = new dat.QueueServiceDelivery(data);
      break;
    case this.constructor.TYPE.SCHEDULE:
      obj = new dat.AppointmentServiceDelivery(data);
      break;
    default:
      console.log("Unsupported type: " + type);
      break;
    }
    return obj;
  }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.ProductDeliveryChoice = ProductDeliveryChoice;
}
