export class FrontPageLayoutConfig {
  // Synced with backend
  static T_LAYOUT = {
    TRIPLE : "TRIPLE",
  };

  #data;

  constructor(data) { this.#data = data; }

  getType() { return this.#data.type_id; }

  _getData(name) { return this.#data[name]; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.FrontPageLayoutConfig = FrontPageLayoutConfig;
}
