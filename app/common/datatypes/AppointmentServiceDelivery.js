export class AppointmentServiceDelivery extends dat.ProductDelivery {
  constructor(data) {
    super(data);
    this._locations = [];
    for (let d of data.locations) {
      this._locations.push(this.#initLocation(d));
    }
  }

  getLocations() { return this._locations; }

  #initLocation(data) { return new dat.ProductServiceLocation(data); }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.AppointmentServiceDelivery = AppointmentServiceDelivery;
}