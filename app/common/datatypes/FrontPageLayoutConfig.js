(function(dat) {
class FrontPageLayoutConfig {
  // Synced with backend
  static T_LAYOUT = {
    TRIPLE : "TRIPLE",
  };

  #data;

  constructor(data) { this.#data = data; }

  getType() { return this.#data.type_id; }

  _getData(name) { return this.#data[name]; }
};

dat.FrontPageLayoutConfig = FrontPageLayoutConfig;
}(window.dat = window.dat || {}));
