import { ServerDataObject } from './ServerDataObject.js';
import { PhysicalGoodDelivery } from './PhysicalGoodDelivery.js';
import { DigitalGoodDelivery } from './DigitalGoodDelivery.js';
import { QueueServiceDelivery } from './QueueServiceDelivery.js';
import { AppointmentServiceDelivery } from './AppointmentServiceDelivery.js';

export class ProductDeliveryChoice extends ServerDataObject {
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
      obj = new PhysicalGoodDelivery(data);
      break;
    case this.constructor.TYPE.DIGITAL:
      obj = new DigitalGoodDelivery(data);
      break;
    case this.constructor.TYPE.QUEUE:
      obj = new QueueServiceDelivery(data);
      break;
    case this.constructor.TYPE.SCHEDULE:
      obj = new AppointmentServiceDelivery(data);
      break;
    default:
      console.log("Unsupported type: " + type);
      break;
    }
    return obj;
  }
};
