export class FrontPageTemplateConfig {
  #data;

  constructor(data) { this.#data = data; }

  isLoginEnabled() { return true; }

  _getData(name) { return this.#data[name]; }
};

// Backward compatibility
if (typeof window !== 'undefined') {
  window.dat = window.dat || {};
  window.dat.FrontPageTemplateConfig = FrontPageTemplateConfig;
}
