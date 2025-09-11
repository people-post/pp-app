(function(dat) {
class QueueServiceDelivery extends dat.ProductDelivery {
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

dat.QueueServiceDelivery = QueueServiceDelivery;
}(window.dat = window.dat || {}));
