import { ProductDelivery } from './ProductDelivery.js';
import { ProductServiceLocation } from './ProductServiceLocation.js';

export class QueueServiceDelivery extends ProductDelivery {
  constructor(data) {
    super(data);
    this._locations = [];
    for (let d of data.locations) {
      this._locations.push(this.#initLocation(d));
    }
  }

  getLocations() { return this._locations; }

  #initLocation(data) { return new ProductServiceLocation(data); }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.QueueServiceDelivery = QueueServiceDelivery;
}
