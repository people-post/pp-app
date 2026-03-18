import { PhysicalGoodDelivery } from './PhysicalGoodDelivery.js';
import { DigitalGoodDelivery } from './DigitalGoodDelivery.js';
import { QueueServiceDelivery } from './QueueServiceDelivery.js';
import { AppointmentServiceDelivery } from './AppointmentServiceDelivery.js';
import type { AppointmentServiceDeliveryData, DigitalGoodDeliveryData, ProductDeliveryBaseData, ProductDeliveryChoiceData, QueueServiceDeliveryData } from '../../types/backend2.js';

export class ProductDeliveryChoice {
  static readonly TYPE = {
    GOOD: null,
    DIGITAL: 'DIGITAL',
    SCHEDULE: 'SCHEDULE',
    QUEUE: 'QUEUE',
  } as const;

  #obj: PhysicalGoodDelivery | DigitalGoodDelivery | QueueServiceDelivery | AppointmentServiceDelivery | null = null;
  #data: ProductDeliveryChoiceData | null = null;

  constructor(data: ProductDeliveryChoiceData) {
    this.#data = data;
    this.#obj = this.#initDataObj(data.type, data.data);
  }

  getType(): string | null {
    return this.#data?.type ?? null;
  }

  getDataObject(): PhysicalGoodDelivery | DigitalGoodDelivery | QueueServiceDelivery | AppointmentServiceDelivery | null {
    return this.#obj;
  }

  #initDataObj(
    type: string | null,
    data: unknown
  ): PhysicalGoodDelivery | DigitalGoodDelivery | QueueServiceDelivery | AppointmentServiceDelivery | null {
    let obj: PhysicalGoodDelivery | DigitalGoodDelivery | QueueServiceDelivery | AppointmentServiceDelivery | null = null;
    switch (type) {
      case ProductDeliveryChoice.TYPE.GOOD:
        obj = new PhysicalGoodDelivery(data as ProductDeliveryBaseData);
        break;
      case ProductDeliveryChoice.TYPE.DIGITAL:
        obj = new DigitalGoodDelivery(data as DigitalGoodDeliveryData);
        break;
      case ProductDeliveryChoice.TYPE.QUEUE:
        obj = new QueueServiceDelivery(data as QueueServiceDeliveryData);
        break;
      case ProductDeliveryChoice.TYPE.SCHEDULE:
        obj = new AppointmentServiceDelivery(data as AppointmentServiceDeliveryData);
        break;
      default:
        console.log('Unsupported type: ' + type);
        break;
    }
    return obj;
  }
}

