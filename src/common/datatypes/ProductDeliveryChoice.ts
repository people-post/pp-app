import { ServerDataObject } from './ServerDataObject.js';
import { PhysicalGoodDelivery } from './PhysicalGoodDelivery.js';
import { DigitalGoodDelivery } from './DigitalGoodDelivery.js';
import { QueueServiceDelivery } from './QueueServiceDelivery.js';
import { AppointmentServiceDelivery } from './AppointmentServiceDelivery.js';

export class ProductDeliveryChoice extends ServerDataObject {
  static readonly TYPE = {
    GOOD: null,
    DIGITAL: 'DIGITAL',
    SCHEDULE: 'SCHEDULE',
    QUEUE: 'QUEUE',
  } as const;

  #obj: PhysicalGoodDelivery | DigitalGoodDelivery | QueueServiceDelivery | AppointmentServiceDelivery | null = null;

  constructor(data: Record<string, unknown>) {
    super(data);
    this.#obj = this.#initDataObj(this._data.type as string | null, this._data.data as Record<string, unknown> | undefined);
  }

  getType(): string | null {
    return (this._data.type as string | null) || null;
  }

  getDataObject(): PhysicalGoodDelivery | DigitalGoodDelivery | QueueServiceDelivery | AppointmentServiceDelivery | null {
    return this.#obj;
  }

  #initDataObj(
    type: string | null,
    data: Record<string, unknown> | undefined
  ): PhysicalGoodDelivery | DigitalGoodDelivery | QueueServiceDelivery | AppointmentServiceDelivery | null {
    let obj: PhysicalGoodDelivery | DigitalGoodDelivery | QueueServiceDelivery | AppointmentServiceDelivery | null = null;
    switch (type) {
      case ProductDeliveryChoice.TYPE.GOOD:
        obj = new PhysicalGoodDelivery(data || {});
        break;
      case ProductDeliveryChoice.TYPE.DIGITAL:
        obj = new DigitalGoodDelivery(data || {});
        break;
      case ProductDeliveryChoice.TYPE.QUEUE:
        obj = new QueueServiceDelivery(data || {});
        break;
      case ProductDeliveryChoice.TYPE.SCHEDULE:
        obj = new AppointmentServiceDelivery(data || {});
        break;
      default:
        console.log('Unsupported type: ' + type);
        break;
    }
    return obj;
  }
}

