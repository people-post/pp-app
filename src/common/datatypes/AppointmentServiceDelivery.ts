import { ProductDelivery } from './ProductDelivery.js';
import { ProductServiceLocation } from './ProductServiceLocation.js';
import type { AppointmentServiceDeliveryData, ProductServiceLocationData } from '../../types/backend2.js';

export class AppointmentServiceDelivery extends ProductDelivery<AppointmentServiceDeliveryData> {
  #locations: ProductServiceLocation[] | undefined = undefined;

  getLocations(): ProductServiceLocation[] {
    if (this.#locations) {
      return this.#locations;
    }
    // Lazy load locations.
    this.#locations = [];
    if (this._data.locations) {
      for (const d of this._data.locations) {
        this.#locations.push(this.#initLocation(d));
      }
    }
    return this.#locations;
  }

  #initLocation(data: ProductServiceLocationData): ProductServiceLocation {
    return new ProductServiceLocation(data);
  }
}

